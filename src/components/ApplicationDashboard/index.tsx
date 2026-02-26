import { Briefcase } from "lucide-react";
import ApplicationItem from "@/components/ApplicationItem";

const ApplicationDashboard = ({ applications, totalCount }: { applications: any[], totalCount: number }) => {
    return (
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Minhas Atividades</h2>
                    <p className="text-gray-400 text-sm font-medium">Acompanhe o progresso das suas candidaturas</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-4xl font-black text-indigo-600">
                        {totalCount.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inscrições</span>
                </div>
            </div>

            <div className="space-y-4">
                {applications.length > 0 ? (
                    applications.map((cand) => (
                        <ApplicationItem key={cand.id} cand={cand} />
                    ))
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-black uppercase text-xs">Nenhuma candidatura encontrada</p>
                        <button className="mt-4 text-indigo-600 font-black text-xs hover:underline">
                            EXPLORAR VAGAS
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationDashboard;