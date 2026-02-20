"use client";

import { useState } from 'react';
import { Rocket, FileText, Loader2, CheckCircle, Trash2, Send } from 'lucide-react';
import { usePostJob } from '@/hooks/usePostJob';

const BulkPostPage = () => {
  const [rawText, setRawText] = useState('');
  const [extractedJobs, setExtractedJobs] = useState<any[]>([]);
  const { postJob, loading } = usePostJob();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleIAProcess = async () => {
    setIsProcessing(true);
    // SIMULAÇÃO: Aqui você chamaria seu agente de IA
    // Em um cenário real, a IA retornaria o objeto abaixo
    setTimeout(() => {
      const mockExtracted = {
        cargo: "Auxiliar de Cozinha",
        empresa: "Buteco da Pedra do Sal",
        local: "Rua Sacadura Cabral 120, Rio de Janeiro",
        descricao: rawText, // Mantemos o texto original para referência
        salario: null,
        turno: "Noite",
        requisitos: [{ description: "Sexo Masculino" }],
        beneficios: [],
        contato_original: "+55 21 98732-5912" // Guardamos o tel internamente
      };
      setExtractedJobs([...extractedJobs, mockExtracted]);
      setRawText('');
      setIsProcessing(false);
    }, 1500);
  };

  const handlePublishAll = async () => {
    for (const job of extractedJobs) {
      await postJob(job);
    }
    setExtractedJobs([]);
    alert("Todas as vagas foram publicadas!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-black text-gray-900">Agente de IA - Captura</h1>
          <p className="text-gray-500 font-medium">Cole mensagens de grupos e deixe a IA estruturar a vaga.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* LADO ESQUERDO: INPUT BRUTO */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-4">Mensagem do Grupo</label>
              <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Cole a mensagem aqui..."
                className="w-full h-80 bg-gray-50 border-none rounded-2xl p-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all resize-none text-sm"
              />
              <button 
                onClick={handleIAProcess}
                disabled={!rawText || isProcessing}
                className="w-full mt-4 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <Rocket className="w-5 h-5" />}
                Processar com IA
              </button>
            </div>
          </div>

          {/* LADO DIREITO: VAGAS ESTRUTURADAS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-black text-gray-900 uppercase text-sm tracking-widest">Prontas para publicar ({extractedJobs.length})</h2>
              {extractedJobs.length > 0 && (
                <button 
                  onClick={handlePublishAll}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-full text-xs font-black hover:bg-green-700 flex items-center gap-2"
                >
                  <Send className="w-3 h-3" /> PUBLICAR TUDO
                </button>
              )}
            </div>

            <div className="space-y-3 h-[500px] overflow-y-auto pr-2">
              {extractedJobs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-[32px]">
                  <FileText className="w-12 h-12 mb-2 opacity-20" />
                  <p className="font-bold text-sm">Nenhuma vaga processada</p>
                </div>
              )}
              {extractedJobs.map((job, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm relative group animate-in slide-in-from-right duration-300">
                  <button 
                    onClick={() => setExtractedJobs(extractedJobs.filter((_, idx) => idx !== i))}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h3 className="font-black text-indigo-600 text-lg leading-tight">{job.cargo}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase">{job.empresa}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-bold">📍 {job.local}</span>
                    <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-bold">🕒 {job.turno}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BulkPostPage;