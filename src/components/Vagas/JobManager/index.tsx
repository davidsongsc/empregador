"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useJobStore } from '@/store/useJobStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { sendGAEvent } from '@next/third-parties/google';
import { useRouter } from 'next/navigation';

import JobCard from '@/components/MiniComponents/JobCard';
import JobCardSkeleton from '@/components/MiniComponents/JobCardSkeleton';
import EmptyState from '@/components/Vagas/EmptyState';
import JobApplyModal from '@/components/JobApplyModal';

export function JobManager({ viewMode, category, search, page }: any) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    fetchJobs, 
    fetchCategories, 
    categories, 
    categoriesLoading, 
    cache, 
    loading 
  } = useJobStore();

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [openApply, setOpenApply] = useState(false);

  // Chave de cache idêntica à original para persistência
  const cacheKey = useMemo(() => {
    return `jobs-p${page}-s12-c${category || "all"}-u${user?.id || "guest"}-f-all`;
  }, [page, category, user]);

  const cachedEntry = cache[cacheKey];

  // Busca de dados baseada nas props vindas da URL (via Server Page)
  useEffect(() => {
    if (viewMode === 'categories') {
      fetchCategories(page);
    } else {
      fetchJobs({
        page,
        page_size: 12,
        search: search?.length > 2 ? search : undefined
      }, user, category);
    }
  }, [viewMode, category, search, page, user, fetchJobs, fetchCategories]);

  // Define o que exibir
  const displayData = useMemo(() => {
    if (viewMode === 'categories') return Array.isArray(categories) ? categories : [];
    return cachedEntry?.results || [];
  }, [viewMode, categories, cachedEntry]);

  // Ação ao clicar no Card
  const handleAction = useCallback((item: any) => {
    // Se for CATEGORIA (não tem descrição)
    if (item?.name && !item?.descricao) {
      sendGAEvent('event', 'select_content', {
        content_type: 'category',
        item_id: item.id,
        item_name: item.name
      });
      router.push(`?category=${item.id}`);
    } 
    // Se for VAGA
    else {
      sendGAEvent('event', 'view_item', {
        currency: 'BRL',
        value: item.salario ? Number(item.salario) : 0,
        items: [{
          item_id: item.uid,
          item_name: item.cargo_exibicao || item.cargo_nome,
        }]
      });
      setSelectedJob(item);
      setOpenApply(true);
    }
  }, [router]);

  const handleCloseModal = () => {
    setOpenApply(false);
    useApplicationStore.getState().refresh();
  };

  const isInitialLoading = (viewMode === 'categories' && categoriesLoading) || 
                           (viewMode === 'jobs' && loading && !cachedEntry);

  if (!isInitialLoading && displayData.length === 0) {
    return <EmptyState onReset={() => router.push('/vagas')} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {isInitialLoading ? (
          Array.from({ length: 8 }).map((_, i) => <JobCardSkeleton key={i} />)
        ) : (
          displayData.map((item: any) => (
            <JobCard
              key={item.id || item.uid}
              type={viewMode === 'categories' ? 'category' : 'job'}
              data={item}
              onAction={handleAction}
            />
          ))
        )}
      </div>

      <JobApplyModal
        user={user}
        open={openApply}
        onClose={handleCloseModal}
        job={selectedJob}
      />
    </>
  );
}