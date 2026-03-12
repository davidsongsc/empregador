"use client"

import {
  LayoutDashboard, FileText, Settings, CalendarDays,
  PhoneCallIcon, Globe, Plug, Wallet, Notebook,
  BarChart3, UserCheck, Users, CloudBackup, Workflow, Lock,
  Headset, ShieldCheck, TrendingUp, Landmark, Eye, Filter
} from "lucide-react"

import { usePathname, useRouter } from "next/navigation"

import { useAuthStore } from "@/store/useAuthStore"
import { useCompanyStore } from "@/store/useCompanyStore"

import hasModuleAccess from "@/utils/hasModuleAccess"
import { Module } from "@/enum/moduleEnum"
import { getActiveMembership } from "@/utils/userHelpers"
import { checkLevel } from "@/utils/checkLevel"

const SidebarNav = () => {

  const pathname = usePathname()
  const router = useRouter()
  const { activeCompany } = useCompanyStore()
  const activeMembership = getActiveMembership()
  const role = activeMembership?.role

  // Aqui definimos o "poder" do usuário atual
  const hasLowAccess = checkLevel("low")
  const hasMidAccess = checkLevel("mid")
  const hasHighAccess = checkLevel("high")
  const access = {
    admin: hasModuleAccess(role, Module.ADMIN_PANEL),
    recruitment: hasModuleAccess(role, Module.RECRUITMENT),
    supervision: hasModuleAccess(role, Module.SUPERVISION),
    operational: hasModuleAccess(role, Module.OPERATIONAL),
    atendiment: hasModuleAccess(role, Module.SUPPORT_PANEL),
    sales: hasModuleAccess(role, Module.SALES),
    finance: hasModuleAccess(role, Module.FINANCE),
    moderation: hasModuleAccess(role, Module.SUPPORT_PANEL),
    candidate: hasModuleAccess(role, Module.CANDIDATE_AREA)
  }

  const companyId = activeCompany?.id


  const menuGroupsTotais = [
    {
      /* ESSENCIAIS E OPERAÇÃO DIÁRIA */
      title: "Core Operations",
      visible: true,
      items: [
        { label: "Overview", href: "/dashboard/home", icon: LayoutDashboard, disabled: !hasLowAccess },
        { label: "Nexus Portal", href: "/vagas", icon: Globe, disabled: !hasLowAccess },
        { label: "Escala de Serviço", href: "/dashboard/escala-de-servico", icon: CalendarDays, disabled: !hasMidAccess },
        { label: "Filtros de Sistema", href: "/dashboard/filtros", icon: Filter, disabled: !hasMidAccess },
      ]
    },
    {
      /* TUDO QUE ENVOLVE PESSOAS E CONTRATAÇÃO */
      title: "Human Resources & Talent",
      visible: access.recruitment || access.atendiment,
      items: [
        { label: "Vagas Ativas", href: "/dashboard/painel/minhas-vagas", icon: FileText, disabled: !hasLowAccess },
        { label: "Candidaturas", href: "/dashboard/painel/candidaturas", icon: Users, disabled: !hasMidAccess },
        { label: "Banco de Talentos", href: "/dashboard/painel/candidatos", icon: UserCheck, disabled: !hasMidAccess },
        { label: "Cronograma", href: "/dashboard/painel/eventos", icon: CalendarDays, disabled: !hasHighAccess },
        { label: "Suporte Central", href: "/dashboard/atendimento/tickets", icon: Headset, disabled: !hasLowAccess },
        { label: "Nexus AI (Bot)", href: "/dashboard/painel/whatsapp", icon: PhoneCallIcon, disabled: true },
      ]
    },
    {
      /* ANÁLISE DE DADOS, BI E PERFORMANCE */
      title: "Intelligence & Analytics",
      visible: access.supervision || access.operational,
      items: [
        { label: "Análise de Unidades", href: "/dashboard/supervisao/unidades", icon: Eye, disabled: !hasHighAccess },
        { label: "Performance Metrics", href: "/dashboard/supervisao/performance", icon: TrendingUp, disabled: !hasHighAccess },
        { label: "Relatórios BI", href: "/dashboard/painel/relatorios", icon: BarChart3, disabled: !hasMidAccess },
      ]
    },
    {
      /* ÁREA FINANCEIRA E DE VENDAS */
      title: "Capital & Revenue",
      visible: access.sales || access.finance,
      items: [
        { label: "Pipeline de Vendas", href: "/dashboard/comercial/vendas", icon: TrendingUp, visible: access.sales, disabled: !hasMidAccess },
        { label: "Fluxo de Caixa", href: "/dashboard/financeiro/caixa", icon: Wallet, visible: access.finance, disabled: !hasLowAccess },
        { label: "Faturamento", href: "/dashboard/financeiro/faturamento", icon: Landmark, visible: access.finance, disabled: !hasHighAccess },
      ].filter(item => item.visible !== false)
    },
    {
      /* SEGURANÇA, MODERAÇÃO E COMPLIANCE */
      title: "Compliance & Security",
      visible: access.moderation || access.operational,
      items: [
        { label: "Suporte Moderador", href: "/dashboard/suporte/moderador", icon: ShieldCheck, disabled: !hasMidAccess },
        { label: "Moderação de Conteúdo", href: "/dashboard/moderacao", icon: ShieldCheck, visible: access.moderation, disabled: !hasLowAccess },
        { label: "Segurança de Dados", href: "/dashboard/painel/seguranca", icon: CloudBackup, visible: access.operational, disabled: !hasHighAccess },
      ].filter(item => item.visible !== false)
    },
    {
      /* GESTÃO DA ESTRUTURA E CONFIGURAÇÕES */
      title: "Corporate Management",
      visible: access.admin || hasHighAccess,
      items: [
        { label: "Estrutura da Empresa", href: "/dashboard/painel/geral", icon: Workflow, disabled: !hasHighAccess },
        { label: "Departamentos", href: "/dashboard/painel/departamentos", icon: Landmark, disabled: !hasHighAccess },
        { label: "Multinacionais", href: "/dashboard/admin/company", icon: Lock, disabled: !hasLowAccess },
        { label: "Ferramentas", href: "/dashboard/ferramentas", icon: Settings, disabled: !hasMidAccess },
      ]
    },
    {
      /* CONTROLE TOTAL - ACESSO ROOT */
      title: "System Administration",
      visible: access.admin,
      items: [
        { label: "Gestão Corporativa", href: companyId ? `/dashboard/painel/companies/` : "/dashboard/home", icon: Settings, disabled: !hasHighAccess },
        { label: "Controle de Acessos", href: "/dashboard/painel/usuarios", icon: Users, disabled: !hasHighAccess },
        { label: "Config. Planos", href: "/dashboard/admin/planos", icon: Notebook, disabled: !hasMidAccess },
        { label: "Admin Root (Plug)", href: "/dashboard/admin", icon: Plug, disabled: !hasHighAccess },
      ]
    }
  ];
  const menuGroups = menuGroupsTotais.filter(group => group.visible)

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
                    ${isActive ? "h-full bg-amber-600" : "h-0"}
                  `} />

                  <Icon className={`
                    w-4 h-4 shrink-0
                    ${isActive ? "text-amber-500" : "text-slate-600"}
                  `} />

                  <span className={`
                    text-[11px] uppercase tracking-widest font-bold
                    ${isActive ? "text-white" : "text-slate-500"}
                  `}>
                    {item.label}
                  </span>

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