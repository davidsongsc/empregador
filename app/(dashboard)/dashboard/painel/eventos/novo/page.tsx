"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { 
  Calendar, ArrowLeft, Loader2, Save, 
  Building2, Users, Terminal,  Fingerprint
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
      const newEvent = await eventService.createEvent(data);
      toast.success("Protocolo registrado. Sincronizando escalas.");
      router.push(`/painel/eventos/${newEvent.uid}`);
    } catch (err: any) {
      toast.error("Erro na inicialização. Verifique os logs de entrada.");
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-8xl mx-auto space-y-10 animate-in fade-in duration-700 font-mono text-delos-black">
      
      {/* HEADER DE NAVEGAÇÃO */}
      <Link 
        href="/painel/eventos" 
        className="group flex items-center gap-2 text-delos-grey hover:text-delos-amber transition-all font-black text-[10px] uppercase tracking-[0.3em]"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Return_to_Archive
      </Link>

      <header className="space-y-4 border-b border-delos-black/10 pb-8">
        <div className="flex items-center gap-3">
          <Terminal size={18} className="text-delos-amber" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-delos-grey">System_Init_v3.0</span>
        </div>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
          Novo_<span className="text-delos-amber">Protocolo</span>
        </h1>
        <p className="text-delos-grey text-[10px] uppercase tracking-[0.2em] max-w-lg">
          Insira as variáveis estruturais para instanciar um novo evento na rede local Delos_White.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LADO ESQUERDO: IDENTIFICAÇÃO */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-delos-surface border border-delos-grey/20 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-delos-amber" />
            
            <div className="flex items-center gap-3 mb-8">
              <Fingerprint size={16} className="text-delos-amber" />
              <h2 className="font-black uppercase text-[11px] tracking-[0.3em]">Identity_Parameters</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[9px] font-black text-delos-grey uppercase tracking-widest block group-focus-within:text-delos-amber transition-colors">
                  Event_Official_Name
                </label>
                <input 
                  {...register("name", { required: "Nome é obrigatório" })}
                  placeholder="EX: GALA_GARDEN_2026"
                  className="w-full px-5 py-4 bg-delos-black/[0.03] border border-delos-grey/20 outline-none focus:border-delos-amber transition-all font-bold text-sm tracking-widest placeholder:opacity-20 uppercase"
                />
                {errors.name && <span className="text-delos-red text-[9px] font-black uppercase">{errors.name.message}</span>}
              </div>

              <div className="space-y-2 group">
                <label className="text-[9px] font-black text-delos-grey uppercase tracking-widest block group-focus-within:text-delos-amber transition-colors">
                  Event_Log_Description
                </label>
                <textarea 
                  {...register("description")}
                  rows={4}
                  placeholder="INPUT_NARRATIVE_DATA..."
                  className="w-full px-5 py-4 bg-delos-black/[0.03] border border-delos-grey/20 outline-none focus:border-delos-amber transition-all font-medium text-sm tracking-wide placeholder:opacity-20 uppercase resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: GESTÃO E ACTIONS */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-delos-surface border border-delos-grey/20 p-8 relative">
            <div className="flex items-center gap-3 mb-8">
              <Building2 size={16} className="text-delos-amber" />
              <h2 className="font-black uppercase text-[11px] tracking-[0.3em]">Owner_Domain</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-delos-grey uppercase tracking-widest block">Matriz_Proprietária</label>
                <div className="relative">
                  <select 
                    {...register("owner_company", { required: "Selecione a matriz" })}
                    className="w-full px-5 py-4 bg-delos-black/[0.03] border border-delos-grey/20 outline-none font-bold text-[11px] tracking-widest text-delos-black appearance-none uppercase"
                  >
                    <option value="">SELECT_DOMAIN...</option>
                    {/* Map de empresas viria aqui */}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 border-r-2 border-b-2 border-delos-amber rotate-45" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 opacity-50">
                <label className="text-[9px] font-black text-delos-grey uppercase tracking-widest block">Fixed_Staff (Read-Only)</label>
                <div className="flex items-center gap-3 px-5 py-4 bg-delos-black/5 border border-dashed border-delos-grey/20">
                  <Users size={14} className="text-delos-grey" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Multi_Selector_Offline</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTÃO DE SUBMIT TÉCNICO */}
          <button 
            disabled={isSubmitting}
            type="submit"
            className="w-full group relative py-6 bg-delos-black text-white overflow-hidden transition-all hover:bg-delos-amber active:scale-95 disabled:opacity-50"
          >
            <div className="relative z-10 flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.4em] text-delos-surface">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Salvar
                </>
              )}
            </div>
            {/* Efeito de scan no hover */}
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>

          <div className="flex items-center gap-2 justify-center opacity-30">
            <div className="w-1.5 h-1.5 bg-delos-amber rounded-full animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em]">Link_Secure_SSL_Active</span>
          </div>
        </div>
      </form>
    </div>
  );
}