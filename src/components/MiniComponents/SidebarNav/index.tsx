"use client"

import {
  LayoutDashboard, FileText, Settings, CalendarDays,
  PhoneCallIcon, Globe, Plug, Wallet, Notebook,
  BarChart3, UserCheck, Users, CloudBackup, Workflow, Lock,
  Headset, ShieldCheck, TrendingUp, Landmark, Eye, Filter,
  Receipt,
  ShieldAlert,
  ClipboardCheck,
  ListOrdered
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
  const userRole = activeMembership?.role

  // Aqui definimos o "poder" do usuário atual
  const hasLowAccess = checkLevel("low")
  const hasMidAccess = checkLevel("mid")
  const hasHighAccess = checkLevel("high")
  const access = {
    admin: hasModuleAccess(userRole, Module.ADMIN_PANEL),
    recruitment: hasModuleAccess(userRole, Module.RECRUITMENT),
    supervision: hasModuleAccess(userRole, Module.SUPERVISION),
    operational: hasModuleAccess(userRole, Module.OPERATIONAL),
    support: hasModuleAccess(userRole, Module.SUPPORT_PANEL),
    sales: hasModuleAccess(userRole, Module.SALES),
    finance: hasModuleAccess(userRole, Module.FINANCE),
    candidate: hasModuleAccess(userRole, Module.CANDIDATE_AREA),
    compliance: hasModuleAccess(userRole, Module.COMPLIANCE) // Adicionado conforme solicitado antes
  };

  const companyId = activeCompany?.id


  const menuGroupsTotais = [

    {
      /* ESSENCIAIS E OPERAÇÃO DIÁRIA */
      title: "Operacional",
      visible: access.operational.hasAccess,
      items: [
        { label: "Dashboard", href: "/dashboard/home", icon: LayoutDashboard, disabled: !hasMidAccess },

        { label: "Escala de Serviço", href: "/dashboard/escala-de-servico", icon: CalendarDays, disabled: !hasMidAccess },
        { label: "Faltas", href: "/dashboard/atendimento/tickets", icon: ClipboardCheck, disabled: !hasHighAccess },
        { label: "Fila de Espera", href: "/dashboard/relatorio-de-faltas", icon: ListOrdered, disabled: !hasLowAccess },
        { label: "Filtros ", href: "/dashboard/filtros", icon: Filter, disabled: !hasHighAccess },
      ]
    },
    {
      /* TUDO QUE ENVOLVE PESSOAS E CONTRATAÇÃO */
      title: "Fale Conosco",
      visible: access.support.hasAccess,
      items: [

        { label: "Suporte Central", href: "/dashboard/atendimento/tickets", icon: Headset, disabled: !hasLowAccess },
        { label: "Nexus AI (Bot)", href: "/dashboard/painel/whatsapp", icon: PhoneCallIcon, disabled: true },
      ]
    },
    {
      /* TUDO QUE ENVOLVE PESSOAS E CONTRATAÇÃO */
      title: "Equipe & Recrutamento",
      visible: access.recruitment.hasAccess,
      items: [
        { label: "Vagas Publicas", href: "/dashboard/painel/minhas-vagas", icon: FileText, disabled: !hasMidAccess },
        { label: "Candidaturas", href: "/dashboard/painel/candidaturas", icon: Users, disabled: !hasMidAccess },
        { label: "Equipe", href: "/dashboard/equipe", icon: UserCheck, disabled: !hasMidAccess },
        { label: "Cronograma", href: "/dashboard/painel/eventos", icon: CalendarDays, disabled: !hasHighAccess }

      ]
    },
    {
      /* ANÁLISE DE DADOS, BI E PERFORMANCE */
      title: "Supervisão",
      visible: access.supervision.hasAccess,
      items: [
        { label: "Unidades", href: "/dashboard/supervisao/unidades", icon: Eye, disabled: !hasHighAccess },
        { label: "Performance", href: "/dashboard/supervisao/performance", icon: TrendingUp, disabled: !hasHighAccess },
        { label: "Relatórios BI", href: "/dashboard/painel/relatorios", icon: BarChart3, disabled: !hasMidAccess },
      ]
    },
    {
      /* ÁREA FINANCEIRA E DE VENDAS */
      title: "Financeiro",
      visible: access.finance.hasAccess,
      items: [
        { label: "Caixa", href: "/dashboard/comercial/vendas", icon: Receipt, visible: access.sales, disabled: !hasMidAccess },
        { label: "Fluxo de Caixa", href: "/dashboard/financeiro/caixa", icon: Wallet, visible: access.finance, disabled: !hasLowAccess },
        { label: "Faturamento", href: "/dashboard/financeiro/faturamento", icon: Landmark, visible: access.finance, disabled: !hasHighAccess },
      ].filter(item => item.visible !== false)
    },
    {
      /* SEGURANÇA, MODERAÇÃO E COMPLIANCE */
      title: "Suporte Operacional",
      visible: access.support.hasAccess || access.operational.hasAccess,
      items: [
        { label: "Suporte", href: "/dashboard/suporte/moderador", icon: ShieldCheck, disabled: !hasMidAccess },
        { label: "Moderação", href: "/dashboard/moderacao", icon: ShieldAlert, visible: access.moderation, disabled: !hasLowAccess },
        { label: "Segurança", href: "/dashboard/painel/seguranca", icon: CloudBackup, visible: access.operational, disabled: !hasHighAccess },
      ].filter(item => item.visible !== false)
    },
    {
      /* GESTÃO DA ESTRUTURA E CONFIGURAÇÕES */
      title: "Administração",
      visible: access.admin.hasAccess,
      items: [
        { label: "Estrutura", href: "/dashboard/painel/geral", icon: Workflow, disabled: !hasHighAccess },
        { label: "Departamentos", href: "/dashboard/painel/departamentos", icon: Landmark, disabled: !hasHighAccess },
        { label: "Multinacionais", href: "/dashboard/admin/company", icon: Lock, disabled: !hasLowAccess },
        { label: "Ferramentas", href: "/dashboard/ferramentas", icon: Settings, disabled: !hasMidAccess },
      ]
    },
    {
      /* CONTROLE TOTAL - ACESSO ROOT */
      title: "Admin Root",
      visible: access.admin.hasAccess,
      items: [
        { label: "Corporativa", href: companyId ? `/dashboard/painel/companies/` : "/dashboard/home", icon: Settings, disabled: !hasHighAccess },
        { label: "Acessos", href: "/dashboard/painel/usuarios", icon: Users, disabled: !hasHighAccess },
        { label: "Planos", href: "/dashboard/admin/planos", icon: Notebook, disabled: !hasMidAccess },
        { label: "Externos", href: "/dashboard/admin", icon: Plug, disabled: !hasHighAccess },
      ]
    },
    {
      title: "Web",
      visible: true,
      items: [
        { label: "Pagina Principal", href: "/vagas", icon: Globe, disabled: false },

      ]
    }
  ];
  const menuGroups = menuGroupsTotais.filter(group => group.visible)

  return (
    <nav className="flex-1 px-1 space-y-6 overflow-y-auto no-scrollbar py-2">
      {menuGroups.map((group, idx) => (
        <div key={idx} className="space-y-2">
          <div className="flex items-center gap-2 px-2 mb-4">
            <div className="w-1 h-3 bg-delos-amber/40" />
            <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-delos-indigo">
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
                    ${isActive ? "text-delos-amber" : "text-delos-grey"}
                  `} />

                  <span className={`
                    text-[14px] uppercase tracking-widest font-bold
                    ${isActive ? "text-delos-black underline underline-offset-4" : "text-delos-grey"}
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