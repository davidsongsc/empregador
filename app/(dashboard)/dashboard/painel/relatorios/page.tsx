import { BarChart3, MousePointerClick, Table2, Layers } from "lucide-react";

export default function RelatoriosPage() {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-16">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-black text-slate-900">Relatórios sem limites. Literalmente.</h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Nós entregamos os dados limpos. Você entrega a inteligência. Esqueça relatórios engessados que não mostram o que você precisa.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: <Table2 className="text-blue-500" />,
            title: "Tabelas Dinâmicas",
            desc: "Agrupe custos por setor, por dia ou por fornecedor em segundos dentro do Excel."
          },
          {
            icon: <BarChart3 className="text-purple-500" />,
            title: "Gráficos Personalizados",
            desc: "Crie a visualização que o seu Board exige sem precisar pedir novo desenvolvimento para nossa TI."
          },
          {
            icon: <Layers className="text-orange-500" />,
            title: "Cruzamento de Meses",
            desc: "Compare o desempenho do Staff de janeiro com dezembro e descubra onde está sua maior margem."
          }
        ].map((feature, i) => (
          <div key={i} className="p-8 bg-slate-50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100">
            <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-indigo-600 rounded-[2rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Precisa de um dado específico?</h2>
          <p className="text-indigo-100 opacity-80">Se está no sistema, está no seu Excel. Simples assim.</p>
        </div>
        <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-transform flex items-center gap-2">
          <MousePointerClick size={20} />
          Começar Agora
        </button>
      </div>
    </div>
  );
}