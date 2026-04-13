// Sem "use client"
import { StatCards } from '@/components/Vagas/StatCards';
import { SearchBar } from '@/components/Vagas/SearchBar';
import { JobManager } from '@/components/Vagas/JobManager';
import { ArrowLeft, ArrowLeftToLine, Terminal } from 'lucide-react';
import Link from 'next/link';

export default async function VagasPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const category = (params.category as string) || null;
  const search = (params.search as string) || "";
  const page = Number(params.page) || 1;

  const viewMode = !category && !search ? 'categories' : 'jobs';

  return (
    <div className="min-h-screen bg-delos-surface pt-20 md:pt-32 pb-20 font-mono">
      {/* SCANLINE OVERLAY - Estático */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />

      <div className="md:max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <header className="mb-12 space-y-10">
          <StatCards /> {/* Componente que pode buscar dados do DB direto no servidor */}

          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-delos-amber animate-pulse" />
                <span className="text-[10px] font-black text-delos-amber uppercase tracking-[0.4em]">
                  {viewMode === 'categories' ? 'Protocolo_Navegação' : 'Filtro_Ativo'}
                </span>
              </div>

              <h1 className="text-4xl md:text-8xl font-black text-delos-black uppercase italic tracking-tighter">
                {category ? "Filtrado" : "Oportunidades"}
              </h1>
            </div>

            <SearchBar initialValue={search} />
          </div>


        </header>

        <main className="min-h-[400px]">

          <JobManager
            // Agora usamos o params já "resolvido" para a key
            key={JSON.stringify(params)}
            viewMode={viewMode}
            category={category}
            search={search}
            page={page}
          />

          {/* Botão Flutuante Mobile & Link Desktop */}
          {viewMode === 'jobs' && (
            <>
              {/* Versão Desktop: Mantém o fluxo original abaixo do título */}
              <Link
                href="/vagas"
                className="hidden md:inline-flex items-center gap-2 text-sm font-black text-delos-black/40 hover:text-delos-amber uppercase tracking-[0.2em] mt-4 transition-colors group"
              >
                <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                Voltar para Categorias
              </Link>

              {/* Versão Mobile/Tablet: Flutuante no canto inferior */}
              <div className="md:hidden fixed bottom-8 right-4 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Link
                  href="/vagas"
                  className="flex items-center gap-3 bg-delos-black text-white px-6 py-4 shadow-[8px_8px_0px_0px_rgba(255,191,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0px_0px_rgba(255,191,0,1)] transition-all"
                >
                  <ArrowLeft className="w-4 h-4 text-delos-amber" />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Voltar
                  </span>
                </Link>
              </div>
            </>
          )}
        </main>

      </div>
    </div>
  );
}