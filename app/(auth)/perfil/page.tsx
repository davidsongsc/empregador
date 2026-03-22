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

const App = () => {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuthStore();
  const { profile, loading: profileLoading, refresh } = useProfile();
  const {
    data: applications,
    loading: appsLoading,
    total,
    fetchApplications,
    refresh: refreshApps
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
        // Logica de upload aqui
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
      className="min-h-screen pt-32 pb-20 px-4 transition-colors duration-500 font-sans relative overflow-hidden"
    >
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 relative z-10">
        <aside className="lg:col-span-4 space-y-8">
          <div
            style={{ borderColor: 'rgba(var(--delos-grey), 0.1)' }}
            className="bg-white dark:bg-[#080808] border rounded-sm p-8 shadow-2xl relative overflow-hidden group transition-all"
          >
            <div className="absolute top-0 left-0 p-2 bg-[var(--delos-black)] text-[var(--delos-surface)] text-[8px] font-mono tracking-[0.3em] uppercase">
              USER_{profile?.id?.slice(0, 5) || "Nome"}
            </div>

            <div className="absolute top-6 right-6 z-20">
              <button
                onClick={logout}
                className="group p-2 flex items-center gap-2 text-gray-400 hover:text-[var(--delos-red)] transition-all font-black text-[9px] uppercase tracking-widest"
              >
                sAIR <LogOut className="w-3 h-3" />
              </button>
            </div>

            <div className="relative w-44 h-44 mx-auto mb-10 mt-4">
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
                style={{ backgroundColor: 'var(--delos-indigo)' }}
                className="absolute bottom-2 right-2 text-white p-3 rounded-sm shadow-lg hover:bg-black transition-all border border-white/10"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                {profile?.name ? `${profile.name} ${profile.last_name}` : 'Subject_Unknown'}
              </h2>

              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-[var(--delos-amber)] rounded-full animate-pulse" />
                <span className="text-[10px] font-mono font-black text-[var(--delos-indigo)] uppercase tracking-[0.3em]">
                  {profile?.ocupation || 'Profissão não informada!'}
                </span>
              </div>

              <div className="py-4 border-y border-[var(--delos-grey)]/10 space-y-2">
                <div className="flex items-center justify-center gap-2 opacity-60 text-[10px] font-mono uppercase tracking-widest">
                  <MapPin className="w-3 h-3" />
                  {currentAddress
                    ? `${currentAddress.bairro}, ${currentAddress.cidade}`
                    : 'Endereço não cadastrado!'}
                </div>
                <div className="flex items-center justify-center gap-2 opacity-40 text-[10px] font-mono lowercase">
                  <Mail className="w-3 h-3" />
                  {profile?.email_contato || 'email não informado!'}
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                style={{ backgroundColor: 'var(--delos-black)', color: 'var(--delos-surface)' }}
                className="w-full py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.4em] hover:bg-[var(--delos-indigo)] transition-all active:scale-95 shadow-2xl"
              >
                Atualizar Dados
              </button>
            </div>
          </div>

          <div
            style={{ backgroundColor: 'var(--delos-black)', color: 'var(--delos-surface)' }}
            className="p-8 rounded-sm relative overflow-hidden border border-white/5 shadow-2xl"
          >
            <Activity className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 text-indigo-500" />

            <h3
              style={{ color: 'var(--delos-amber)' }}
              className="font-black text-[10px] uppercase tracking-[0.4em] mb-6 flex items-center gap-2"
            >
              <Terminal className="w-3 h-3" /> Links
            </h3>

            <div className="space-y-4">

              <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                <p className="text-[8px] font-mono text-[var(--delos-amber)] uppercase mb-2 tracking-widest opacity-70">
                  Profile_Status
                </p>

                <p className="font-black text-xs uppercase tracking-tight">
                  {profile?.ocupation || 'Generalist'}
                </p>

                <p className="text-[10px] opacity-60 mt-2 leading-relaxed">
                  {profile?.bio
                    ? 'Perfil identificado. Dados suficientes para recomendação estratégica.'
                    : 'Perfil incompleto. Adicione uma bio para desbloquear recomendações mais precisas.'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-sm hover:bg-white/10 transition-all cursor-pointer group">
                <p className="text-[8px] font-mono text-[var(--delos-amber)] uppercase mb-2 tracking-widest opacity-70">
                  Suggested_Evolution
                </p>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-black text-xs uppercase tracking-tight italic">
                      {profile?.ocupation
                        ? `Aprimorar especialização em ${profile.ocupation}`
                        : 'Definir especialização principal'}
                    </p>

                    <p className="text-[10px] opacity-60 mt-1">
                      {profile?.bio
                        ? 'Refine sua bio com resultados, métricas e diferenciais.'
                        : 'Descreva experiência, habilidades e objetivos.'}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-sm">
                <p className="text-[8px] font-mono text-indigo-400 uppercase mb-2 tracking-widest opacity-70">
                  Impact
                </p>

                <p className="text-[10px] leading-relaxed opacity-70">
                  Perfis completos têm maior visibilidade, melhor correspondência com oportunidades
                  e aumento na taxa de contato.
                </p>
              </div>

            </div>
          </div>
        </aside>

        <main className="lg:col-span-8 space-y-8">
          <ApplicationDashboard applications={currentApps} totalCount={total} />

          <section className="bg-white dark:bg-[#080808] p-10 rounded-sm border border-black/5 dark:border-white/5 shadow-sm relative transition-all">
            <FileText className="absolute top-0 right-0 p-3 opacity-10" size={40} />
            <h3 className="text-[9px] font-mono font-black uppercase tracking-[0.5em] opacity-30 mb-8 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[var(--delos-indigo)]" /> Core_Narrative
            </h3>
            <p className="font-bold leading-relaxed text-2xl italic border-l-2 border-[var(--delos-indigo)] pl-8 opacity-90 tracking-tighter">
              "{profile?.bio || "Complete sua bio e aumente suas chances de destaque. Perfis completos geram mais confiança e são priorizados nas buscas."}"
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative group">

              <WorkExperience onAddEntry={() => setIsExpModalOpen(true)} />
            </div>

            {/* Bloco de Educação (Refatorado para usar Store + Modal) */}
            <div className="bg-white dark:bg-[#080808] p-8 rounded-sm border border-black/5 dark:border-white/5 group transition-all relative">
              <div className="flex justify-between items-center mb-8">
                <div className="w-10 h-10 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--delos-black)] group-hover:bg-[var(--delos-indigo)] group-hover:text-white transition-all border border-black/5 dark:border-white/10">
                  {eduLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
                </div>

                <button
                  onClick={() => setIsEduModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-black/10 dark:border-white/10 hover:border-[var(--delos-amber)] hover:text-[var(--delos-amber)] transition-all group/btn"
                >
                  <Terminal size={10} className="opacity-40" />
                  <span className="text-[8px] font-mono font-black uppercase tracking-widest">Manage_Logs</span>
                </button>
              </div>

              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 italic">Academic_Logs</h3>

              <div className="space-y-6">
                {educations.length ? educations.map((edu: any) => (
                  <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-indigo-500/20 hover:before:bg-indigo-500 transition-colors">
                    <p className="font-black text-xs uppercase tracking-tight">{edu.curso}</p>
                    <p className="text-[10px] opacity-40 font-mono uppercase mt-1">
                      {edu.instituicao} <span className="text-[var(--delos-amber)] opacity-60 ml-2">// {edu.data_inicio?.split('-')[0]}</span>
                    </p>
                  </div>
                )) : (
                  <div className="flex flex-col items-center py-4 border border-dashed border-black/10 opacity-30">
                    <p className="text-[10px] font-mono opacity-30 italic uppercase">Empty_Database</p>
                    <button onClick={() => setIsEduModalOpen(true)} className="text-[8px] font-black underline mt-2">Initialize_Sync</button>
                  </div>
                )}
              </div>
            </div>


          </div>
        </main>
      </div >

      <style jsx global>{`
        @keyframes pan {
          from { transform: translateY(-100%); }
          to { transform: translateY(200%); }
        }
      `}</style>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          refresh();

        }}
      />

      {/* Novo Terminal de Gestão de Experiências */}
      <ExperienceManagerModal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        profileId={profile?.id}
      />
      <EducationManagerModal
        isOpen={isEduModalOpen}
        onClose={() => setIsEduModalOpen(false)}
        profileId={profile?.id}
      />
    </div >
  );
};

export default React.memo(App);