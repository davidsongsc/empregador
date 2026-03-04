"use client";
import { useState } from "react";
import PostJobModal from "@/components/Modal/PostJobModal";
import { Plus } from "lucide-react";

export function DashboardHeader({ userName }: { userName: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Olá, {userName}
                </h1>
                <p className="text-slate-500 text-sm mt-1">Acompanhe suas oportunidades.</p>
            </div>

            {/* Botão que abre o modal que criamos */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
            >
                <Plus className="w-4 h-4" /> Postar Vaga
            </button>

            <PostJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}