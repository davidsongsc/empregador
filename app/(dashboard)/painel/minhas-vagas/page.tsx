"use client"
import React from "react"
import {
    Plus, Users, MapPin, Edit3, Trash2, Search, Filter, Loader2, AlertCircle
} from "lucide-react"
import { useMyJobs } from "@/hooks/useMyJobs"
import { useAuthStore } from "@/store/useAuthStore"
import Link from "next/link"

const MinhasVagas = () => {
    const { user } = useAuthStore()

    // 1. Integrando o Hook (filtramos pelo ID do usuário logado)
    const { vagas, loading, error, refresh } = useMyJobs({
        usuario: user?.id
    })

    return (
        <div className="min-h-screen bg-[#F8F9FC] pb-20">
            {/* HEADER DA PÁGINA */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                                Gerenciar Vagas
                            </h1>
                            <p className="text-sm text-gray-500 font-medium">
                                {loading ? "Carregando..." : `Você possui ${vagas.length} vagas publicadas.`}
                            </p>
                        </div>
                        <Link
                            href="/anunciar"
                            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Publicar Nova Vaga
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* FILTROS E BUSCA */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por cargo..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <Filter className="w-4 h-4" />
                        Filtros
                    </button>
                </div>

                {/* ESTADO DE ERRO */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                        <button onClick={refresh} className="ml-auto text-xs font-bold underline">Tentar novamente</button>
                    </div>
                )}

                {/* LISTA DE VAGAS / LOADING */}
                <div className="grid gap-4">
                    {loading ? (
                        // Skeleton ou Loader simples
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                            <p className="text-sm text-gray-500 mt-4 font-medium">Buscando suas vagas...</p>
                        </div>
                    ) : (
                        vagas.map((vaga) => (
                            <div
                                key={vaga.uid} // Usando uid da API como key
                                className="group bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                                                {vaga.tipo_vaga_display}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium italic">
                                                {vaga.role_details.category}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {vaga.cargo_exibicao}
                                        </h2>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 opacity-40" />
                                                {vaga.turno}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-indigo-600">
                                                <Users className="w-4 h-4 opacity-40" />
                                                {/* Se a API não retornar candidatos_count, você pode fixar 0 por enquanto */}
                                                {vaga.candidatos_count || 0} candidaturas
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                                        <Link
                                            href={`/painel/vagas/${vaga.uid}/candidatos`}
                                            
                                        >
                                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-100 transition-all cursor-pointer">
                                                Ver Candidatos
                                            </button>
                                        </Link>
                                        <div className="flex gap-2">
                                            <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all border border-gray-50">
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-50">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* EMPTY STATE */}
                {!loading && vagas.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Nenhuma vaga criada</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                            Comece agora publicando sua primeira oportunidade no mercado.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}

export default MinhasVagas