"use client";

import { Menu, Terminal, Activity } from "lucide-react";

interface AdminHUDProps {
  user: any;
  onOpenSidebar: () => void;
}

export const AdminHUD = ({ user, onOpenSidebar }: AdminHUDProps) => {
  return (
    <header className="h-20 bg-[#050505] border-b border-white/[0.03] flex items-center justify-between px-6 sm:px-10 shrink-0 z-30">
      <div className="flex items-center gap-8">
        <button className="lg:hidden p-2 border border-white/10 hover:border-amber-600 transition-colors" onClick={onOpenSidebar}>
          <Menu className="w-4 h-4 text-amber-600" />
        </button>

        <div className="hidden md:flex items-center gap-10">
          <StatusIndicator label="Grid Status" value="Stable.042" color="bg-emerald-500" />
          <StatusIndicator label="Sat-Link" value="Active_Sync" icon={Activity} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:block pr-6 border-r border-white/5">
          <span className="text-[9px] font-mono text-slate-700 uppercase tracking-tighter">COORD: 34.42 / 118.07</span>
        </div>

        <button className="p-2 text-slate-500 hover:text-amber-500 transition-colors relative">
          <Terminal className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1 h-1 bg-amber-600 rounded-full"></span>
        </button>

        <div className="flex items-center gap-4 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-white tracking-[0.15em] uppercase leading-none">
              {user?.profile?.name || "Access_Denied"}
            </p>
            <p className="text-[8px] text-amber-600 font-mono uppercase tracking-tighter mt-1">
              Auth_Level: {user?.profile?.role || "L1_GUEST"}
            </p>
          </div>
          <UserAvatar name={user?.profile?.name} />
        </div>
      </div>
    </header>
  );
};

const StatusIndicator = ({ label, value, color, icon: Icon }: any) => (
  <div className="flex flex-col text-[7px] uppercase tracking-[0.3em] text-slate-600 font-black">
    {label}
    <div className="flex items-center gap-2 mt-1">
      {Icon ? <Icon size={10} className="text-amber-600" /> : <div className={`w-1 h-1 ${color} rounded-full animate-pulse`} />}
      <span className="text-[10px] font-mono text-slate-300 italic tracking-normal">{value}</span>
    </div>
  </div>
);

const UserAvatar = ({ name }: { name?: string }) => (
  <div className="relative group p-1">
    <div className="absolute inset-0 border border-amber-600/10 group-hover:border-amber-600/40 transition-all rounded-full" />
    <div className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center overflow-hidden relative font-black text-amber-600 text-[10px]">
      {name?.substring(0, 2).toUpperCase() || "DX"}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent animate-scan" />
    </div>
  </div>
);