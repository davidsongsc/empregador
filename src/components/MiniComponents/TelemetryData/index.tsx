import { Activity } from "lucide-react";

interface TelemetryItemProps {
  label: string;
  value: string | number;
}

const TelemetryItem = ({ label, value }: TelemetryItemProps) => (
  <div className="bg-[#101010] p-6 text-center group hover:bg-black transition-all">
    <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-2 group-hover:text-slate-500 transition-colors">
      {label}
    </p>
    <p className="text-3xl font-light text-white italic group-hover:text-amber-600 transition-colors">
      {value}
    </p>
  </div>
);

interface TelemetryDataProps {
  stats?: {
    jobs_deployed?: number;
    inflows?: number;
  };
}

export const TelemetryData = ({ stats }: TelemetryDataProps) => {
  return (
    <section className="border border-white/5 bg-[#141414] p-8 space-y-8 shadow-xl">
      <h3 className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">
        <Activity size={14} className="text-amber-600 animate-pulse" /> 
        Recrutamento
      </h3>
      
      <div className="grid grid-cols-2 gap-[1px] bg-white/5 border border-white/5">
        <TelemetryItem 
          label="Vagas " 
          value={stats?.jobs_deployed ?? 0} 
        />
        <TelemetryItem 
          label="Candidatados " 
          value={stats?.inflows ?? 0} 
        />
      </div>
    </section>
  );
};