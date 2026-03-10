import { ClipboardList, Plus, Terminal, LucideIcon } from "lucide-react";

interface ActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  rotateOnHover?: boolean;
}

const ActionButton = ({ label, icon: Icon, onClick, rotateOnHover }: ActionButtonProps) => (
  <button 
    onClick={onClick}
    className="flex w-full items-center justify-between border border-white/5 bg-black/20 px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all hover:text-amber-500 hover:bg-black group"
  >
    {label}
    <Icon 
      size={14} 
      className={`transition-transform duration-300 ${rotateOnHover ? 'group-hover:rotate-90' : 'group-hover:scale-110'}`} 
    />
  </button>
);

interface QuickActionsProps {
  onDeployStaff?: () => void;
  onFetchAudit?: () => void;
}

export const QuickActions = ({ onDeployStaff, onFetchAudit }: QuickActionsProps) => {
  return (
    <section className="border border-white/5 bg-[#141414] p-8 shadow-xl">
      <h3 className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.5em] text-slate-700 mb-8">
        <ClipboardList size={14} className="opacity-20" /> 
        Quick_Actions
      </h3>
      
      <div className="space-y-2">
        <ActionButton 
          label="Deploy_New_Staff" 
          icon={Plus} 
          onClick={onDeployStaff} 
          rotateOnHover 
        />
        
        <ActionButton 
          label="Fetch_Audit_Log" 
          icon={Terminal} 
          onClick={onFetchAudit} 
        />
      </div>
    </section>
  );
};