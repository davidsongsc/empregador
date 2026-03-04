"use client"

import { LayoutDashboard, FileText, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const SidebarNav = () => {
  const pathname = usePathname()

  // Configuração das rotas para facilitar a manutenção
  const navItems = [
    {
      label: "Início",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Minhas Vagas",
      href: "/dashboard/painel/minhas-vagas",
      icon: FileText,
    },
    {
      label: "Perfil",
      href: "/dashboard/painel/perfil",
      icon: Settings,
    },
  ]

  return (
    <nav className="flex-1 space-y-2">
      {navItems.map((item) => {
        // Verifica se a rota atual é exatamente a do item
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border
              ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-bold border-indigo-100 shadow-sm"
                  : "text-slate-500 font-medium border-transparent hover:bg-slate-50 hover:text-slate-700"
              }
            `}
          >
            {/* Ícone com ajuste de tamanho para telas pequenas */}
            <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
            
            <span className="text-sm truncate">
              {item.label}
            </span>

            {/* Indicador visual minimalista para Active State */}
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export default SidebarNav