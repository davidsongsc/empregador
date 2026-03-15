'use client';
import { Users, DollarSign, Briefcase } from 'lucide-react';

export const RequirementList = ({ requirements }: { requirements: any[] }) => {
  if (!requirements || requirements.length === 0) return (
    <div className="text-[10px] text-delos-grey/30 py-2 italic uppercase">No_Requirements_Defined</div>
  );

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase size={12} className="text-delos-indigo" />
        <span className="text-[10px] font-bold text-delos-indigo uppercase tracking-widest">Staff_Requirements_Inline</span>
      </div>
      
      <div className="border border-delos-border/30 bg-delos-black/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-delos-border/30 bg-delos-black/40">
              <th className="p-2 text-[9px] text-delos-grey uppercase font-bold">Role</th>
              <th className="p-2 text-[9px] text-delos-grey uppercase font-bold text-center">Qty</th>
              <th className="p-2 text-[9px] text-delos-grey uppercase font-bold">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((req: any) => (
              <tr key={req.uid} className="border-b border-delos-border/10 hover:bg-delos-indigo/5 transition-colors">
                <td className="p-2 text-[11px] text-white font-medium uppercase">
                  {req.role_name || 'Generic_Staff'}
                </td>
                <td className="p-2 text-[11px] text-white text-center font-mono">
                  {req.quantity}
                </td>
                <td className="p-2 text-[11px] text-delos-amber font-mono">
                  R$ {Number(req.total_cost || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};