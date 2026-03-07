"use client"

import { LayoutDashboard, FileText, Settings, CalendarDays, PhoneCallIcon, AlertOctagon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

const SidebarNav = () => {
  const pathname = usePathname()
  const router = useRouter()
  
  // Pegamos o usuário do seu store de autenticação
  const { user } = useAuthStore()

  // Extraímos a primeira empresa ativa do perfil
  const userCompany = user?.profile?.empresas?.find(emp => emp.is_active)
  const companyId = userCompany?.id

  const navItems = [
    {
      label: "Início",
      href: "/dashboard/home",
      icon: LayoutDashboard,
    },
    {
      label: "Vagas Cadastradas",
      href: "/dashboard/painel/minhas-vagas",
      icon: FileText,
    },
    {
      label: "Corporação",
      // Se não houver ID, mandamos para uma rota base ou desabilitamos
      href: companyId ? `/dashboard/painel/companies/${companyId}` : "/dashboard/painel",
      icon: Settings,
      disabled: !companyId // Desabilita se o usuário não tiver empresa vinculada
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
        // Verifica se a rota atual começa com o href (útil para sub-rotas de perfil)
        const isActive = pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <button
            key={item.label}
            onClick={() => !item.disabled && router.push(item.href)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border
              ${item.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
              ${isActive
                ? "bg-indigo-50 text-indigo-600 font-bold border-indigo-100 shadow-sm"
                : "text-slate-500 font-medium border-transparent hover:bg-slate-50 hover:text-slate-700"
              }
            `}
            disabled={item.disabled}
          >
            {item.disabled ? (
              <AlertOctagon className="w-5 h-5 shrink-0 text-slate-400" />
            ) : (
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
            )}

            <span className="text-sm truncate">
              {item.label}
            </span>

            {isActive && !item.disabled && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
            )}
          </button>
        )
      })}
    </nav>
  )
}

export default SidebarNav