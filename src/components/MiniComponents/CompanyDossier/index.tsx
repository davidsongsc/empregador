import { Building2, MapPin, Users, TrendingUp, Crosshair } from "lucide-react";

interface CompanyDossierProps {
  activeCompany: {
    name: string;
    is_active: boolean;
    members_count: number;
    departments?: any[];
    average_rate?: number;
  };
}

export const CompanyDossier = ({ activeCompany }: CompanyDossierProps) => {
  const statusActive = activeCompany.is_active ?? true;

  return (
    <section className="relative overflow-hidden border border-white/[0.03] bg-[#141414] shadow-2xl p-8 sm:p-12">
      {/* Luz de fundo sutil - Aura Industrial */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/[0.03] rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center lg:items-end">
        {/* LOGO CONTAINER COM SCANNER */}
        <div className="relative">
          <div className="absolute -inset-2 border border-amber-600/20 shadow-[0_0_15px_rgba(217,119,6,0.1)]" />
          <div className="flex h-36 w-36 items-center justify-center bg-black text-amber-600 border border-white/5 relative overflow-hidden group">
            <Building2 size={64} strokeWidth={1} className="group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent h-full w-full animate-scan pointer-events-none" />
          </div>
        </div>

        {/* INFO PRINCIPAL */}
        <div className="flex-1 text-center lg:text-left space-y-4">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <h1 className="text-4xl font-light tracking-tighter uppercase text-white leading-none">
              {activeCompany.name} <span className="font-black italic opacity-20 text-slate-400">//</span>
            </h1>
            
            <div className={`flex items-center gap-2 border px-3 py-1.5 text-[8px] font-black tracking-[0.3em] uppercase transition-all ${
              statusActive 
                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' 
                : 'border-rose-500/20 bg-rose-500/5 text-rose-500'
            }`}>
              <div className={`h-1.5 w-1.5 rounded-full animate-pulse shadow-[0_0_8px] ${
                statusActive ? 'bg-emerald-500 shadow-emerald-500' : 'bg-rose-500 shadow-rose-500'
              }`} />
              {statusActive ? 'Active_Status' : 'Offline_Node'}
            </div>
          </div>

          {/* GRID DE METADADOS */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
            <MetaDetail label="Localização" value="RIO_DE_JANEIRO, BR" icon={MapPin} />
            <MetaDetail label="População_Hosts" value={`${activeCompany.members_count} Units`} icon={Users} />
            <MetaDetail label="Arquitetura" value={`${activeCompany.departments?.length || 0} Sectors`} icon={TrendingUp} />
          </div>
        </div>

        {/* FIDELITY SCORE */}
        <div className="flex flex-col items-center gap-1 border border-white/5 bg-black/40 px-12 py-8 relative overflow-hidden group min-w-[200px]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-amber-600/30" />
          <span className="text-[7px] font-black uppercase tracking-[0.5em] text-slate-600 mb-2">Unit_Fidelity</span>
          <div className="flex items-center gap-4 text-4xl font-light text-white italic">
            <Crosshair size={24} className="text-amber-600 opacity-50" />
            {activeCompany.average_rate?.toFixed(1) || "0.0"}
          </div>
        </div>
      </div>
    </section>
  );
};

// Sub-componente interno para os detalhes
const MetaDetail = ({ label, value, icon: Icon }: any) => (
  <div className="flex flex-col gap-1">
    <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-slate-400">
      <Icon size={12} className="text-amber-900" /> {value}
    </div>
  </div>
);