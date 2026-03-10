import React, { useState } from "react";
import { HardHat, GitBranch, Crown, Fingerprint, ChevronDown, ChevronUp, Radio, Cpu, Scan, Activity } from "lucide-react";

/**
 * EFEITOS DE INTERFACE DELOS
 */
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
    @keyframes pulse-border { 0% { border-color: rgba(245, 158, 11, 0.2); } 50% { border-color: rgba(245, 158, 11, 0.5); } 100% { border-color: rgba(245, 158, 11, 0.2); } }
    .scanline-effect::after {
      content: ""; position: absolute; inset: 0;
      background: linear-gradient(to bottom, transparent, rgba(245, 158, 11, 0.03), transparent);
      animation: scanline 3s linear infinite; pointer-events: none;
    }
    .host-card-compact { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    .host-card-compact:hover { border-color: #f59e0b; box-shadow: 0 0 20px rgba(245, 158, 11, 0.1); }
  `}} />
);

const MemberRow = ({ name, role, isLeader }: { name: string; role: string; isLeader: boolean }) => (
  <div className="flex items-center justify-between p-1.5 hover:bg-amber-500/10 transition-colors group/unit border-l border-transparent hover:border-amber-500">
    <div className="flex items-center gap-2">
      <div className={`h-6 w-6 flex items-center justify-center text-[8px] font-black ${
        isLeader ? 'bg-amber-600 text-black' : 'bg-zinc-900 text-zinc-500 border border-white/10'
      }`}>
        {name.charAt(0)}
      </div>
      <div className="text-left leading-none">
        <p className="text-[9px] font-bold text-zinc-200 uppercase tracking-tighter">{name}</p>
        <p className="text-[7px] font-mono text-zinc-500 uppercase">{role}</p>
      </div>
    </div>
    <Activity size={10} className={`${isLeader ? 'text-amber-500' : 'text-zinc-700'} animate-pulse`} />
  </div>
);

const DepartmentNode = ({ dept, onInspect, level = 0 }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const leaders = dept.leaders_detail || [];
  const members = dept.members_detail || [];
  const subDepts = dept.sub_departments || [];
  const hasSubDepts = subDepts.length > 0;

  return (
    <div className="flex flex-col items-center relative animate-in fade-in zoom-in-95 duration-500">
      {level > 0 && <div className="w-[1px] h-10 bg-gradient-to-b from-amber-600/40 to-transparent" />}

      <div className={`
        host-card-compact group relative bg-[#080808] border border-white/5 
        ${isExpanded ? 'w-[320px]' : 'w-[260px]'} flex flex-col z-10 scanline-effect overflow-hidden
        ${!dept.parent_id ? 'border-amber-600/30 shadow-[0_0_30px_rgba(217,119,6,0.05)]' : ''}
      `}>
        
        {/* HEADER COMPACTO */}
        <div className="p-3 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 border ${!dept.parent_id ? 'border-amber-500/40 text-amber-500' : 'border-zinc-800 text-zinc-500'}`}>
              {!dept.parent_id ? <Cpu size={14} /> : <Scan size={14} />}
            </div>
            <div className="text-left">
              <span className="block text-[6px] font-mono text-amber-600/50 uppercase tracking-[0.2em]">Node_v4.0</span>
              <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest leading-none truncate w-[120px]">
                {dept.name}
              </h4>
            </div>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1 transition-all ${isExpanded ? 'bg-amber-600 text-black' : 'text-zinc-600 hover:text-white'}`}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* INFO DE COMANDO (SEMPRE VISÍVEL) */}
        <div className="px-3 py-2 flex items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className={`w-1 h-1 rounded-full ${leaders.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[8px] font-mono text-zinc-500">CMD:</span>
            <span className="text-[8px] font-bold text-zinc-400 uppercase truncate w-[80px]">
              {leaders[0]?.profile_name || "VACANT"}
            </span>
          </div>
          <span className="text-[7px] font-mono text-zinc-700">LVL_{level}</span>
        </div>

        {/* ÁREA EXPANSÍVEL (DADOS DO HOST) */}
        {isExpanded && (
          <div className="p-3 bg-black/40 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
            <div className="max-h-[120px] overflow-y-auto custom-scrollbar space-y-1 mb-3">
              {leaders.map((l: any) => <MemberRow key={l.id} name={l.profile_name} role={l.role} isLeader={true} />)}
              {members.map((m: any) => <MemberRow key={m.id} name={m.profile_name} role={m.role} isLeader={false} />)}
            </div>
            
            <button 
              onClick={() => onInspect?.(dept.id)}
              className="w-full py-2 bg-amber-600/10 border border-amber-600/20 text-[7px] font-black text-amber-500 hover:bg-amber-600 hover:text-black transition-all uppercase tracking-[0.3em]"
            >
              Access_System_Core
            </button>
          </div>
        )}

        {/* INDICADOR DE SUB-NODOS */}
        {hasSubDepts && !isExpanded && (
          <div className="h-1 flex gap-0.5 px-3 mb-1">
            {subDepts.map((_: any, i: number) => (
              <div key={i} className="flex-1 bg-amber-600/20 h-full" />
            ))}
          </div>
        )}
      </div>

      {/* CONEXÕES HIERÁRQUICAS */}
      {hasSubDepts && (
        <div className="relative flex flex-col items-center">
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/10 to-amber-600/40" />
          <div className="flex gap-8 relative px-6">
            {subDepts.length > 1 && (
              <div className="absolute top-0 left-[130px] right-[130px] h-[1px] bg-amber-600/20 shadow-[0_0_10px_rgba(217,119,6,0.1)]" />
            )}
            {subDepts.map((sub: any) => (
              <DepartmentNode key={sub.id} dept={sub} onInspect={onInspect} level={level + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const DepartmentGrid = ({ departments, onInspect, className }: any) => {
  const rootDepartments = departments?.filter((d: any) => !d.parent_id && !d.parent);

  return (
    <div className={`${className} w-full min-h-screen bg-[#030303] overflow-auto p-12 custom-scrollbar relative`}>
      <GlobalStyles />
      
      {/* HUD Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: `linear-gradient(#f59e0b 0.5px, transparent 0.5px), linear-gradient(90deg, #f59e0b 0.5px, transparent 0.5px)`, backgroundSize: '50px 50px' }} />

      <div className="flex flex-col items-center gap-12 min-w-max relative z-10">
        {rootDepartments?.map((dept: any) => (
          <DepartmentNode key={dept.id} dept={dept} onInspect={onInspect} level={0} />
        ))}

        {rootDepartments?.length === 0 && (
          <div className="flex flex-col items-center py-20 animate-pulse">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border border-amber-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
              <Fingerprint size={40} className="text-amber-900/40" />
            </div>
            <h3 className="text-zinc-700 font-mono tracking-[1em] uppercase text-xs mt-8">System_Idle</h3>
          </div>
        )}
      </div>
    </div>
  );
};