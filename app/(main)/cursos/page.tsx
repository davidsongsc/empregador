"use client";

import { 
  GraduationCap, 
  ExternalLink, 
  BookOpen, 
  CheckCircle, 
  Award, 
  Search,
  ArrowUpRight
} from 'lucide-react';

const CursosGratuitos = () => {
  const instituicoes = [
    {
      nome: "Fundação Bradesco",
      sigla: "EV",
      desc: "Uma das maiores plataformas de cursos online do Brasil, focada em Tecnologia, Gestão e Finanças.",
      destaque: "Certificado Gratuito",
      link: "https://www.ev.org.br/",
      cor: "text-red-600",
      bg: "bg-red-50"
    },
    {
      nome: "FAETEC",
      sigla: "FT",
      desc: "Referência em ensino técnico no RJ, oferece cursos profissionalizantes gratuitos em diversas áreas.",
      destaque: "Cursos Presenciais e Online",
      link: "http://www.faetec.rj.gov.br/",
      cor: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      nome: "SEBRAE",
      sigla: "SB",
      desc: "Excelente para quem busca desenvolver habilidades de empreendedorismo, vendas e gestão de pequenos negócios.",
      destaque: "Foco em Negócios",
      link: "https://www.sebrae.com.br/sites/PortalSebrae/cursosonline",
      cor: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      nome: "Senai (Cursos Transversais)",
      sigla: "SI",
      desc: "Cursos rápidos voltados para a indústria, como Metrologia, Desenho Técnico e Segurança do Trabalho.",
      destaque: "Reconhecido pela Indústria",
      link: "https://www.mundosenai.com.br/cursos/cursos-gratuitos/",
      cor: "text-gray-900",
      bg: "bg-gray-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* --- HEADER --- */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            <Award className="w-4 h-4" /> Capacitação Profissional
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            Invista no seu <span className="text-indigo-600">conhecimento</span> de graça.
          </h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed">
            Selecionamos as melhores instituições que oferecem cursos com certificado sem custo para você turbinar seu currículo.
          </p>
        </section>

        {/* --- GRID DE INSTITUIÇÕES --- */}
        <div className="grid md:grid-cols-2 gap-8">
          {instituicoes.map((inst, i) => (
            <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
              {/* Badge de Destaque */}
              <div className="absolute top-10 right-10">
                <span className="text-[10px] font-black uppercase bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">
                  {inst.destaque}
                </span>
              </div>

              <div className="flex flex-col h-full">
                <div className={`w-16 h-16 ${inst.bg} ${inst.cor} rounded-2xl flex items-center justify-center font-black text-xl mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  {inst.sigla}
                </div>

                <div className="space-y-4 flex-1">
                  <h3 className="text-2xl font-black text-gray-900">{inst.nome}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    {inst.desc}
                  </p>
                </div>

                <div className="pt-10 flex items-center justify-between border-t border-gray-50 mt-10">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Certificado incluso
                  </div>
                  <a 
                    href={inst.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200"
                  >
                    Acessar Cursos <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- SEÇÃO DE DICA EXTRA --- */}
        <section className="bg-indigo-600 rounded-[50px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute -bottom-10 -left-10 opacity-10 rotate-12">
                <BookOpen className="w-64 h-64" />
            </div>
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-black leading-tight">Por que fazer cursos gratuitos?</h2>
                    <ul className="space-y-4">
                        {[
                          "Demonstra proatividade para o recrutador.",
                          "Mantém você atualizado com as novas tecnologias.",
                          "Preenche lacunas de experiência no currículo.",
                          "Aumenta suas chances em processos seletivos em até 35%."
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 font-semibold text-indigo-100">
                                <CheckCircle className="w-5 h-5 text-indigo-300" /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-[40px] border border-white/20 space-y-6">
                    <h4 className="font-black text-xl">Dica da Plataforma</h4>
                    <p className="text-indigo-100 font-medium text-sm leading-relaxed">
                        Após concluir um curso, não esqueça de adicioná-lo à sua **Área do Trabalhador**. Empresas que buscam por habilidades específicas dão prioridade a perfis com certificados recentes!
                    </p>
                    <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all">
                        Atualizar meu Perfil
                    </button>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default CursosGratuitos;