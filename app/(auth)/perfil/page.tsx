"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, FileText, ChevronRight, GraduationCap,
  LogOut, MapPin, Camera, Mail, Activity, Terminal, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ExperienceManagerModal } from '@/components/Modal/ExperienceManagerModal';
import { useProfile } from '@/hooks/useProfile';
import { useAddressStore } from '@/store/useAddressStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useEducationStore } from '@/store/useEducationStore';

import { EducationManagerModal } from '@/components/Modal/EducationManagerModal';
import ApplicationDashboard from '@/components/ApplicationDashboard';
import PerfilLoading from '@/components/PerfilLoading';
import { EditProfileModal } from '@/components/Modal/ProfileEditModal';
import WorkExperience from '@/components/MiniComponents/WorkExperience';
import { toast } from '@/components/Notification';
import { sendGAEvent } from '@next/third-parties/google';
import SelectCompanyModal from '@/components/Modal/SelectCompany';

const ProfilePage = () => {
  const router = useRouter();
  const { logout, isAuthenticated, activeCompanyId, setActiveCompany } = useAuthStore();
  const { profile, loading: profileLoading, refresh } = useProfile();
  const [isOpenModal, setIsOpenModal] = useState(false);
  useEffect(() => {
    // 1. Sincronização: Aguarda o término do carregamento do perfil
    if (!profileLoading && profile?.memberships) {
      const empresas = profile.memberships;
      const totalEmpresas = empresas.length;

      // Caso o usuário não participe de nenhuma empresa, encerramos o protocolo
      if (totalEmpresas === 0) {
        setIsOpenModal(false);
        return;
      }

      // 2. REGRA DE AUTO-SELEÇÃO (Single Company)
      // Se tiver apenas 1 empresa e ainda não houver uma ativa selecionada:
      if (totalEmpresas === 1 && !activeCompanyId) {
        console.log("Protocolo_AutoSelect: Única unidade detectada. Sincronizando...");
        setActiveCompany(empresas[0].company_id);
        setIsOpenModal(false);
        return; // Finaliza a execução do efeito
      }

      // 3. REGRA DE MULTI-SELEÇÃO (Modal)
      // Só abre o modal se:
      // - Não houver empresa ativa (activeCompanyId está vazio)
      // - E o usuário participar de 2 ou mais empresas
      if (!activeCompanyId && totalEmpresas > 1) {
        setIsOpenModal(true);
      } else {
        // Se já houver uma empresa ativa ou for o caso de auto-seleção acima, fecha.
        setIsOpenModal(false);
      }
    }
  }, [profile, profileLoading, activeCompanyId, setActiveCompany]);
  
  const {
    data: applications,
    loading: appsLoading,
    total,
    fetchApplications

  } = useApplicationStore();
  const { addresses, fetchAddresses } = useAddressStore();
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { educations, fetchEducations, loading: eduLoading } = useEducationStore();

  const currentApps = useMemo(() => {
    return Array.isArray(applications) ? applications : (applications as any)?.items || [];
  }, [applications]);

  const currentAddress = useMemo(() => {
    return addresses.find(a => a.is_default) || addresses[0] || null;
  }, [addresses]);

  useEffect(() => {
    if (!profileLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, profileLoading, router]);

  useEffect(() => {
    if (isAuthenticated && profile?.usuario_id) {
      fetchAddresses(profile.usuario_id);
      fetchApplications();
      fetchEducations();
      sendGAEvent('event', 'view_profile', {
        user_id: profile.usuario_id,
        profile_completeness: profile.bio ? 'full' : 'incomplete',
        occupation: profile.ocupation || 'generalist'
      });
    }
  }, [profile?.usuario_id, isAuthenticated, fetchAddresses, fetchApplications, fetchEducations]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        toast.info("Uploading_Neural_Snapshot...");
      } catch (err) {
        toast.error("Upload_Failure");
      }
    }
  };

  if (profileLoading) return <PerfilLoading />;
  if (!isAuthenticated) return null;

  return (
    <div
      style={{ backgroundColor: 'var(--delos-surface)', color: 'var(--delos-black)' }}
      className="min-h-screen pt-20 md:pt-32 pb-20 px-4 transition-colors duration-500 font-mono relative overflow-hidden"
    >
      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 relative z-10">

        {/* SIDEBAR - Identity Block */}
        <aside className="lg:col-span-4 space-y-6 md:space-y-8 order-1">
          <div
            className="bg-white dark:bg-[#080808] border border-black/10 dark:border-white/5 rounded-none p-6 md:p-8 shadow-2xl relative overflow-hidden group transition-all"
          >
            <div className="absolute top-0 left-0 p-2 bg-[var(--delos-black)] text-[var(--delos-surface)] text-[7px] font-black tracking-[0.3em] uppercase">
              USER_ID::{profile?.usuario_id?.slice(0, 8) || "NULL"}
            </div>

            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
              <button
                onClick={logout}
                className="group p-2 flex items-center gap-2 text-gray-400 hover:text-[var(--delos-red)] transition-all font-black text-[9px] uppercase tracking-widest"
              >
                LOGOUT <LogOut className="w-3 h-3" />
              </button>
            </div>

            <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto mb-8 md:mb-10 mt-6 md:mt-4">
              <div className="absolute -inset-4 border border-indigo-600/20 rounded-full animate-[spin_10s_linear_infinite] border-dashed" />
              <div className="w-full h-full bg-[#111] rounded-full border-[1px] border-[var(--delos-black)] shadow-2xl overflow-hidden flex items-center justify-center relative">
                {profile?.foto_url ? (
                  <img src={profile.foto_url} alt="Avatar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <User className="w-16 h-16 text-gray-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent h-1/2 w-full animate-[pan_3s_infinite] pointer-events-none" />
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-[var(--delos-black)] text-white p-3 rounded-none shadow-lg hover:bg-[var(--delos-amber)] hover:text-black transition-all border border-white/10"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-none">
                {profile?.name ? `${profile.name} ${profile.last_name}` : 'Subject_Unknown'}
              </h2>

              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-[var(--delos-amber)] rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-[var(--delos-amber)] uppercase tracking-[0.3em]">
                  {profile?.ocupation || 'Cargo_Não_Identificado'}
                </span>
              </div>

              <div className="py-4 border-y border-black/5 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-center gap-2 opacity-60 text-[10px] uppercase tracking-widest font-bold">
                  <MapPin className="w-3 h-3 text-[var(--delos-amber)]" />
                  {currentAddress ? `${currentAddress.bairro}, ${currentAddress.cidade}` : 'GEO_LOC_NULL'}
                </div>
                <div className="flex items-center justify-center gap-2 opacity-40 text-[9px] lowercase font-bold tracking-tight">
                  <Mail className="w-3 h-3" />
                  {profile?.email_contato || 'email_null'}
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full py-5 bg-[var(--delos-black)] text-[var(--delos-surface)] rounded-none font-black text-[10px] uppercase tracking-[0.4em] hover:bg-[var(--delos-amber)] hover:text-black transition-all active:scale-95 shadow-2xl"
              >
                Sincronizar_Dados
              </button>
            </div>
          </div>

          {/* Links / Status Section */}
          <div className="bg-[var(--delos-black)] text-[var(--delos-surface)] p-6 md:p-8 rounded-none relative overflow-hidden border border-white/5 shadow-2xl">
            <Activity className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 text-indigo-500" />
            <h3 className="text-[var(--delos-amber)] font-black text-[10px] uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> System_Logs
            </h3>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-none">
                <p className="text-[8px] text-[var(--delos-amber)] uppercase mb-2 tracking-widest opacity-70 font-black">Profile_Completeness</p>
                <p className="text-[10px] opacity-70 leading-relaxed uppercase font-bold tracking-wider">
                  {profile?.bio
                    ? 'Protocolo Completo. Unidade pronta para recomendação.'
                    : 'Aviso: Dados de narrativa insuficientes para processamento.'}
                </p>
              </div>
              <div onClick={() => setIsEditModalOpen(true)} className="bg-white/5 border border-white/10 p-4 rounded-none hover:bg-[var(--delos-amber)] hover:text-black transition-all cursor-pointer group">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[8px] uppercase mb-1 tracking-widest font-black">Next_Task</p>
                    <p className="font-black text-[10px] uppercase tracking-tight italic">Otimizar_Matriz_Bio</p>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT - Applications & Timeline */}
        <main className="lg:col-span-8 space-y-6 md:space-y-8 order-2">

          <ApplicationDashboard applications={currentApps} totalCount={total} />

          {/* Bio Section */}
          <section className="bg-white dark:bg-[#080808] p-6 md:p-10 rounded-none border border-black/5 dark:border-white/5 shadow-sm relative transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 text-[var(--delos-black)]">
              <FileText size={60} />
            </div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30 mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[var(--delos-amber)]" /> Neural_Narrative
            </h3>
            <p className="font-black leading-relaxed text-xl md:text-2xl italic border-l-4 border-[var(--delos-amber)] pl-6 md:pl-10 opacity-90 tracking-tighter uppercase">
              "{profile?.bio || "Aguardando entrada de dados para compor perfil narrativo. Sem bio, o algoritmo de recomendação opera em modo limitado."}"
            </p>
          </section>

          {/* Grid Blocks: Experience & Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="relative group h-full">
              <WorkExperience onAddEntry={() => setIsExpModalOpen(true)} />
            </div>

            {/* Academic Section */}
            <div className="bg-white dark:bg-[#080808] p-6 md:p-8 rounded-none border border-black/5 dark:border-white/5 group transition-all relative h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div className="w-10 h-10 bg-[var(--delos-black)] text-[var(--delos-amber)] flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                  {eduLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
                </div>
                <button
                  onClick={() => setIsEduModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-black/10 dark:border-white/10 hover:bg-[var(--delos-black)] hover:text-[var(--delos-amber)] transition-all"
                >
                  <Terminal size={10} className="opacity-40" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Update_Academic</span>
                </button>
              </div>

              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 italic border-b border-black/5 pb-2">Academic_Stack</h3>

              <div className="space-y-6 flex-1">
                {educations.length ? educations.map((edu: any) => (
                  <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[var(--delos-amber)]/20 hover:before:bg-[var(--delos-amber)] transition-all">
                    <p className="font-black text-xs uppercase tracking-tight leading-tight">{edu.curso}</p>
                    <p className="text-[9px] opacity-50 font-black uppercase mt-2 tracking-wider">
                      {edu.instituicao} <span className="text-[var(--delos-amber)] ml-2">// CLASSE_{edu.data_inicio?.split('-')[0]}</span>
                    </p>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-10 border border-dashed border-black/10 opacity-30">
                    <p className="text-[10px] font-black italic uppercase tracking-[0.2em]">Academic_Null</p>
                    <button onClick={() => setIsEduModalOpen(true)} className="text-[8px] font-black underline mt-3 tracking-widest">Init_Sync</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes pan {
          from { transform: translateY(-100%); }
          to { transform: translateY(200%); }
        }
      `}</style>

      {/* MODALS */}
      <SelectCompanyModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); refresh(); }} />
      <ExperienceManagerModal isOpen={isExpModalOpen} onClose={() => setIsExpModalOpen(false)} profileId={profile?.id} />
      <EducationManagerModal isOpen={isEduModalOpen} onClose={() => setIsEduModalOpen(false)} profileId={profile?.id} />
    </div>
  );
};

export default React.memo(ProfilePage);