"use client"

import { useState } from "react"
import { LogOut, Bell, Menu, X } from "lucide-react"
import SidebarNav from "@/components/MiniComponents/SidebarNav"
import { useAuthStore } from "@/store/useAuthStore"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, loading, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <span className="text-xl font-black text-indigo-600 tracking-tighter italic">PORTAL.EMPRESA</span>
            <button className="lg:hidden p-1 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <SidebarNav />

          <div className="pt-6 border-t border-slate-100">
            <button onClick={()=> logout()} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors group cursor-pointer">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO À DIREITA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            {loading ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
                <div className="flex flex-col gap-1 align-items-end">
                  <div className="w-24 h-2 bg-slate-200 animate-pulse" />
                  <div className="w-24 h-1 bg-slate-200 animate-pulse" />
                  <div className="w-24 h-1 bg-slate-200 animate-pulse" />
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />

              </div>
            ) : (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900 leading-none capitalize">{user?.profile?.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{user?.profile?.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-100">
                  JS
                </div>
              </div>)}
          </div>
        </header>

        {/* ÁREA DE SCROLL DINÂMICA (As páginas entram aqui) */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}