"use client";

import Link from 'next/link';
import { Search, MapPin, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';

export default function NotFound() {
    return (
        <>
            <Header />

            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-8">
                    {/* Ilustração ou Ícone Grande */}
                    <div className="relative inline-block">
                        <div className="w-32 h-32 bg-indigo-50 rounded-[40px] flex items-center justify-center mx-auto rotate-6">
                            <Search className="w-12 h-12 text-indigo-600 -rotate-6" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                            ?
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-6xl font-black text-gray-900">404</h1>
                        <h2 className="text-2xl font-black text-gray-900">Vaga não encontrada</h2>
                        <p className="text-gray-500 font-medium">
                            Parece que essa oportunidade já foi preenchida ou o link está incorreto.
                        </p>
                    </div>

                    <div className="pt-4 space-y-3">
                        <Link
                            href="/"
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100"
                        >
                            <ArrowLeft className="w-5 h-5" /> Voltar para o Início
                        </Link>

                        <Link
                            href="/vagas"
                            className="w-full bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
                        >
                            Explorar outras categorias
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}