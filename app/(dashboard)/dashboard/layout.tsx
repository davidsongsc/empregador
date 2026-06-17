"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { AdminSidebar } from "@/components/MiniComponents/AdminSidebar";
import { AdminHUD } from "@/components/MiniComponents/AdminHUD";
import hasModuleAccess from "@/utils/hasModuleAccess";
import { getActiveMembership } from "@/utils/userHelpers";
import { Module } from "@/enum/moduleEnum"
import Unauthorized from "../../unauthorized/page";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isHydrated, logout } = useAuthStore();
  const [isActive, setIsActive] = useState(false);
  const activeMembership = getActiveMembership()
  const userRole = activeMembership?.role
  const access = {
    dashboard: hasModuleAccess(userRole, Module.DASHBOARD)
    
  };


  console.log('user acesss', access)
  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated || !user) return <Unauthorized />;
  if (!access.dashboard.hasAccess) return <Unauthorized />;
  return (
    <div className="min-h-screen bg-delos-surface text-delos-grey font-sans flex overflow-hidden selection:bg-delos-amber/30 relative">
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.5] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      <AdminSidebar
        isOpen={isSidebarOpen}
        isActive={isActive}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <AdminHUD
          user={user}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505]">
          <div className="w-full h-full p-4 sm:p-8 lg:p-0">
            {children}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d97706; }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .animate-scan { animation: scan 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

    </div>
  );
}