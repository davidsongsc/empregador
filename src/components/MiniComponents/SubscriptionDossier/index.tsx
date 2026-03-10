import { Crown, CreditCard } from "lucide-react";
import { toast } from "@/components/Notification";

interface SubscriptionDossierProps {
  planName: string;
  price: string;
  features: string[];
  onRecalibrate?: () => void;
}

export const SubscriptionDossier = ({ 
  planName, 
  price, 
  features, 
  onRecalibrate 
}: SubscriptionDossierProps) => {
  return (
    <section className="relative overflow-hidden bg-[#181818] border border-white/5 p-8 shadow-2xl">
      {/* BACKGROUND DECORATION */}
      <div className="absolute -right-8 -top-8 rotate-12 text-amber-600/[0.02] pointer-events-none">
        <Crown size={200} />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div className="bg-amber-600 p-3 shadow-[0_0_20px_rgba(217,119,6,0.3)]">
            <CreditCard className="text-black" size={20} />
          </div>
          <span className="text-[7px] font-black text-amber-600 uppercase tracking-[0.4em] italic border-b border-amber-600/20 pb-1">
            Operational_License
          </span>
        </div>

        {/* PLAN INFO */}
        <h3 className="text-2xl font-light italic tracking-tighter uppercase text-white">
          {planName}
        </h3>
        <p className="mt-2 text-slate-500 font-mono text-[10px] tracking-widest uppercase">
          {price}
        </p>

        {/* FEATURES LIST */}
        <ul className="mt-10 space-y-5">
          {features.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <div className="w-1 h-1 bg-amber-600 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* ACTION */}
        <button 
          onClick={onRecalibrate ?? (() => toast.info("Manual Override em breve"))} 
          className="mt-12 w-full bg-white py-4 text-[9px] font-black text-black uppercase tracking-[0.4em] transition-all hover:bg-amber-600 hover:text-white active:scale-95 shadow-2xl"
        >
          Re-calibrate_Plan
        </button>
      </div>
    </section>
  );
};