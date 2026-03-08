import {
    BarChart3,
    FileSpreadsheet,
    ShieldCheck,
    Zap,
    FileCheck,
    Users,
    ArrowRight,
    TrendingUp,
    Download,
    Lock,
    MousePointerClick,
    CheckCircle
} from "lucide-react";
import PricingSection from "@/components/PageComponents/PricingSection";
export default function BusinessPlanPage() {
    return (
        <div className="bg-white text-slate-900 antialiased mt-25">

            {/* --- HERO SECTION: O POSICIONAMENTO --- */}
            <section className="relative overflow-hidden bg-slate-950 pt-24 pb-32">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <TrendingUp size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">Escalabilidade & Inteligência</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
                            Sua produtora no <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                Piloto Automático.
                            </span>
                        </h1>
                        <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                            O Plano Business transforma sua operação manual em uma máquina de dados.
                            Do recrutamento inteligente ao pagamento em lote via PIX.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-2xl shadow-indigo-500/40">
                                ASSINAR PLANO BUSINESS
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- OS TRÊS PILARES DO BRIEFING --- */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Pilar 1: Conforto Financeiro */}
                    <div className="group p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all">
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Pagamento em Lote</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Gere arquivos <strong>.CSV</strong> formatados para o seu banco. Nome, CPF e Chave Pix prontos.
                            Pague 100 pessoas em segundos sem digitar um único número.
                        </p>
                    </div>

                    {/* Pilar 2: Backup & Segurança */}
                    <div className="group p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all">
                        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Plano de Contingência</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Internet caiu? O show não para. Exporte listas de presença em Excel ou PDF para acesso offline
                            ou impressão. Segurança total para o produtor.
                        </p>
                    </div>

                    {/* Pilar 3: Liberdade Analítica */}
                    <div className="group p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BarChart3 size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-4">BI e Exportação Custom</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Crie suas próprias tabelas dinâmicas. Analise custo por setor, médias de diárias e
                            performance de staff com dados limpos e organizados.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- DASHBOARD MOCKUP: O CORAÇÃO DO PLANO --- */}
            <section className="pb-24 px-6">
                <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3rem] p-4 shadow-3xl border border-slate-800">
                    <div className="bg-slate-950 rounded-[2.5rem] overflow-hidden border border-white/5">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="text-slate-500 text-xs font-mono">analytics.freelacerto.com.br</span>
                        </div>
                        <div className="p-10 grid md:grid-cols-4 gap-6">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <p className="text-slate-500 text-xs font-bold uppercase">Custo Total Staff</p>
                                <p className="text-2xl font-black text-white mt-2">R$ 42.850,00</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <p className="text-slate-500 text-xs font-bold uppercase">Eficiência Global</p>
                                <p className="text-2xl font-black text-green-400 mt-2">98.2%</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <p className="text-slate-500 text-xs font-bold uppercase">Escalas Ativas</p>
                                <p className="text-2xl font-black text-indigo-400 mt-2">12</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <p className="text-slate-500 text-xs font-bold uppercase">Freelancers no Posto</p>
                                <p className="text-2xl font-black text-white mt-2">154</p>
                            </div>
                        </div>
                        <div className="px-10 pb-10">
                            <div className="h-64 bg-white/5 rounded-2xl border border-white/10 flex items-end p-6 gap-4">
                                <div className="w-full bg-indigo-500 h-[40%] rounded-t-lg"></div>
                                <div className="w-full bg-indigo-500 h-[70%] rounded-t-lg"></div>
                                <div className="w-full bg-indigo-500 h-[55%] rounded-t-lg"></div>
                                <div className="w-full bg-indigo-600 h-[90%] rounded-t-lg"></div>
                                <div className="w-full bg-indigo-500 h-[30%] rounded-t-lg"></div>
                            </div>
                            <p className="text-center text-slate-500 mt-4 text-xs font-bold">Distribuição de Custo por Setor (Bar, Portaria, Produção, Limpeza)</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FEATURES EXCLUSIVAS DO BUSINESS --- */}
            <section className="py-24 bg-indigo-600 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black leading-tight">
                                Você não está comprando um software. <br /> Está comprando tempo.
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0"><FileCheck size={20} /></div>
                                    <div>
                                        <h4 className="font-black text-xl italic underline decoration-indigo-400">Contratos Automáticos em Word</h4>
                                        <p className="text-indigo-100 opacity-80">Gere contratos jurídicos de prestação de serviço com um clique.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Users size={20} /></div>
                                    <div>
                                        <h4 className="font-black text-xl italic underline decoration-indigo-400">Moderação de Elite</h4>
                                        <p className="text-indigo-100 opacity-80">Acesso a perfis verificados e com histórico de performance positiva.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Download size={20} /></div>
                                    <div>
                                        <h4 className="font-black text-xl italic underline decoration-indigo-400">Exportação Full BI</h4>
                                        <p className="text-indigo-100 opacity-80">Dados brutos preparados para Power BI, Tableau ou seu Excel customizado.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 p-10 rounded-[3rem] border border-white/20 backdrop-blur-md">
                            <h3 className="text-2xl font-black mb-6">Assinatura Business</h3>
                            <div className="space-y-4 mb-8">
                                {["Eventos Ilimitados", "Relatórios Financeiros", "Suporte VIP", "Gestão de Equipe Ativa"].map((item) => (
                                    <div key={item} className="flex items-center gap-2">
                                        <CheckCircle size={18} className="text-green-400" />
                                        <span className="font-bold">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-5xl font-black">R$ 347</span>
                                <span className="text-indigo-200">/mês</span>
                            </div>
                            <button className="w-full bg-white text-indigo-600 py-5 rounded-2xl font-black text-xl hover:bg-indigo-50 transition-colors">
                                COMEÇAR AGORA
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER CTA --- */}
            <section className="py-24 text-center">
                <Lock size={40} className="mx-auto text-slate-200 mb-6" />
                <h2 className="text-3xl font-black mb-4">Sua operação em boas mãos.</h2>
                <p className="text-slate-500 mb-10 max-w-md mx-auto">
                    Migre do plano Start para o Business e sinta a diferença de gerir dados, não apenas pessoas.
                </p>
                <div className="flex justify-center gap-6">
                    <button className="flex items-center gap-2 font-black text-indigo-600 hover:gap-4 transition-all uppercase tracking-widest text-sm">
                        Falar com suporte <MousePointerClick size={16} />
                    </button>
                </div>
            </section>
            <PricingSection />
        </div>
    );
}