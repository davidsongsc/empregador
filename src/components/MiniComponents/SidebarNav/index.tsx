"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Settings, CalendarDays, PhoneCallIcon,
  Globe, Wallet, Notebook, UserCheck, Users, Workflow, Headset,
  Filter, Receipt, ListOrdered, ClipboardCheck,
  ShieldCheck
} from "lucide-react";

import { useUserPermissions } from "@/hooks/useUserPermissions";
import { getActiveMembership } from "@/utils/userHelpers";

const SidebarNav = () => {
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
    <aside className="flex flex-col h-screen w-full bg-white border-r border-slate-100 overflow-hidden">


      {/* ÁREA DE SCROLL INDEPENDENTE */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 no-scrollbar scroll-smooth space-y-8">
        {menuGroups.map((group, idx) => (
          <section key={idx} className="relative">
            {/* Header de Grupo Sticky */}
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-3 py-2 mb-2 flex items-center gap-2">
              <div className="w-1 h-3 rounded-full bg-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900/60">
                {group.title}
              </span>
            </header>

            <ul className="space-y-[2px]">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.label}>
                    <button
                      onClick={() => !item.disabled && router.push(item.href)}
                      disabled={item.disabled}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                        ${item.disabled
                          ? "opacity-25 cursor-not-allowed grayscale"
                          : "hover:bg-slate-50 active:scale-[0.98] group"}
                        ${isActive ? "bg-amber-50 shadow-sm shadow-amber-200/20" : ""}
                      `}
                    >
                      <Icon className={`
                        w-4 h-4 transition-colors
                        ${isActive ? "text-amber-600 stroke-[2.5px]" : "text-slate-400 group-hover:text-slate-600"}
                      `} />

                      <span className={`
                        text-xs font-bold tracking-tight uppercase transition-colors
                        ${isActive ? "text-amber-700" : "text-slate-500 group-hover:text-slate-800"}
                      `}>
                        {item.label}
                      </span>

                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      {/* Rodapé fixo opcional */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/50">
        <p className="text-[8px] text-center font-bold text-slate-400 uppercase tracking-widest">
          v2.6.0 Protocol Nexus
        </p>
      </div>
    </aside>
  );
};

export default SidebarNav;