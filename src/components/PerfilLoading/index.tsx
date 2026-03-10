"use client";

import { User, FileText, Sparkles, Briefcase, GraduationCap, Activity } from 'lucide-react';

const SkeletonPulse = ({ className, style }: { className: string; style?: React.CSSProperties }) => (
  <div 
    className={`animate-pulse ${className}`} 
    style={{ 
        backgroundColor: 'var(--delos-grey)', 
        opacity: 0.1,
        ...style 
    }} 
  />
);

const PerfilLoading = () => {
  return (
    <div 
      style={{ backgroundColor: 'var(--delos-surface)' }} 
      className="min-h-screen pt-32 pb-20 px-4 md:px-8 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">

        {/* --- SIDEBAR SKELETON (MONITORAMENTO) --- */}
        <aside className="lg:col-span-4 space-y-8">
          <div 
            style={{ borderColor: 'rgba(var(--delos-grey), 0.1)' }}
            className="bg-white dark:bg-[#080808] p-8 rounded-sm border shadow-2xl relative overflow-hidden"
          >
            {/* ID Técnico Fictício */}
            <div className="absolute top-0 left-0 p-2 bg-[var(--delos-black)] opacity-10 text-[7px] font-mono tracking-widest uppercase">
              Initializing_Unit::LOADING...
            </div>

            <div className="relative w-40 h-40 mx-auto mb-8 mt-4">
              <div className="w-full h-full bg-black/5 dark:bg-white/5 rounded-full border border-[var(--delos-black)]/10 flex items-center justify-center">
                <User className="w-16 h-16 opacity-10" />
              </div>
              {/* Scanner Line Animation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--delos-indigo)]/10 to-transparent h-1/2 w-full animate-pulse pointer-events-none" />
            </div>

            <div className="space-y-4">
              <SkeletonPulse className="h-8 w-3/4 mx-auto rounded-sm" />
              <SkeletonPulse className="h-4 w-1/2 mx-auto rounded-sm" />
              <div className="pt-6 border-t border-black/5 dark:border-white/5">
                <SkeletonPulse className="h-12 w-full rounded-sm" />
              </div>
            </div>
          </div>

          {/* Widget IA Skeleton */}
          <div className="bg-[var(--delos-black)] p-8 rounded-sm relative overflow-hidden">
            <Activity className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 text-indigo-500" />
            <div className="flex items-center gap-2 mb-6">
               <div className="w-2 h-2 bg-[var(--delos-amber)] animate-pulse rounded-full" />
               <SkeletonPulse className="h-3 w-24 opacity-20" />
            </div>
            <div className="space-y-4">
               <div className="h-16 w-full bg-white/5 border border-white/5 rounded-sm" />
            </div>
          </div>
        </aside>

        {/* --- CONTEÚDO PRINCIPAL SKELETON --- */}
        <main className="lg:col-span-8 space-y-8">
          
          {/* Dashboard de Candidaturas */}
          <div 
            style={{ borderColor: 'rgba(var(--delos-grey), 0.1)' }}
            className="bg-white dark:bg-[#080808] p-8 md:p-12 rounded-sm border shadow-sm"
          >
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-3">
                <SkeletonPulse className="h-10 w-64 rounded-sm" />
                <SkeletonPulse className="h-3 w-48 rounded-sm opacity-50" />
              </div>
              <SkeletonPulse className="h-16 w-16 rounded-sm" />
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-sm" />
                    <div className="space-y-2">
                      <SkeletonPulse className="h-4 w-40 md:w-64" />
                      <SkeletonPulse className="h-3 w-24 md:w-32 opacity-50" />
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <SkeletonPulse className="h-8 w-24 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grids de Biografia e Histórico */}
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-[#080808] p-8 rounded-sm border border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-10 h-10 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center">
                    {i === 1 ? <Briefcase className="w-4 h-4 opacity-10" /> : <GraduationCap className="w-4 h-4 opacity-10" />}
                  </div>
                  <SkeletonPulse className="h-3 w-16" />
                </div>
                <div className="space-y-4">
                  <SkeletonPulse className="h-4 w-3/4" />
                  <div className="space-y-2 pt-4">
                    <SkeletonPulse className="h-3 w-full opacity-50" />
                    <SkeletonPulse className="h-3 w-5/6 opacity-50" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default PerfilLoading;