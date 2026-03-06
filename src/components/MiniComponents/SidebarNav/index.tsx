"use client"

import { LayoutDashboard, FileText, Settings, CalendarDays, PhoneCallIcon, AlertOctagon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const SidebarNav = () => {
  const pathname = usePathname()
  const router = useRouter()
  // Configuração das rotas para facilitar a manutenção
  const navItems = [
    {
      label: "Início",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Vagas Cadastradas",
      href: "/dashboard/painel/minhas-vagas",
      icon: FileText,
    },
    {
      label: "Corporação",
      href: "/dashboard/painel/perfil",
      icon: Settings,
    },
    {
      label: "Eventos",
      href: "/dashboard/painel/eventos",
      icon: CalendarDays,
    },
    {
      label: "Whatsapp",
      href: "/dashboard/painel/whatsapp",
      icon: PhoneCallIcon,
      disabled: true,
    },
  ]

  return (
    <nav className="flex-1 space-y-2">
      {navItems.map((item) => {
        // Verifica se a rota atual é exatamente a do item
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`
    w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border
    ${isActive
                ? "bg-indigo-50 text-indigo-600 font-bold border-indigo-100 shadow-sm"
                : "text-slate-500 font-medium border-transparent hover:bg-slate-50 hover:text-slate-700"
              }
  `}
            disabled={item.disabled}>
            {item.disabled ? (
              <AlertOctagon className="w-5 h-5 shrink-0 text-slate-400" />) : (
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
            )}


            <span className="text-sm truncate">
              {item.label}
            </span>

            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
            )}
          </button>
        )
      })}
    </nav>
  )
}

export default SidebarNav