"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, FileText, Bell, ChevronRight,
  Sparkles, Target, Zap, GraduationCap, TrendingUp,
  LogOut, MapPin, X, Save, Loader2, Camera, Mail, AlertCircle
} from 'lucide-react';

import ApplicationDashboard from '@/components/ApplicationDashboard';
import PerfilLoading from '@/components/PerfilLoading';
import { toast } from "@/components/Notification";
import { useMyApplications } from '@/hooks/useMyApplications';
import { useProfile } from '@/hooks/useProfile';
import { uploadProfilePhoto } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';

const PerfilPage = () => {
  const { logout, user, loading, isAuthenticated } = useAuthStore();
  const { profile, saveProfile, loading: profileLoading, isSaving } = useProfile();
  const { applications, loading: appsLoading, totalCount } = useMyApplications();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>({}); // Erros específicos por input
  const [isUploading, setIsUploading] = useState(false);
  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove tudo que não é número
      .replace(/(\d{2})(\d)/, "$1.$2") // Coloca o ponto após os 2 primeiros dígitos
      .replace(/(\d{3})(\d)/, "$1-$2") // Coloca o hífen após os 3 próximos dígitos
      .replace(/(-\d{3})\d+?$/, "$1"); // Limita a 8 dígitos + formatação
  };
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    ocupation: '',
    email: '',
    bio: '',
    endereco: {
      logradouro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  });

  // Sincroniza dados do profile para o form
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        last_name: profile.last_name || '',
        ocupation: profile.ocupation || '',
        email: profile.email || '',
        bio: profile.bio || '',
        endereco: {
          logradouro: profile.endereco?.logradouro || '',
          cidade: profile.endereco?.cidade || '',
          estado: profile.endereco?.estado || '',
          cep: profile.endereco?.cep || ''
        }
      });
    }
  }, [profile]);



  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      // O saveProfile usa a nossa nova api() que já chama useAuthStore.getState().setUser()
      await saveProfile(formData);

      toast.success("Perfil atualizado com sucesso!");
      setIsEditModalOpen(false);
    } catch (err: any) {
      // A nova api.ts já formata o erro estruturado
      const errorsFromServer = err.errors;

      if (errorsFromServer) {
        setFieldErrors(errorsFromServer);
        const msg = "Existem campos obrigatórios não preenchidos.";

        toast.error(msg);
      } else {
        const msg = err.message || "Ocorreu um erro inesperado.";

        toast.error(msg);
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // 1. O uploadProfilePhoto deve retornar o objeto user atualizado
      const res = await uploadProfilePhoto(file);

      // 2. REMOVIDO: await refreshSession(); 
      // Não é mais necessário! O Store já foi atualizado pela api.ts ou pelo retorno do res.

      toast.success("Foto de perfil atualizada!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar foto.");
    } finally {
      setIsUploading(false);
    }
  };
  // Função auxiliar para checar se campo tem erro
  const hasError = (fieldName: string, nested?: string) => {
    if (nested) return !!fieldErrors[nested]?.[fieldName];
    return !!fieldErrors[fieldName];
  };

  if (loading || appsLoading || profileLoading) return <PerfilLoading />;
  if (!isAuthenticated) return null;

  const sugestoesIA = [
    { titulo: "UI/UX Design", motivo: "Match com seu perfil Frontend", icon: <Zap className="w-4 h-4" /> },
    { titulo: "Gestão de Processos", motivo: "Alta demanda na sua região", icon: <Target className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] pt-32 pb-20 px-4">

      {/* --- NOTIFICAÇÕES --- */}

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
        {/* --- COLUNA LATERAL --- */}
        <aside className="lg:col-span-4 space-y-6">
          <div className={`bg-white p-8 rounded-[40px] border transition-all duration-500 relative overflow-hidden group ${!profile?.name ? 'border-amber-200 ring-8 ring-amber-50 shadow-amber-100' : 'border-gray-100 shadow-sm'
            }`}>
            <div className="absolute top-0 right-0 p-4 z-20">
              <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-32 h-32 mx-auto mb-6 group/avatar">
              <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-full flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden relative">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : profile?.foto ? (
                  <img src={profile.foto} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg text-indigo-600 hover:scale-110 transition-transform border border-gray-100"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
            </div>

            <div className="text-center relative z-10">
              <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tighter italic uppercase">
                {profile?.name ? `${profile.name} ${profile.last_name}` : 'Perfil Pendente'}
              </h2>
              <p className="text-sm text-indigo-600 font-black uppercase tracking-[0.2em] mt-1 mb-4">
                {profile?.ocupation || 'Cargo não definido'}
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile?.endereco?.cidade ? `${profile.endereco.cidade}, ${profile.endereco.estado}` : 'Sem endereço'}
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-bold lowercase">
                  <Mail className="w-3.5 h-3.5" />
                  {profile?.email || 'email@não-cadastrado.com'}
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className={`w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all ${!profile?.name ? 'bg-amber-500 text-white shadow-xl shadow-amber-200' : 'bg-gray-900 text-white hover:bg-indigo-600 shadow-xl shadow-gray-200'
                  }`}>
                {profile?.name ? 'Editar Informações' : 'Completar Cadastro'}
              </button>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
            <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />
            <h3 className="font-black text-lg mb-6 flex items-center gap-2 italic uppercase">
              <TrendingUp className="w-5 h-5 text-indigo-300" /> Career AI
            </h3>
            <div className="space-y-4">
              {sugestoesIA.map((item, i) => (
                <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer group/item">
                  <p className="text-[10px] font-black uppercase text-indigo-200 mb-1">{item.motivo}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm flex items-center gap-2 italic">
                      {item.icon} {item.titulo}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover/item:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* --- COLUNA PRINCIPAL --- */}
        <main className="lg:col-span-8 space-y-8">
          <ApplicationDashboard applications={applications} totalCount={totalCount} />

          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative group">
            <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setIsEditModalOpen(true)} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">Editar Bio</button>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Sobre a sua Trajetória
            </h3>
            <p className="text-gray-600 font-bold leading-relaxed text-lg italic">
              "{profile?.bio || "Sua biografia profissional ainda não foi escrita. Clique em editar para contar sua história e atrair os melhores recrutadores."}"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:border-indigo-600 transition-all">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 italic">Skill Academy</h3>
              <p className="text-sm text-gray-500 font-bold mb-6">Cursos recomendados para seu perfil.</p>
              <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all">
                Explorar Trilhas <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:border-green-600 transition-all">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 italic">Alertas de Vaga</h3>
              <p className="text-sm text-gray-500 font-bold mb-6">Monitorando 24h para você.</p>
              <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all">
                Ver Oportunidades <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- MODAL DE EDIÇÃO MULTI-STEP --- */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl relative z-10 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-2 rounded-xl text-white"><User className="w-4 h-4" /></div>
                  <h2 className="text-xl font-black uppercase italic tracking-tighter">Dados do Trabalhador</h2>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-colors bg-white/50 border border-gray-100"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="p-10 max-h-[75vh] overflow-y-auto space-y-8 custom-scrollbar">

                {/* Alerta de erro no topo do form se houver erros de campo */}
                {Object.keys(fieldErrors).length > 0 &&

                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-black uppercase tracking-widest animate-pulse">
                    <AlertCircle className="w-5 h-5" />
                    Existem campos obrigatórios pendentes abaixo
                  </div>
                }

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Primeiro Nome</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full bg-gray-50 border-2 rounded-[20px] py-4 px-6 font-bold outline-none transition-all ${hasError('name') ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-indigo-600 focus:bg-white'}`}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Sobrenome</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                      className={`w-full bg-gray-50 border-2 rounded-[20px] py-4 px-6 font-bold outline-none transition-all ${hasError('last_name') ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-indigo-600 focus:bg-white'}`}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">E-mail Profissional</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[20px] py-4 px-6 font-bold outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Profissão Atual</label>
                    <input type="text" value={formData.ocupation} onChange={e => setFormData({ ...formData, ocupation: e.target.value })} required className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[20px] py-4 px-6 font-bold outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Sua Bio (Resumo Profissional)</label>
                  <textarea rows={4} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[20px] py-4 px-6 font-bold outline-none transition-all resize-none" />
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-6">
                  <h4 className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.3em]">Onde você mora?</h4>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cidade</label>
                      <input
                        type="text"
                        value={formData.endereco.cidade}
                        onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })}
                        className={`w-full bg-gray-50 border-2 rounded-[20px] py-4 px-6 font-bold outline-none transition-all ${hasError('cidade', 'endereco') ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-indigo-600 focus:bg-white'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">UF (Estado)</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={formData.endereco.estado}
                        onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value.toUpperCase() } })}
                        className={`w-full bg-gray-50 border-2 rounded-[20px] py-4 px-6 font-bold outline-none transition-all ${hasError('estado', 'endereco') ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-indigo-600 focus:bg-white'}`}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Rua / Logradouro</label>
                      <input
                        type="text"
                        value={formData.endereco.logradouro}
                        onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, logradouro: e.target.value } })}
                        className={`w-full bg-gray-50 border-2 rounded-[20px] py-4 px-6 font-bold outline-none transition-all ${hasError('logradouro', 'endereco') ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-indigo-600 focus:bg-white'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">CEP</label>
                      <input
                        type="text"
                        placeholder="00.000-000"
                        value={formData.endereco.cep}
                        onChange={e => setFormData({
                          ...formData,
                          endereco: { ...formData.endereco, cep: formatCEP(e.target.value) }
                        })}
                        className={`w-full bg-gray-50 border-2 rounded-[20px] py-4 px-6 font-bold outline-none transition-all ${hasError('cep', 'endereco')
                          ? 'border-red-500 bg-red-50'
                          : 'border-transparent focus:border-indigo-600 focus:bg-white'
                          }`}
                      />
                      {hasError('cep', 'endereco') && (
                        <span className="text-[10px] text-red-500 font-bold ml-2 italic">
                          CEP obrigatório ou inválido
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-gray-900 text-white py-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {isSaving ? "Processando..." : "Salvar Dados do Perfil"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(PerfilPage);