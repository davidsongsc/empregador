import { WifiOff, Printer, ShieldCheck, Smartphone } from "lucide-react";

export default function SegurancaPage() {
  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-900 text-white rounded-[3rem] my-10">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
            <WifiOff size={16} />
            <span className="text-xs font-bold uppercase">Tecnologia Anti-Caos</span>
          </div>
          
          <h1 className="text-4xl font-black leading-tight">
            A internet caiu? <br/>O show não pode parar.
          </h1>
          
          <p className="text-gray-400 text-lg">
            Em grandes eventos, a conexão falha. É por isso que o nosso sistema trata o Excel não apenas como um arquivo, mas como seu <strong>Plano de Contingência</strong>.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <Printer className="text-indigo-400 mb-2" />
              <h4 className="font-bold">Lista Impressa</h4>
              <p className="text-xs text-gray-500">PDFs prontos para impressão em um clique.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <Smartphone className="text-green-400 mb-2" />
              <h4 className="font-bold">Cópia Local</h4>
              <p className="text-xs text-gray-500">Tenha a lista de presença no seu celular para uso offline.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-[100px] opacity-20"></div>
          <div className="relative bg-gray-800 border border-white/10 p-6 rounded-3xl shadow-2xl">
            <ShieldCheck size={40} className="text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold italic">"O Excel é o seguro de vida do produtor."</h3>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
              Exporte todos os contatos da Staff, funções e horários. Se o servidor sair do ar ou o sinal de 4G sumir no meio do festival, sua equipe ainda sabe exatamente quem deve entrar em cada portão.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}