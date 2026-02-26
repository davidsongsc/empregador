"use client";

import { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle, Smartphone, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { forgotPassword } from '@/services/auth';

const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Formata o número se necessário antes de enviar
      await forgotPassword(identifier);
      setSuccess(true);
    } catch (err: any) {
      setError(err.detail || "Não encontramos uma conta com este número.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[48px] shadow-2xl shadow-gray-200/50 text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Verifique seu WhatsApp</h2>
          <p className="text-gray-500 font-medium">
            Enviamos as instruções de recuperação para o número <span className="text-indigo-600 font-bold">{identifier}</span>.
          </p>
          <Link href="/login" className="block w-full py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
            Voltar para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        
        <div className="text-center space-y-4">
          <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Voltar ao acesso
          </Link>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Recuperar <br/> Senha</h1>
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[48px] border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Instruções rápidas</span>
            </div>
            <p className="text-sm text-gray-400 font-medium">
              Informe o número de WhatsApp cadastrado para receber um link de redefinição.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">WhatsApp</label>
              <div className="relative">
                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  required
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 font-bold outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                />
              </div>
              {error && (
                <p className="text-[10px] font-black text-red-500 uppercase px-1">{error}</p>
              )}
            </div>

            <button
              disabled={loading || !identifier}
              className="w-full bg-gray-900 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 active:scale-95 transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Link"}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
          Problemas técnicos? <a href="#" className="text-indigo-600">Suporte</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;