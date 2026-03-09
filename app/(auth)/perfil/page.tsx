"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, FileText, Bell, ChevronRight, Sparkles, Target, Zap, GraduationCap, 
  TrendingUp, LogOut, MapPin, X, Save, Loader2, Camera, Mail, AlertCircle,
  LayoutDashboard, Briefcase, Calendar, Award, Plus, MapPinned
} from 'lucide-react';
import { useBuscaCep } from '@/hooks/useBuscaCep';
import { useProfile } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyApplications } from '@/hooks/useMyApplications';
import ApplicationDashboard from '@/components/ApplicationDashboard';
import { toast } from '@/components/Notification';
import PerfilLoading from '@/components/PerfilLoading';
import { uploadProfilePhoto } from '@/services/auth';

const App = () => {
  const { logout, isAuthenticated } = useAuthStore();
  const { profile, saveProfile, loading: profileLoading, isSaving } = useProfile();
  const { applications, loading: appsLoading, totalCount } = useMyApplications();
  const { lookup, loading: cepLoading } = useBuscaCep();

  const [formData, setFormData] = useState({
    name: '', last_name: '', ocupation: '', email: '', bio: '', data_nascimento: '',
    endereco: { logradouro: '', bairro: '', numero: '', complemento: '', cidade: '', estado: '', cep: '' }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [isUploading, setIsUploading] = useState(false);

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

  // Handler para busca de CEP automático
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

  const hasError = (fieldName: string, nested?: string) => {
    if (nested) return !!fieldErrors[nested]?.[fieldName];
    return !!fieldErrors[fieldName];
  };

  if (appsLoading || profileLoading) return <PerfilLoading />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20 px-4 text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR - Inspirada no minimalismo da Dellos */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-6 right-6 z-20">
              <button onClick={logout} className="group p-2 flex items-center gap-2 text-gray-400 hover:text-red-600 transition-all font-bold text-[10px] uppercase tracking-tighter">
                Sair <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-40 h-40 mx-auto mb-8">
              <div className="w-full h-full bg-[#f3f4f6] rounded-full border-[6px] border-white shadow-xl overflow-hidden flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                ) : profile?.foto ? (
                  <img src={profile.foto} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-300" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-black transition-colors border-4 border-white"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-2">
                {profile?.name ? `${profile.name} ${profile.last_name}` : 'Novo Membro'}
              </h2>
              <div className="inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                {profile?.ocupation || 'Cargo não definido'}
              </div>

              <div className="grid grid-cols-1 gap-3 mb-8">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {profile?.endereco?.cidade ? `${profile.endereco.cidade}, ${profile.endereco.estado}` : 'Localização pendente'}
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-bold">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  {profile?.email}
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full py-5 bg-black text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-indigo-100"
              >
                Editar Perfil Corporativo
              </button>
            </div>
          </div>

          {/* Widget IA - Westworld Style */}
          <div className="bg-black p-8 rounded-[32px] text-white relative overflow-hidden">
            <Sparkles className="absolute -right-6 -top-6 w-32 h-32 opacity-10" />
            <h3 className="font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-2 text-indigo-400">
              <TrendingUp className="w-4 h-4" /> Career Intelligence
            </h3>
            <div className="space-y-3">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-black text-indigo-300 uppercase mb-1 italic">Proxima Skill</p>
                    <p className="font-bold text-sm">Especialização em {profile?.ocupation}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="lg:col-span-8 space-y-8">
          <ApplicationDashboard applications={applications} totalCount={totalCount} />

          {/* Biografia */}
          <section className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Resumo Executivo
            </h3>
            <p className="text-gray-600 font-bold leading-relaxed text-xl italic border-l-4 border-indigo-600 pl-6">
              "{profile?.bio || "Sua trajetória profissional começa com um bom resumo. Clique em editar para adicionar."}"
            </p>
          </section>

          {/* Experiências e Educação Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm group">
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                  <Briefcase className="w-5 h-5" />
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              </div>
              <h3 className="text-lg font-black uppercase italic mb-4">Experiência</h3>
              <div className="space-y-4">
                {profile?.experiences?.length ? profile.experiences.map((exp: any) => (
                  <div key={exp.id} className="border-l-2 border-gray-100 pl-4 py-1">
                    <p className="font-bold text-sm text-gray-900">{exp.cargo}</p>
                    <p className="text-xs text-gray-500">{exp.empresa} • {exp.data_entrada.split('-')[0]}</p>
                  </div>
                )) : <p className="text-xs text-gray-400 italic font-bold">Nenhuma experiência registrada.</p>}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm group">
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              </div>
              <h3 className="text-lg font-black uppercase italic mb-4">Educação</h3>
              <div className="space-y-4">
                {profile?.educations?.length ? profile.educations.map((edu: any) => (
                  <div key={edu.id} className="border-l-2 border-gray-100 pl-4 py-1">
                    <p className="font-bold text-sm text-gray-900">{edu.curso}</p>
                    <p className="text-xs text-gray-500">{edu.instituicao}</p>
                  </div>
                )) : <p className="text-xs text-gray-400 italic font-bold">Histórico acadêmico vazio.</p>}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL DE EDIÇÃO - Atualizado com campos faltantes */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden">
              
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-black p-2 rounded-lg text-white"><User className="w-4 h-4" /></div>
                  <h2 className="text-xl font-black uppercase italic">Configuração de Perfil</h2>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="p-8 max-h-[80vh] overflow-y-auto space-y-8">
                {/* Dados Básicos */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Nome</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Sobrenome</label>
                    <input type="text" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Nascimento</label>
                    <input type="date" value={formData.data_nascimento} onChange={e => setFormData({ ...formData, data_nascimento: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Cargo Atual</label>
                    <input type="text" value={formData.ocupation} onChange={e => setFormData({ ...formData, ocupation: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Email Profissional</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Bio / Pitch Pessoal</label>
                  <textarea rows={3} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all resize-none" />
                </div>

                {/* Localização Detalhada */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-[10px] font-black uppercase text-indigo-600 mb-6 flex items-center gap-2">
                    <MapPinned className="w-4 h-4" /> Localização & Endereço
                  </h4>
                  <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-400">CEP</label>
                      <input type="text" value={formData.endereco.cep} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, cep: e.target.value } })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all" />
                    </div>
                    <div className="md:col-span-8 space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-400">Logradouro (Rua/Avenida)</label>
                      <input type="text" value={formData.endereco.logradouro} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, logradouro: e.target.value } })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all" />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-400">Número</label>
                      <input type="text" value={formData.endereco.numero} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all" />
                    </div>
                    <div className="md:col-span-9 space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-400">Complemento / Referência</label>
                      <input type="text" value={formData.endereco.complemento} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, complemento: e.target.value } })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all" />
                    </div>
                    <div className="md:col-span-5 space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-400">Bairro</label>
                      <input type="text" value={formData.endereco.bairro} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all" />
                    </div>
                    <div className="md:col-span-5 space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-400">Cidade</label>
                      <input type="text" value={formData.endereco.cidade} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-400">UF</label>
                      <input type="text" maxLength={2} value={formData.endereco.estado} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value.toUpperCase() } })} className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-4 px-5 font-bold outline-none transition-all text-center" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {isSaving ? "Processando..." : "Sincronizar Dados"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(App);