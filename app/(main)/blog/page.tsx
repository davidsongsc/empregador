"use client";

import {
    FileText,
    CheckCircle2,
    XCircle,
    Lightbulb,
    Download,
    ArrowRight,
    Target,
    Eye,
    AlertTriangle,
    Zap
} from 'lucide-react';
import Link from 'next/link';

const DicasCurriculoPage = () => {
    const categorias = [
        {
            titulo: "O que não pode faltar",
            dicas: ["Dados de contato atualizados", "Objetivo profissional claro", "Experiências recentes primeiro", "Principais competências"],
            icon: <CheckCircle2 className="w-6 h-6 text-green-500" />
        },
        {
            titulo: "Erros fatais",
            dicas: ["Erros de português", "Foto (exceto se solicitado)", "Informações pessoais excessivas", "Mentir sobre habilidades"],
            icon: <XCircle className="w-6 h-6 text-red-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* --- HERO SECTION --- */}
                <section className="bg-white rounded-[50px] p-10 md:p-16 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Lightbulb className="w-4 h-4" /> Dicas de Carreira
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                            Seu currículo é seu <span className="text-indigo-600">cartão de visitas.</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed">
                            Recrutadores gastam em média 6 segundos na primeira leitura de um currículo. Aprenda a se destacar nesse tempo recorde.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-gray-100 flex items-center gap-2">
                                <Download className="w-5 h-5" /> Baixar Modelo Ideal
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="bg-indigo-100 w-full h-80 rounded-[40px] flex items-center justify-center relative overflow-hidden">
                            <FileText className="w-32 h-32 text-indigo-600 opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-xs space-y-4 rotate-3 group hover:rotate-0 transition-transform duration-500">
                                    <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                                    <div className="h-3 w-full bg-gray-50 rounded"></div>
                                    <div className="h-3 w-full bg-gray-50 rounded"></div>
                                    <div className="h-3 w-1/2 bg-indigo-50 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- GRID DE ORIENTAÇÕES --- */}
                <section className="grid md:grid-cols-2 gap-8">
                    {categorias.map((cat, i) => (
                        <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-gray-50 rounded-2xl">{cat.icon}</div>
                                <h3 className="text-2xl font-black text-gray-900">{cat.titulo}</h3>
                            </div>
                            <ul className="space-y-4">
                                {cat.dicas.map((dica, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-600 font-semibold text-sm">
                                        <span className="mt-1 w-1.5 h-1.5 bg-gray-200 rounded-full flex-shrink-0"></span>
                                        {dica}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>

                {/* --- O MÉTODO DOS 6 SEGUNDOS --- */}
                <section className="bg-indigo-600 rounded-[50px] p-10 md:p-20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Eye className="w-64 h-64" />
                    </div>
                    <div className="max-w-2xl space-y-8 relative z-10">
                        <h2 className="text-4xl font-black leading-tight">A Regra dos 6 Segundos</h2>
                        <p className="text-indigo-100 text-lg font-medium leading-relaxed">
                            Para ser aprovado na triagem inicial, seu currículo deve responder rapidamente a três perguntas:
                        </p>
                        <div className="grid gap-4">
                            {[
                                { q: "Quem é você?", a: "Nome e área de atuação clara no topo." },
                                { q: "O que você sabe fazer?", a: "Competências e resumo profissional." },
                                { q: "Onde você já esteve?", a: "Empresas e cargos recentes." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/10">
                                    <p className="text-indigo-300 text-xs font-black uppercase mb-1">{item.q}</p>
                                    <p className="font-bold">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- DICAS POR NÍVEL --- */}
                <section className="space-y-10">
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-gray-900">Dicas para cada momento</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4 hover:border-indigo-600 transition-all group">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                <Target className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-xl">Primeiro Emprego</h4>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">Foque em formação acadêmica, cursos, voluntariado e projetos escolares.</p>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4 hover:border-indigo-600 transition-all group">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-xl">Transição de Carreira</h4>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">Destaque habilidades transferíveis e o motivo da mudança no seu resumo.</p>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4 hover:border-indigo-600 transition-all group">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-xl">Nível Sênior</h4>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">Foque em resultados mensuráveis, liderança e conquistas estratégicas.</p>
                        </div>
                    </div>
                </section>

                {/* --- CTA FINAL --- */}
                <section className="bg-gray-900 rounded-[40px] p-10 md:p-16 text-center text-white space-y-8">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <h2 className="text-3xl font-black">Pronto para a próxima vaga?</h2>
                        <p className="text-gray-400 font-medium">Agora que seu currículo está nota 10, que tal aplicá-lo hoje mesmo?</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link href="/vagas" className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/20">
                            Explorar Vagas
                        </Link>
                        <Link href="/perfil" className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-black hover:bg-white/20 transition-all">
                            Atualizar meu Perfil
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
};

// Componente simples para ícone de TrendingUp (evitar erro de import se faltar)
const TrendingUp = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

export default DicasCurriculoPage;