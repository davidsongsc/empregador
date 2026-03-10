"use client"

import {
  LayoutDashboard, FileText, Settings, CalendarDays,
  PhoneCallIcon, Globe, Plug, Wallet, Notebook,
  BarChart3, UserCheck, Users, CloudBackup, ChevronRight, Lock,
  Headset, ShieldCheck, TrendingUp, Landmark, Eye
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { useCompanyStore } from "@/store/useCompanyStore"
import { checkModuleAccess } from "@/utils/hasRecruitmentPermission"

const SidebarNav = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthStore()
  const { activeCompany } = useCompanyStore()
  
  const empresas = user?.profile?.empresas
  const companyId = activeCompany?.id || empresas?.find(emp => emp.is_active)?.id

  // Mapeamento de Permissões
  const access = {
    admin: checkModuleAccess(empresas, 'ADMIN_PANEL'),
    recruitment: checkModuleAccess(empresas, 'RECRUITMENT'),
    supervision: checkModuleAccess(empresas, 'SUPERVISION'),
    operational: checkModuleAccess(empresas, 'OPERATIONAL'),
    atendiment: checkModuleAccess(empresas, 'ATENDIMENT'),
    sales: checkModuleAccess(empresas, 'SALES'),
    finance: checkModuleAccess(empresas, 'FINANCE'),
    moderation: checkModuleAccess(empresas, 'MODERATION'),
    candidate: checkModuleAccess(empresas, 'CANDIDATE_AREA'),
  }

  const menuGroupsTotais = [
    {
      title: "Sistema",
      visible: true,
      items: [
        { label: "Dashboard", href: "/dashboard/home", icon: LayoutDashboard },
        { label: "Portal Global", href: "/vagas", icon: Globe },
      ]
    },
    {
      title: "Recrutamento",
      visible: access.recruitment,
      items: [
        { label: "Vagas", href: "/dashboard/painel/minhas-vagas", icon: FileText },
        { label: "Candidatos", href: "/dashboard/painel/candidatos", icon: UserCheck, disabled: !companyId },
        { label: "Cronograma", href: "/dashboard/painel/eventos", icon: CalendarDays },
      ]
    },
    {
      title: "Supervisão",
      visible: access.supervision,
      items: [
        { label: "Análise de Unidades", href: "/dashboard/supervisao/unidades", icon: Eye, disabled: !companyId },
        { label: "Performance", href: "/dashboard/supervisao/performance", icon: TrendingUp },
      ]
    },
    {
      title: "Comercial & Financeiro",
      visible: access.sales || access.finance,
      items: [
        { label: "Pipeline Vendas", href: "/dashboard/comercial/vendas", icon: TrendingUp, visible: access.sales },
        { label: "Fluxo de Caixa", href: "/dashboard/financeiro/caixa", icon: Wallet, visible: access.finance, disabled: !companyId },
        { label: "Faturamento", href: "/dashboard/financeiro/faturamento", icon: Landmark, visible: access.finance },
      ].filter(item => item.visible !== false)
    },
    {
      title: "Operações & Compliance",
      visible: access.operational || access.moderation,
      items: [
        { label: "Moderação Content", href: "/dashboard/moderacao", icon: ShieldCheck, visible: access.moderation },
        { label: "Segurança de Dados", href: "/dashboard/painel/seguranca", icon: CloudBackup, visible: access.operational },
        { label: "Relatórios BI", href: "/dashboard/painel/relatorios", icon: BarChart3, visible: access.operational, disabled: !companyId },
      ].filter(item => item.visible !== false)
    },
    {
      title: "Atendimento",
      visible: access.atendiment,
      items: [
        { label: "Suporte Central", href: "/dashboard/atendimento/tickets", icon: Headset },
        { label: "Nexus AI (Bot)", href: "/dashboard/painel/whatsapp", icon: PhoneCallIcon, disabled: true },
      ]
    },
    {
      title: "Corporativo",
      visible: access.admin,
      items: [
        { label: "Gestão Empresa", href: companyId ? `/dashboard/painel/companies/` : "/dashboard/painel", icon: Settings, disabled: !companyId },
        { label: "Controle de Acessos", href: "/dashboard/painel/usuarios", icon: Users, disabled: !companyId },
        { label: "Admin Root", href: "/dashboard/admin", icon: Plug, disabled: !companyId },
        { label: "Config. Planos", href: "/dashboard/admin/planos", icon: Notebook },
        { label: "Multinacionais", href: "/dashboard/admin/company", icon: Lock },
      ]
    }
  ]

  const menuGroups = menuGroupsTotais.filter(group => group.visible);

  return (
    <nav className="flex-1 px-1 space-y-6 overflow-y-auto no-scrollbar py-2">
      {menuGroups.map((group, idx) => (
        <div key={idx} className="space-y-2">
          <div className="flex items-center gap-2 px-2 mb-4">
            <div className="w-1 h-3 bg-amber-600/40" />
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
              {group.title}
            </h3>
          </div>

          <div className="space-y-[2px]">
            {group.items.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <button
                  key={item.label}
                  onClick={() => !item.disabled && router.push(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 transition-all duration-300 group relative
                    ${item.disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  disabled={item.disabled}
                >
                  <div className={`
                    absolute left-0 w-[2px] transition-all duration-500
                    ${isActive ? "h-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)]" : "h-0 bg-transparent group-hover:h-1/2 group-hover:bg-slate-700"}
                  `} />

                  <Icon className={`
                    w-4 h-4 shrink-0 transition-colors duration-300
                    ${isActive ? "text-amber-500" : "text-slate-600 group-hover:text-slate-300"}
                  `} />

                  <span className={`
                    text-[11px] uppercase tracking-widest font-bold transition-colors duration-300
                    ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}
                  `}>
                    {item.label}
                  </span>

                  {item.disabled ? (
                    <Lock className="ml-auto w-3 h-3 text-slate-700" />
                  ) : (
                    isActive && (
                      <div className="ml-auto flex items-center gap-1">
                        <div className="w-1 h-1 bg-amber-600 rounded-full animate-pulse" />
                        <ChevronRight className="w-3 h-3 text-amber-600" />
                      </div>
                    )
                  )}

                  <div className={`
                    absolute inset-0 -z-10 transition-colors
                    ${isActive ? "bg-amber-600/5" : "group-hover:bg-white/[0.02]"}
                  `} />
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