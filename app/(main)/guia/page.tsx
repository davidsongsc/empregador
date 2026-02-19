"use client";

import {
    BookOpen,
    CheckCircle2,
    Target,
    Users,
    Zap,
    ShieldCheck,
    MessageSquare,
    ArrowRight,
    Lightbulb,
    MousePointer2
} from 'lucide-react';
import Link from 'next/link';

const GuiaContratacao = () => {
    const passos = [
        {
            id: "01",
            titulo: "Defina o Perfil Ideal",
            desc: "Liste as competências técnicas e comportamentais essenciais. Saiba quem você procura antes de anunciar.",
            icon: <Target className="w-6 h-6" />,
            cor: "bg-orange-50 text-orange-600"
        },
        {
            id: "02",
            titulo: "Anúncio Atraente",
            desc: "Vagas com salários visíveis e benefícios claros recebem até 40% mais inscritos qualificados.",
            icon: <Zap className="w-6 h-6" />,
            cor: "bg-indigo-50 text-indigo-600"
        },
        {
            id: "03",
            titulo: "Triagem Inteligente",
            desc: "Use nossa plataforma para filtrar candidatos. Foque apenas nos perfis que realmente importam.",
            icon: <ShieldCheck className="w-6 h-6" />,
            cor: "bg-green-50 text-green-600"
        },
        {
            id: "04",
            titulo: "Entrevista Eficaz",
            desc: "Prepare perguntas situacionais. Foque em como o candidato resolveu problemas no passado.",
            icon: <MessageSquare className="w-6 h-6" />,
            cor: "bg-blue-50 text-blue-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto space-y-20">

                {/* --- HERO SECTION --- */}
                <section className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-gray-100 text-indigo-600">
                            <BookOpen className="w-3 h-3" /> Manual do Recrutador
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1]">
                            Contrate o <span className="text-indigo-600">talento certo</span> sem estresse.
                        </h1>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-lg">
                            Um guia prático e moderno para transformar seu processo seletivo em uma máquina de encontrar profissionais incríveis.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link href="/anunciar" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 flex items-center gap-2 group">
                                Começar a Anunciar <MousePointer2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-[40px] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                        <div className="absolute -top-10 -right-10 p-8 opacity-10">
                            <Users className="w-64 h-64" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-2xl font-black">Dica de Especialista:</h3>
                            <p className="text-indigo-50 font-medium text-xl leading-relaxed italic">
                                "Contrate pelo caráter, treine a habilidade. No longo prazo, a cultura da empresa vale mais que um currículo tecnicamente perfeito."
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-400/50 flex items-center justify-center font-black">AT</div>
                                <div>
                                    <p className="font-bold">Equipe Área do Trabalhador</p>
                                    <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest">Estratégia de Talentos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- TIMELINE DE PASSOS --- */}
                <section className="space-y-16">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">O Caminho para uma Contratação de Sucesso</h2>
                        <div className="h-1.5 w-24 bg-indigo-600 rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {passos.map((passo, index) => (
                            <div key={index} className="relative group">
                                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-start">
                                    <span className="text-4xl font-black text-gray-100 mb-4 group-hover:text-indigo-50 transition-colors">
                                        {passo.id}
                                    </span>
                                    <div className={`w-14 h-14 ${passo.cor} rounded-2xl flex items-center justify-center mb-6`}>
                                        {passo.icon}
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 mb-3">{passo.titulo}</h4>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                        {passo.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- CHECKLIST SECTION --- */}
                <section className="bg-white rounded-[50px] border border-gray-100 p-8 md:p-16 shadow-sm overflow-hidden relative">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-gray-900 leading-tight flex items-center gap-3">
                                    <Lightbulb className="text-orange-500 w-10 h-10" /> Checklist da <br /> Vaga Perfeita
                                </h2>
                                <p className="text-gray-500 font-medium">Garanta que seu anúncio está pronto para atrair os melhores.</p>
                            </div>

                            <ul className="space-y-6">
                                {[
                                    "Título do cargo é direto e profissional",
                                    "O salário está compatível com o mercado",
                                    "Carga horária e turno bem especificados",
                                    "Benefícios listados como diferenciais",
                                    "Canal de triagem (Plataforma) selecionado"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-gray-700 font-bold">
                                        <div className="bg-green-100 p-1 rounded-lg">
                                            <CheckCircle2 className="text-green-600 w-5 h-5" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 flex flex-col justify-center space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900">Pronto para começar?</h3>
                                <p className="text-gray-500 font-medium">
                                    Aplique este guia agora mesmo e veja a diferença na qualidade dos seus candidatos.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <Link href="/anunciar" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-center block hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 text-lg">
                                    Publicar Vaga Agora
                                </Link>
                                <Link href="/planos" className="w-full text-center block py-2 font-black text-sm text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                                    Ver planos profissionais
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default GuiaContratacao;