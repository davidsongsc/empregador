import { Briefcase, Clock, ChevronRight } from 'lucide-react';
const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
    applied: { bg: 'bg-blue-100', text: 'text-blue-700' },
    reviewing: { bg: 'bg-orange-100', text: 'text-orange-700' },
    interview: { bg: 'bg-purple-100', text: 'text-purple-700' },
    hired: { bg: 'bg-green-100', text: 'text-green-700' },
    rejected: { bg: 'bg-gray-100', text: 'text-black' },
    withdrawn: { bg: 'bg-gray-100', text: 'text-gray-700' },
};
const ApplicationItem = ({ cand }: { cand: any }) => {
    // Busca a cor no mapa ou usa um padrão cinza
    const theme = STATUS_CONFIG[cand.status] || { bg: 'bg-gray-100', text: 'text-gray-700' };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 group">
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-black text-gray-900 text-lg leading-tight">{cand.cargo}</h4>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-indigo-600 font-bold">{cand.empresa_nome}</p>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                            <Clock className="w-3 h-3" /> {cand.data_aplicacao}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                <span className={`text-[10px] font-black uppercase px-5 py-2 rounded-full tracking-wider ${theme.bg} ${theme.text}`}>
                    {cand.status_display}
                </span>
                <button className="bg-white p-3 rounded-xl border border-gray-100 hover:bg-gray-900 hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ApplicationItem;