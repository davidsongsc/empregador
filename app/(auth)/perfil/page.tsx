"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, FileText, ChevronRight, Sparkles, Zap, GraduationCap,
  TrendingUp, LogOut, MapPin, Loader2, Camera, Mail,
  Briefcase, Plus, Activity, Terminal
} from 'lucide-react';
import { useBuscaCep } from '@/hooks/useBuscaCep';
import { useProfile } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyApplications } from '@/hooks/useMyApplications';
import ApplicationDashboard from '@/components/ApplicationDashboard';
import { toast } from '@/components/Notification';
import PerfilLoading from '@/components/PerfilLoading';
import { EditProfileModal } from '@/components/Modal/ProfileEditModal';

const App = () => {
   const { logout, isAuthenticated } = useAuthStore();
  const { profile, saveProfile, loading: profileLoading, isSaving } = useProfile();
  const { applications, loading: appsLoading, totalCount } = useMyApplications();
  const { lookup } = useBuscaCep();

  const [formData, setFormData] = useState({
    name: '', last_name: '', ocupation: '', email: '', bio: '', data_nascimento: '',
    endereco: { logradouro: '', bairro: '', numero: '', complemento: '', cidade: '', estado: '', cep: '' }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        last_name: profile.last_name || '',
        ocupation: profile.ocupation || '',
        email: profile.email || '',
        bio: profile.bio || '',
        data_nascimento: profile.data_nascimento || '',
        endereco: {
          logradouro: profile.endereco?.logradouro || '',
          bairro: profile.endereco?.bairro || '',
          numero: profile.endereco?.numero || '',
          complemento: profile.endereco?.complemento || '',
          cidade: profile.endereco?.cidade || '',
          estado: profile.endereco?.estado || '',
          cep: profile.endereco?.cep || ''
        }
      });
    }
  }, [profile]);

  // Handler CEP Automático
  useEffect(() => {
    const cleanCep = formData.endereco.cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      const fetchData = async () => {
        const data = await lookup(cleanCep);
        if (data) {
          setFormData(prev => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              logradouro: data.logradouro,
              cidade: data.localidade,
              estado: data.uf,
              bairro: data.bairro,
            }
          }));
        }
      };
      fetchData();
    }
  }, [formData.endereco.cep, lookup]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    try {
      await saveProfile(formData);
      toast.success("Perfil sincronizado com sucesso.");
      setIsEditModalOpen(false);
    } catch (err: any) {
      setFieldErrors(err.errors || {});
      toast.error("Verifique os campos obrigatórios.");
    }
  };

  if (appsLoading || profileLoading) return <PerfilLoading />;
  if (!isAuthenticated) return null;

  return (
    <div
      style={{ backgroundColor: 'var(--delos-surface)', color: 'var(--delos-black)' }}
      className="min-h-screen pt-32 pb-20 px-4 transition-colors duration-500 font-sans relative overflow-hidden"
    >
      {/* Efeito de Scanline Global sutil */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 relative z-10">

        {/* SIDEBAR - MONITORAMENTO DA UNIDADE */}
        <aside className="lg:col-span-4 space-y-8">
          <div
            style={{ borderColor: 'rgba(var(--delos-grey), 0.1)' }}
            className="bg-white dark:bg-[#080808] border rounded-sm p-8 shadow-2xl relative overflow-hidden group transition-all"
          >
            {/* ID Técnico da Unidade */}
            <div className="absolute top-0 left-0 p-2 bg-[var(--delos-black)] text-[var(--delos-surface)] text-[7px] font-mono tracking-[0.3em] uppercase">
              Host_Unit::DRV_{profile?.id?.slice(0, 5) || "NUL"}
            </div>

            <div className="absolute top-6 right-6 z-20">
              <button
                onClick={logout}
                className="group p-2 flex items-center gap-2 text-gray-400 hover:text-[var(--delos-red)] transition-all font-black text-[9px] uppercase tracking-widest"
              >
                Terminate <LogOut className="w-3 h-3" />
              </button>
            </div>

            <div className="relative w-44 h-44 mx-auto mb-10 mt-4">
              {/* Moldura de Foco de Câmera */}
              <div className="absolute -inset-4 border border-indigo-600/20 rounded-full animate-[spin_10s_linear_infinite] border-dashed" />

              <div className="w-full h-full bg-[#111] rounded-full border-[1px] border-[var(--delos-black)] shadow-2xl overflow-hidden flex items-center justify-center relative">
                {profile?.foto ? (
                  <img src={profile.foto} alt="Avatar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <User className="w-16 h-16 text-gray-700" />
                )}
                {/* Overlay de Scan do Rosto */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent h-1/2 w-full animate-[pan_3s_infinite] pointer-events-none" />
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ backgroundColor: 'var(--delos-indigo)' }}
                className="absolute bottom-2 right-2 text-white p-3 rounded-sm shadow-lg hover:bg-black transition-all border border-white/10"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                {profile?.name ? `${profile.name} ${profile.last_name}` : 'Subject_Unknown'}
              </h2>

              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-[var(--delos-amber)] rounded-full animate-pulse" />
                <span className="text-[10px] font-mono font-black text-[var(--delos-indigo)] uppercase tracking-[0.3em]">
                  {profile?.ocupation || 'Assignment_Pending'}
                </span>
              </div>

              <div className="py-4 border-y border-[var(--delos-grey)]/10 space-y-2">
                <div className="flex items-center justify-center gap-2 opacity-60 text-[10px] font-mono uppercase tracking-widest">
                  <MapPin className="w-3 h-3" />
                  {profile?.endereco?.cidade || 'Loc_Unknown'}
                </div>
                <div className="flex items-center justify-center gap-2 opacity-40 text-[10px] font-mono lowercase">
                  <Mail className="w-3 h-3" />
                  {profile?.email}
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                style={{ backgroundColor: 'var(--delos-black)', color: 'var(--delos-surface)' }}
                className="w-full py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.4em] hover:bg-[var(--delos-indigo)] transition-all active:scale-95 shadow-2xl"
              >
                Override_Profile_Data
              </button>
            </div>
          </div>

          {/* CAREER INTELLIGENCE - WESTWORLD WIDGET */}
          <div
            style={{ backgroundColor: 'var(--delos-black)', color: 'var(--delos-surface)' }}
            className="p-8 rounded-sm relative overflow-hidden border border-white/5 shadow-2xl"
          >
            <Activity className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 text-indigo-500" />
            <h3
              style={{ color: 'var(--delos-amber)' }}
              className="font-black text-[10px] uppercase tracking-[0.4em] mb-6 flex items-center gap-2"
            >
              <Terminal className="w-3 h-3" /> Cognitive_Link
            </h3>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-sm hover:bg-white/10 transition-all cursor-pointer group">
                <p className="text-[8px] font-mono text-[var(--delos-amber)] uppercase mb-2 tracking-widest opacity-70">Suggested_Evolution</p>
                <div className="flex justify-between items-center">
                  <p className="font-black text-xs uppercase tracking-tighter italic">Especialização: {profile?.ocupation}</p>
                  <ChevronRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL - DASHBOARD OPERACIONAL */}
        <main className="lg:col-span-8 space-y-8">
          <ApplicationDashboard applications={applications} totalCount={totalCount} />

          {/* BIOGRAFIA ESTILO RELATÓRIO TÉCNICO */}
          <section
            className="bg-white dark:bg-[#080808] p-10 rounded-sm border border-black/5 dark:border-white/5 shadow-sm relative transition-all"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <FileText size={40} />
            </div>
            <h3 className="text-[9px] font-mono font-black uppercase tracking-[0.5em] opacity-30 mb-8 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[var(--delos-indigo)]" /> Core_Narrative
            </h3>
            <p className="font-bold leading-relaxed text-2xl italic border-l-2 border-[var(--delos-indigo)] pl-8 opacity-90 tracking-tighter">
              "{profile?.bio || "Trajectory data not initialized. Please synchronize your executive summary."}"
            </p>
          </section>

          {/* GRIDS DE HISTÓRICO */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Experiência */}
            <div className="bg-white dark:bg-[#080808] p-8 rounded-sm border border-black/5 dark:border-white/5 group transition-all">
              <div className="flex justify-between items-center mb-8">
                <div className="w-10 h-10 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--delos-black)] group-hover:bg-[var(--delos-indigo)] group-hover:text-white transition-all border border-black/5 dark:border-white/10">
                  <Briefcase className="w-4 h-4" />
                </div>
                <button className="text-[8px] font-mono font-black text-[var(--delos-indigo)] uppercase tracking-[0.3em] hover:underline">
                  Add_Entry+
                </button>
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 italic">Work_History</h3>
              <div className="space-y-6">
                {profile?.experiences?.length ? profile.experiences.map((exp: any) => (
                  <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-indigo-500/20">
                    <p className="font-black text-xs uppercase tracking-tight">{exp.cargo}</p>
                    <p className="text-[10px] opacity-40 font-mono uppercase mt-1">{exp.empresa} // {exp.data_entrada?.split('-')[0]}</p>
                  </div>
                )) : <p className="text-[10px] font-mono opacity-30 italic">No records found in database.</p>}
              </div>
            </div>

            {/* Educação */}
            <div className="bg-white dark:bg-[#080808] p-8 rounded-sm border border-black/5 dark:border-white/5 group transition-all">
              <div className="flex justify-between items-center mb-8">
                <div className="w-10 h-10 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--delos-black)] group-hover:bg-[var(--delos-indigo)] group-hover:text-white transition-all border border-black/5 dark:border-white/10">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <button className="text-[8px] font-mono font-black text-[var(--delos-indigo)] uppercase tracking-[0.3em] hover:underline">
                  Add_Entry+
                </button>
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 italic">Academic_Logs</h3>
              <div className="space-y-6">
                {profile?.educations?.length ? profile.educations.map((edu: any) => (
                  <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-indigo-500/20">
                    <p className="font-black text-xs uppercase tracking-tight">{edu.curso}</p>
                    <p className="text-[10px] opacity-40 font-mono uppercase mt-1">{edu.instituicao}</p>
                  </div>
                )) : <p className="text-[10px] font-mono opacity-30 italic">Academic history not synchronized.</p>}
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

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default React.memo(App);