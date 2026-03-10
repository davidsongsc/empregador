import { Crown } from "lucide-react";

function MemberRow({ name, role, isLeader }: { name: string, role: string, isLeader: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-white/[0.03] border border-transparent hover:border-white/5 group/unit transition-all">
      <div className="flex items-center gap-3">
        <div className={`h-7 w-7 border flex items-center justify-center text-[9px] font-black transition-all shrink-0 ${
          isLeader ? 'bg-amber-600 border-amber-400 text-black' : 'bg-slate-900 border-white/10 text-slate-600'
        }`}>
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-slate-300 uppercase truncate">
            {name} {isLeader && <Crown size={8} className="inline ml-1 mb-0.5" />}
          </p>
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
            {isLeader ? 'Lider' : 'Membro'}::{role}
          </p>
        </div>
      </div>
      <div className="w-1 h-1 bg-emerald-500 shadow-[0_0_5px_#10b981] rounded-full animate-pulse" />
    </div>
  );
}

export default MemberRow;