"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { 
  Calendar, ArrowLeft, Loader2, Save, 
  Building2, Users, FileText 
} from "lucide-react";
import { eventService } from "@/services/eventService";
import { toast } from "@/components/Notification";
import Link from "next/link";
import { EventCreateInput } from "@/interfaces/eventCreateInput";

export default function NewEventPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<EventCreateInput>();

  const onSubmit = async (data: EventCreateInput) => {
    try {
      // O Serializer espera UIDs para owner_company e listas de UIDs para os M2M
      const newEvent = await eventService.createEvent(data);
      toast.success("Evento base criado! Agora configure as escalas.");
      router.push(`/painel/eventos/${newEvent.uid}`);
    } catch (err: any) {
      toast.error("Erro ao criar evento. Verifique se todos os campos obrigatórios foram preenchidos.");
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <Link href="/painel/eventos" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-xs uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4" />
        Voltar para lista
      </Link>

      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Novo Evento</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">Cadastre as informações estruturais do evento no sistema.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* CARD INFORMAÇÕES BÁSICAS */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <h2 className="font-black text-slate-900 uppercase text-xs tracking-widest">Identificação</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Oficial</label>
              <input 
                {...register("name", { required: "Nome é obrigatório" })}
                placeholder="Ex: Convention 2026"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-900"
              />
              {errors.name && <span className="text-red-500 text-[10px] font-bold">{errors.name.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
              <textarea 
                {...register("description")}
                rows={3}
                placeholder="Detalhes internos e objetivos..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* CARD PROPRIEDADE E STAFF FIXO */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h2 className="font-black text-slate-900 uppercase text-xs tracking-widest">Propriedade e Gestão</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Empresa Proprietária</label>
              <select 
                {...register("owner_company", { required: "Selecione a empresa dona do evento" })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 appearance-none"
              >
                <option value="">Selecione...</option>
                {/* Aqui viria o map de empresas que o usuário pode gerenciar */}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organizadores Fixos (UIDs)</label>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-300 ml-2" />
                <input 
                  disabled
                  placeholder="Seletor Multiplo em breve..." 
                  className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 italic text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          disabled={isSubmitting}
          type="submit"
          className="w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar e Criar Escalas
            </>
          )}
        </button>
      </form>
    </div>
  );
}