import { ArrowLeft, ExternalLink, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  onSettingsClick?: () => void;
  onFeedClick?: () => void;
  backLabel?: string;
}

export const AdminHeader = ({ 
  onSettingsClick, 
  onFeedClick, 
  backLabel = "Retornar_Sequence" 
}: AdminHeaderProps) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.03] bg-[#141414]/95 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl justify-between items-center">
        
        {/* BOTÃO DE VOLTAR */}
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-3 text-slate-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] hover:text-amber-500"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>{backLabel}</span>
        </button>

        {/* AÇÕES DE CABEÇALHO */}
        <div className="flex gap-4">
          <button 
            onClick={onFeedClick}
            className="hidden sm:flex items-center gap-2 border border-white/5 bg-white/[0.02] px-5 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-amber-600/40 hover:text-amber-500 transition-all"
          >
            <ExternalLink size={12} /> Global_Feed
          </button>
          
          <button 
            onClick={onSettingsClick}
            className="flex h-10 w-10 items-center justify-center border border-white/5 bg-white/[0.02] text-slate-700 hover:text-amber-600 hover:border-amber-600/30 transition-all"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};