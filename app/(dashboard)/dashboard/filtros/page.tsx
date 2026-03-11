"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Lock, 
  Eye, 
  Edit3, 
  Users, 
  Terminal, 
  Save, 
  ChevronRight,
  Fingerprint,
  Activity
} from "lucide-react";

const SECTORES = [
  { id: "adm", name: "Diretoria_Executiva", level: "Lvl_05" },
  { id: "op", name: "Operações_Campo", level: "Lvl_03" },
  { id: "fin", name: "Controladoria_Financeira", level: "Lvl_04" },
  { id: "sup", name: "Suporte_Técnico", level: "Lvl_02" },
];

const PERMISSIONS = [
  { key: "view_hosts", label: "Visualizar_Hosts", category: "Data" },
  { key: "edit_schedules", label: "Alterar_Escalas", category: "Action" },
  { key: "access_reports", label: "Extração_Relatórios", category: "Data" },
  { key: "manage_users", label: "Gestão_de_Usuários", category: "System" },
];

export default function FiltrosPermissoesPage() {
  const [selectedSector, setSelectedSector] = useState(SECTORES[0]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-12 space-y-12 font-mono text-delos-black bg-delos-surface transition-colors duration-500">
      
      {/* GRID DECORATIVO */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
          backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
      }} />

      {/* HEADER: Protocolo de Acesso */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-delos-grey/20 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Fingerprint size={16} className="text-delos-amber" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-delos-grey">Security_Access_Protocol</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Matriz_de_<span className="text-delos-amber">Privilégios</span>
          </h1>
          <p className="text-delos-grey text-[10px] uppercase tracking-[0.2em] max-w-xl">
            Defina o que cada setor está autorizado a visualizar ou manipular na rede Delos_White.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: SELEÇÃO DE CARGO/SETOR */}
        <aside className="lg:col-span-4 space-y-4">
          <h3 className="text-[9px] font-black uppercase tracking-widest text-delos-grey ml-2">Setores_Identificados</h3>
          <div className="flex flex-col border border-delos-grey/10 bg-delos-black/[0.02]">
            {SECTORES.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector)}
                className={`flex items-center justify-between p-6 transition-all border-l-2 ${
                  selectedSector.id === sector.id 
                  ? "bg-delos-black border-delos-amber text-delos-surface" 
                  : "border-transparent hover:bg-delos-black/5 text-delos-black"
                }`}
              >
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-tighter italic">{sector.name}</p>
                  <p className={`text-[8px] font-bold tracking-widest uppercase mt-1 ${selectedSector.id === sector.id ? "text-delos-amber" : "text-delos-grey"}`}>
                    Access_Level: {sector.level}
                  </p>
                </div>
                <ChevronRight size={14} className={selectedSector.id === sector.id ? "text-delos-amber" : "text-delos-grey"} />
              </button>
            ))}
          </div>
        </aside>

        {/* COLUNA DIREITA: MATRIZ DE PERMISSÕES */}
        <main className="lg:col-span-8 space-y-8">
          <div className="bg-delos-surface border border-delos-grey/20 overflow-hidden shadow-2xl transition-all">
            
            {/* TABLE HEADER: OPOSIÇÃO TOTAL */}
            <div className="bg-delos-black p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4 text-delos-surface">
                <Shield size={18} className="text-delos-amber" />
                <h2 className="text-sm font-black italic uppercase tracking-[0.2em]">Permissões: {selectedSector.name}</h2>
              </div>
              <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">Node_Edit_Mode</span>
            </div>

            {/* PERMISSIONS LIST */}
            <div className="divide-y divide-delos-grey/10">
              {PERMISSIONS.map((perm) => (
                <div key={perm.key} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-delos-black/[0.02] transition-colors">
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="w-10 h-10 bg-delos-black flex items-center justify-center text-delos-surface border border-white/10">
                      {perm.category === 'Action' ? <Edit3 size={14} /> : <Eye size={14} />}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-delos-black">{perm.label}</p>
                      <p className="text-[7px] text-delos-grey uppercase tracking-widest mt-1">Scope: {perm.category}_Domain</p>
                    </div>
                  </div>

                  {/* SWITCH TÉCNICO */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black uppercase text-delos-grey opacity-50">DENY</span>
                        <div className="w-12 h-6 bg-delos-black p-1 relative cursor-pointer border border-white/10 group">
                            <div className="absolute right-1 w-4 h-4 bg-delos-amber shadow-[0_0_10px_rgba(217,119,6,0.5)] transition-all" />
                        </div>
                        <span className="text-[8px] font-black uppercase text-delos-amber">ALLOW</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ACTION FOOTER: OPOSIÇÃO TOTAL */}
            <div className="p-8 bg-delos-black/[0.03] border-t border-delos-grey/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Activity size={14} className="text-delos-amber animate-pulse" />
                <span className="text-[8px] text-delos-grey uppercase tracking-[0.2em]">As alterações afetarão {Math.floor(Math.random() * 20) + 1} hosts ativos neste setor.</span>
              </div>
              
              <button className="w-full md:w-auto flex items-center justify-center gap-4 bg-delos-black text-delos-surface px-10 py-5 font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-delos-amber active:scale-95 border border-white/10">
                <Save size={16} />
                Confirm_Privileges
              </button>
            </div>
          </div>

          {/* WARNING BLOCK */}
          <div className="bg-delos-amber/[0.05] border border-delos-amber/20 p-6 flex items-start gap-4">
             <Lock size={20} className="text-delos-amber shrink-0" />
             <div className="space-y-1">
                <p className="text-[10px] font-black text-delos-amber uppercase tracking-widest">Protocolo_de_Segurança_Ativo</p>
                <p className="text-[9px] text-delos-grey uppercase leading-relaxed tracking-widest">
                  Alterar permissões de níveis Lvl_04 e acima gera um log imediato na central de auditoria da Diretoria_Executiva.
                </p>
             </div>
          </div>
        </main>
      </div>

      {/* FOOTER TÉCNICO */}
      <footer className="pt-10 border-t border-delos-grey/10 flex justify-between items-center opacity-40">
        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.5em]">
          <Terminal size={12} />
          Matrix_Safe_Encryption_Enabled
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">System_Version: DLS_4.0</span>
      </footer>
    </div>
  );
}