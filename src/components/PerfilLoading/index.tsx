"use client";

import { User, FileText, Sparkles, Clock, GraduationCap, Bell } from 'lucide-react';

const SkeletonPulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`} />
);

const PerfilLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">

        {/* --- COLUNA LATERAL SKELETON --- */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Card Usuário */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 border-4 border-white shadow-sm flex items-center justify-center">
              <User className="w-10 h-10 text-gray-200" />
            </div>
            <SkeletonPulse className="h-6 w-3/4 mx-auto mb-2" />
            <SkeletonPulse className="h-4 w-1/2 mx-auto mb-6" />
            <div className="h-14 w-full bg-gray-100 rounded-2xl" />
          </div>

          {/* Card IA */}
          <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100 relative overflow-hidden">
            <Sparkles className="absolute -right-2 -top-2 w-24 h-24 text-indigo-100 opacity-50" />
            <div className="flex items-center gap-2 mb-4">
              <SkeletonPulse className="h-5 w-32 bg-indigo-100" />
            </div>
            <div className="space-y-4">
              <div className="bg-white/60 h-20 rounded-2xl border border-white" />
              <div className="bg-white/60 h-20 rounded-2xl border border-white" />
            </div>
          </div>

          {/* Currículo */}
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-gray-200" />
              <SkeletonPulse className="h-4 w-24" />
            </div>
            <div className="h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100" />
          </div>
        </aside>

        {/* --- COLUNA PRINCIPAL SKELETON --- */}
        <main className="lg:col-span-8 space-y-8">
          
          {/* Candidaturas */}
          <div className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <SkeletonPulse className="h-8 w-64" />
              <SkeletonPulse className="h-6 w-20 rounded-full" />
            </div>

            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-transparent">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
                    <div className="space-y-2">
                      <SkeletonPulse className="h-5 w-48" />
                      <SkeletonPulse className="h-4 w-32" />
                    </div>
                  </div>
                  <SkeletonPulse className="h-8 w-24 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Grid de Dicas */}
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl mb-6" />
                <SkeletonPulse className="h-6 w-3/4 mb-4" />
                <SkeletonPulse className="h-4 w-full mb-2" />
                <SkeletonPulse className="h-4 w-5/6 mb-6" />
                <SkeletonPulse className="h-4 w-24" />
              </div>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
};

export default PerfilLoading;