"use client";

import Link from 'next/link';
import { ShieldAlert, Lock, ArrowRight, Smartphone } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm text-center space-y-8">
        
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
          <Lock className="w-10 h-10 text-red-500" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            <ShieldAlert className="w-3 h-3" /> Acesso Restrito
          </div>
          <h1 className="text-3xl font-black text-gray-900">Área Exclusiva</h1>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            Para publicar vagas ou gerenciar candidaturas, você precisa estar conectado com seu WhatsApp.
          </p>
        </div>

        <div className="grid gap-4 pt-4">
          <Link 
            href="/login" 
            className="bg-indigo-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200"
          >
            Entrar com WhatsApp <Smartphone className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-50">
            <Link href="/" className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition">
              Início
            </Link>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <Link href="/ajuda" className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition">
              Suporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}