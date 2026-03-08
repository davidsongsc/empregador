import { FileSpreadsheet, Zap, CheckCircle2, banknote } from "lucide-react";

export default function FinanceiroPage() {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12">
      <header className="text-center space-y-4">
        <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm">Operação Eficiente</h2>
        <h1 className="text-4xl font-black text-gray-900">O fim da digitação manual de PIX.</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Sabemos que o financeiro é o coração do evento. Por isso, criamos o fluxo perfeito para quem paga as contas.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-2xl">
            <h3 className="text-green-800 font-bold flex items-center gap-2">
              <Zap size={20} /> Pagamento em Lote
            </h3>
            <p className="text-green-700 mt-2">
              Gere arquivos <strong>.CSV</strong> ou <strong>.XLSX</strong> configurados para o layout dos principais bancos. 
              Pague 50, 100 ou 500 diárias em segundos.
            </p>
          </div>
          
          <ul className="space-y-3">
            {["Nome Completo", "CPF/CNPJ", "Chave Pix", "Valor Líquido"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="text-indigo-500" size={18} />
                <span>Exportação automática de <strong>{item}</strong></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-center space-y-4">
            <FileSpreadsheet size={48} className="mx-auto text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Exemplo de arquivo gerado:</p>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden text-[10px] text-left">
              <div className="bg-gray-100 p-2 border-b grid grid-cols-4 font-bold">
                <span>FAVORECIDO</span><span>DOC</span><span>CHAVE_PIX</span><span>VALOR</span>
              </div>
              <div className="p-2 grid grid-cols-4 border-b text-gray-400">
                <span>João Silva</span><span>123...</span><span>joao@pix.com</span><span>R$ 180,00</span>
              </div>
              <div className="p-2 grid grid-cols-4 text-gray-400">
                <span>Maria Luz</span><span>456...</span><span>044.233...</span><span>R$ 220,00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}