"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Settings, CalendarDays, PhoneCallIcon,
  Globe, Wallet, UserCheck, Users, Workflow, Headset,
  Filter, Receipt, ListOrdered, ClipboardCheck,
  ShieldCheck
} from "lucide-react";

import { useUserPermissions } from "@/hooks/useUserPermissions";
import { getActiveMembership } from "@/utils/userHelpers";

// Definindo a interface para receber o parâmetro de colapso
interface SidebarNavProps {
  isCollapsed?: boolean;
}

const SidebarNav = ({ isCollapsed = false }: SidebarNavProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const activeMembership = getActiveMembership();
  const userRole = activeMembership?.role || "";

  const { modules, low, mid, high, veryLow, isSuperAdmin } = useUserPermissions(userRole);

  const menuGroups = useMemo(() => {
    const groups = [
      {
        title: "SaaS Painel",
        visible: modules.operational || modules.compliance,
        items: [
          { label: "Dashboard", href: "/dashboard/home", icon: LayoutDashboard, disabled: !low },
          { label: "Configurações", href: "/dashboard/configuracoes", icon: Settings, disabled: !low },
          { label: "Suporte", href: "/dashboard/suporte", icon: Headset, disabled: !low },
          { label: "Equipe", href: "/dashboard/equipe", icon: UserCheck, disabled: !mid },
        ]
      },
      {
        title: "Operação",
        visible: modules.operational || modules.compliance,
        items: [
          { label: "Escala", href: "/dashboard/escala-de-servico", icon: CalendarDays, disabled: !mid },
          { label: "Faltas", href: "/dashboard/atendimento/tickets", icon: ClipboardCheck, disabled: !high },
          { label: "Fila", href: "/dashboard/relatorio-de-faltas", icon: ListOrdered, disabled: !low },
          { label: "Filtros", href: "/dashboard/filtros", icon: Filter, disabled: !high },
        ]
      },
      {
        title: "Atendimento",
        visible: modules.support,
        items: [
          { label: "Tickets", href: "/dashboard/atendimento/tickets", icon: Headset, disabled: !low },
          { label: "Nexus AI", href: "#", icon: PhoneCallIcon, disabled: true },
        ]
      },
      {
        title: "Recrutamento",
        visible: modules.recruitment,
        items: [
          { label: "Vagas", href: "/dashboard/painel/minhas-vagas", icon: FileText, disabled: !low },
          { label: "Candidatos", href: "/dashboard/painel/minhas-vagas2", icon: FileText, disabled: !low },
          { label: "Cronograma", href: "/dashboard/painel/eventos", icon: CalendarDays, disabled: !high }
        ]
      },
      {
        title: "Financeiro",
        visible: modules.finance || modules.sales,
        items: [
          { label: "Abrir Caixa", href: "/dashboard/caixa/abertura", icon: Receipt, disabled: !low },
          { label: "Fluxo", href: "/dashboard/financeiro/caixa", icon: Wallet, disabled: !mid },
          { label: "Faturamento", href: "/dashboard/financeiro/faturamento", icon: Receipt, disabled: !high },
        ]
      },
      {
        title: "Administração",
        visible: modules.supervision || mid || modules.compliance,
        items: [
          { label: "Estrutura", href: "/dashboard/painel/geral", icon: Workflow, disabled: !high },
          { label: "Acessos", href: "/dashboard/painel/usuarios", icon: Users, disabled: !high },
          { label: "Corporativa", href: `/dashboard/painel/companies/`, icon: ShieldCheck, disabled: !high, visible: isSuperAdmin },
        ].filter(i => i.visible !== false)
      },
      {
        title: "Web",
        visible: veryLow,
        items: [
          { label: "Vagas Abertas", href: "/vagas", icon: Globe, disabled: false },
        ]
      }
    ];

    return groups.filter(g => g.visible);
  }, [modules, low, mid, high, veryLow, isSuperAdmin]);

  return (
    // Removido o aside fixo para não conflitar com o container pai
    <nav className={`flex-1 py-4 no-scrollbar scroll-smooth space-y-6 transition-all duration-500 ${isCollapsed ? 'px-0' : 'px-2'} h-100`}>
      {menuGroups.map((group, idx) => (
        <section key={idx} className="relative">
          {/* Header de Grupo - Esconde quando colapsado */}
          {!isCollapsed && (
            <header className="px-3 py-2 mb-2 flex items-center gap-2">
              <div className="w-1 h-3 rounded-full bg-amber-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-delos-black/30">
                {group.title}
              </span>
            </header>
          )}

          <ul className="space-y-[4px]">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.label} className="flex justify-center">
                  <button
                    onClick={() => !item.disabled && router.push(item.href)}
                    disabled={item.disabled}
                    title={isCollapsed ? item.label : ""} // Tooltip apenas se colapsado
                    className={`
                      relative flex items-center transition-all duration-300
                      ${item.disabled 
                        ? "opacity-20 cursor-not-allowed" 
                        : "hover:bg-delos-black active:scale-95 group"}
                      ${isCollapsed 
                        ? "w-10 h-10 justify-center rounded-lg" 
                        : "w-full gap-3 px-4 py-2.5 rounded-lg"}
                      ${isActive ? "bg-amber-500/10 border border-amber-500/20" : "border border-transparent"}
                    `}
                  >
                    <Icon className={`
                      w-4 h-4 transition-colors shrink-0
                      ${isActive ? "text-amber-500 stroke-[2.5px]" : "text-slate-400 group-hover:text-white"}
                    `} />

                    {/* Texto do Label - Esconde com animação de opacidade */}
                    {!isCollapsed && (
                      <span className={`
                        text-[11px] font-bold tracking-tight uppercase transition-colors whitespace-nowrap
                        ${isActive ? "text-amber-500" : "text-slate-400 group-hover:text-slate-200"}
                      `}>
                        {item.label}
                      </span>
                    )}

                    {/* Indicador Ativo */}
                    {isActive && (
                      <div className={`
                        bg-amber-500 animate-pulse
                        ${isCollapsed 
                          ? "absolute -right-1 w-1 h-4 rounded-full" 
                          : "ml-auto w-1 h-1 rounded-full"}
                      `} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Divisor minimalista entre grupos quando colapsado */}
          {isCollapsed && <div className="h-[1px] w-8 mx-auto bg-white/5 my-4" />}
        </section>
      ))}
    </nav>
  );
};

export default SidebarNav;