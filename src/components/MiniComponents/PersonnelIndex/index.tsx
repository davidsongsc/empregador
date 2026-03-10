import { ShieldCheck, ExternalLink } from "lucide-react";

interface Member {
  id: string | number;
  profile_name: string;
  role: string;
  joined_at: string;
}

interface PersonnelIndexProps {
  members: Member[];
  onInspectMember?: (id: string | number) => void;
}

export const PersonnelIndex = ({ members, onInspectMember }: PersonnelIndexProps) => {
  return (
    <section className="border border-white/[0.03] bg-[#141414] shadow-xl overflow-hidden">
      {/* HEADER DA TABELA */}
      <div className="px-8 py-5 border-b border-white/[0.03] bg-white/[0.01]">
        <h2 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white">
          <ShieldCheck className="text-amber-600 opacity-50" size={14} />
          Membros da Equipe
        </h2>
      </div>

      {/* CONTAINER SCROLLABLE */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] text-[8px] font-black uppercase tracking-[0.4em] text-slate-700 font-mono">
              <th className="px-8 py-5">Profile_ID</th>
              <th className="px-8 py-5">Auth_Protocol</th>
              <th className="px-8 py-5">Link_Date</th>
              <th className="px-8 py-5 text-right">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {members?.map((member) => (
              <tr key={member.id} className="group hover:bg-white/[0.01] transition-colors">
                {/* NOME E AVATAR */}
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 bg-black border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-700 uppercase transition-all group-hover:border-amber-600/30 group-hover:text-amber-600">
                      {member.profile_name.charAt(0)}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">
                      {member.profile_name}
                    </span>
                  </div>
                </td>

                {/* PROTOCOLO (ROLE) */}
                <td className="px-8 py-4">
                  <span className={`px-2 py-0.5 border text-[7px] font-black uppercase tracking-[0.2em] ${
                    member.role === 'RECRUITER' || member.role === 'ADMIN' 
                      ? 'border-amber-600/30 text-amber-600 bg-amber-600/5' 
                      : 'border-slate-800 text-slate-600'
                  }`}>
                    {member.role}
                  </span>
                </td>

                {/* DATA DE REGISTRO */}
                <td className="px-8 py-4 text-[10px] font-mono text-slate-600 uppercase italic tracking-tighter">
                  {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                </td>

                {/* AÇÃO */}
                <td className="px-8 py-4 text-right">
                  <button 
                    onClick={() => onInspectMember?.(member.id)}
                    className="text-slate-800 hover:text-white transition-colors p-2"
                  >
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}

            {(!members || members.length === 0) && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-[10px] font-mono text-slate-700 uppercase tracking-[0.4em] italic opacity-20">
                  No_Personnel_Linked_to_Protocol
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};