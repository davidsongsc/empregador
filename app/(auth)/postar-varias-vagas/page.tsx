"use client";

import { useState } from 'react';
import { Rocket, Plus, Trash2, Send, Loader2, Briefcase, MapPin, Building2 } from 'lucide-react';
import { useBulkPost } from '@/hooks/useBulkPost';

const BulkPostPage = () => {
  const { publishJobs, loading } = useBulkPost();
  const [queue, setQueue] = useState<any[]>([]);
  
  // Estado do formulário de entrada rápida
  const [formData, setFormData] = useState({
    cargo: '', empresa: '', local: '', turno: 'Presencial', descricao: ''
  });

  const addToQueue = () => {
    if (!formData.cargo || !formData.descricao) return alert("Cargo e Descrição são obrigatórios!");
    
    // Formata para o padrão do Django (objetos para requisitos/beneficios vazios por enquanto)
    const newJob = {
      ...formData,
      requisitos: [],
      beneficios: [],
      salario: null
    };

    setQueue([...queue, newJob]);
    setFormData({ cargo: '', empresa: '', local: '', turno: 'Presencial', descricao: '' });
  };

  const handleSendAll = async () => {
    const results = await publishJobs(queue);
    alert(`Processo concluído! Sucesso: ${results.success} | Falhas: ${results.failed}`);
    if (results.failed === 0) setQueue([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        
        {/* LADO ESQUERDO: ENTRADA RÁPIDA */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <Plus className="text-indigo-600" /> Adicionar à Fila
            </h2>
            
            <div className="space-y-4">
              <input 
                placeholder="Título do Cargo" 
                value={formData.cargo}
                onChange={e => setFormData({...formData, cargo: e.target.value})}
                className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-indigo-500/20"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Empresa" 
                  value={formData.empresa}
                  onChange={e => setFormData({...formData, empresa: e.target.value})}
                  className="bg-gray-50 p-4 rounded-2xl outline-none"
                />
                <input 
                  placeholder="Local (Cidade)" 
                  value={formData.local}
                  onChange={e => setFormData({...formData, local: e.target.value})}
                  className="bg-gray-50 p-4 rounded-2xl outline-none"
                />
              </div>
              <textarea 
                placeholder="Cole o texto da vaga aqui..." 
                rows={6}
                value={formData.descricao}
                onChange={e => setFormData({...formData, descricao: e.target.value})}
                className="w-full bg-gray-50 p-4 rounded-2xl outline-none resize-none"
              />
              <button 
                onClick={addToQueue}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
              >
                Adicionar à Fila de Postagem
              </button>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: FILA DE PROCESSAMENTO */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-black uppercase tracking-widest text-sm text-gray-400">
              Vagas na Fila ({queue.length})
            </h2>
            {queue.length > 0 && (
              <button 
                onClick={handleSendAll}
                disabled={loading}
                className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-indigo-600 transition-all"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                PUBLICAR TODAS NO SISTEMA
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {queue.length === 0 && (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-[40px] h-64 flex flex-col items-center justify-center text-gray-400">
                <Briefcase className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm font-medium">A fila está vazia</p>
              </div>
            )}
            {queue.map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group">
                <button 
                  onClick={() => setQueue(queue.filter((_, i) => i !== index))}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 leading-tight">{job.cargo}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase">{job.empresa || "Empresa não informada"}</p>
                    <div className="flex gap-4 mt-3">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        <MapPin className="w-3 h-3" /> {job.local}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BulkPostPage;