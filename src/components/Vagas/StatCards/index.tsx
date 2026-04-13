"use client";
import { Briefcase, Zap, Users } from 'lucide-react';
import { useJobStore } from '@/store/useJobStore';
import StatCard from '@/components/Vagas/StatCard';

export function StatCards() {
    // Puxando os dados do Store que já foi inicializado no JobManager ou na Page
    const { total_vagas, total_vagas_freela, total_vagas_efetivo } = useJobStore();

    return (
        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            <StatCard
                icon={<Briefcase size={16} />}
                label="Encontrados"
                value={total_vagas || 0}
            />
            <StatCard
                icon={<Zap size={16} />}
                label="Freelancers"
                value={total_vagas_freela || 0}
                color="amber"
            />
            <StatCard
                icon={<Users size={16} />}
                label="Efetivos_CLT"
                value={total_vagas_efetivo || 0}
                color="indigo"
            />
        </div>
    );
}