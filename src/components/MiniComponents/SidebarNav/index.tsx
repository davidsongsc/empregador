"use client"

import { 
  LayoutDashboard, FileText, Settings, CalendarDays, 
  PhoneCallIcon, AlertOctagon, Globe, Plug, Wallet, 
  BarChart3, UserCheck, Users, CloudBackup, ChevronRight 
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

const SidebarNav = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthStore()

  const userCompany = user?.profile?.empresas?.find(emp => emp.is_active)
  const companyId = userCompany?.id

  // Definimos os grupos para organizar a mente do usuário
  const menuGroups = [
    {
      title: "Principal",
      items: [
        { label: "Início", href: "/dashboard/home", icon: LayoutDashboard },
        { label: "Portal de Vagas", href: "/vagas", icon: Globe },
      ]
    },
    {
      title: "Operação de Staff",
      items: [
        { label: "Vagas", href: "/dashboard/painel/minhas-vagas", icon: FileText },
        { label: "Candidatos", href: "/dashboard/painel/candidatos", icon: UserCheck, disabled: !companyId },
        { label: "Eventos", href: "/dashboard/painel/eventos", icon: CalendarDays },
      ]
    },
    {
      title: "Gestão & Business",
      items: [
        { label: "Financeiro", href: "/dashboard/painel/financeiro", icon: Wallet, disabled: !companyId },
        { label: "Relatórios BI", href: "/dashboard/painel/relatorios", icon: BarChart3, disabled: !companyId },
        { label: "Segurança", href: "/dashboard/painel/seguranca", icon: CloudBackup },
      ]
    },
    {
      title: "Configurações",
      items: [
        { label: "Empresa", href: companyId ? `/dashboard/painel/companies/${companyId}` : "/dashboard/painel", icon: Settings, disabled: !companyId },
        { label: "Usuários", href: "/dashboard/painel/usuarios", icon: Users, disabled: !companyId },
        { label: "Whatsapp AI", href: "/dashboard/painel/whatsapp", icon: PhoneCallIcon, disabled: true }, // Plano Premium
        { label: "Administração", href: "/dashboard/admin", icon: Plug, disabled: !companyId },
      ]
    }
  ]

  return (
    <nav className="flex-1 px-3 space-y-6 overflow-y-auto scrollbar-hide">
      {menuGroups.map((group, idx) => (
        <div key={idx} className="space-y-1">
          {/* Título da Categoria */}
          <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            {group.title}
          </h3>

          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <button
                  key={item.label}
                  onClick={() => !item.disabled && router.push(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
                    ${item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                    ${isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 font-semibold"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }
                  `}
                  disabled={item.disabled}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  
                  <span className="text-sm">
                    {item.label}
                  </span>

                  {item.disabled && (
                    <span className="ml-auto text-[9px] font-black bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                      PRO
                    </span>
                  )}

                  {isActive && !item.disabled && (
                    <ChevronRight className="ml-auto w-4 h-4 text-white/60" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

export default SidebarNav