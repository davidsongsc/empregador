"use client";

import React, { Fragment, useState } from 'react';
import { Briefcase, Clock, ChevronRight, Zap, AlertTriangle, Trash2, MoreVertical } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { STATUS_CONFIG } from '@/data/statusLabels';
import { toast } from '../Notification';
import { useApplicationStore } from '@/store/useApplicationStore';
import { WithdrawalModal } from '@/components/Modal/ConfirmAbortModal';
import { myApplicationService } from '@/services/applications';


const ApplicationItem = ({ cand }: { cand: any }) => {
    // Estados de Controle do Modal Delos
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAborting, setIsAborting] = useState(false);

    const { fetchApplications, removeItem } = useApplicationStore();

    const config = STATUS_CONFIG[cand.status] || {
        label: 'PENDENTE',
        color: 'text-slate-500 border-slate-500/20',
        bg: 'bg-slate-500'
    };

    const handleConfirmWithdraw = async () => {
        setIsAborting(true);
        try {
            await myApplicationService.withdrawApplication(cand.id);
            removeItem(cand.id);

            toast.success("Protocolo de desistência finalizado.");
            setIsModalOpen(false);

            // SYNC: Forçamos o refresh (force=true) e indicamos que são "Minhas Vagas" (isMyApps=true)
            // Isso garante que o Store não bloqueie a chamada por achar que é um duplicata
            await fetchApplications();

        } catch (err: any) {
            toast.error(err.response?.data?.message || "TERMINATION_FAILURE");
        } finally {
            // Garantimos que o estado de salvamento do botão local resete
            setIsAborting(false);
        }
    };

    const handleReport = (applicationId: string) => {
        toast.warning("Iniciando protocolo de denúncia para a Unidade de Recrutamento.");
    };

    return (
        <>
            <div
                style={{
                    backgroundColor: 'rgba(var(--delos-grey), 0.05)',
                    borderColor: 'var(--delos-border)'
                }}
                className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 border transition-all duration-500 hover:bg-[var(--delos-surface)]"
            >
                {/* Indicador de Status Lateral */}
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 opacity-20 group-hover:opacity-100 ${config.bg}`} />

                <div className="flex items-center gap-6 z-10">
                    <div
                        style={{ borderColor: 'var(--delos-border)' }}
                        className="w-14 h-14 bg-black/5 dark:bg-white/5 border flex items-center justify-center text-[var(--delos-amber)] transition-all duration-500 group-hover:border-[var(--delos-amber)]/40"
                    >
                        <Briefcase size={20} strokeWidth={1.5} />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span style={{ color: 'var(--delos-amber)' }} className="text-[8px] font-mono font-bold tracking-[0.2em] opacity-60">
                                Vaga::{cand.id.slice(0, 8).toUpperCase()}
                            </span>
                            <Zap size={8} style={{ color: 'var(--delos-amber)' }} className="animate-pulse" />
                        </div>

                        <h4 style={{ color: 'var(--delos-black)' }} className="font-black text-sm uppercase tracking-widest leading-none italic">
                            {cand.cargo_nome}
                        </h4>

                        <div className="flex items-center gap-3">
                            <p style={{ color: 'var(--delos-indigo)' }} className="text-[10px] font-black uppercase tracking-tighter">
                                {cand.empresa_nome}
                            </p>
                            <div className="flex items-center gap-1 text-[9px] font-mono opacity-40 uppercase" style={{ color: 'var(--delos-black)' }}>
                                <Clock size={10} /> {new Date(cand.created_at).toLocaleDateString('pt-BR')} :: {new Date(cand.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0 relative z-10">
                    <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[7px] font-mono opacity-30 uppercase tracking-[0.3em]" style={{ color: 'var(--delos-black)' }}>
                            Andamento da Vaga
                        </span>
                        <span className={`text-[9px] font-black uppercase px-4 py-1.5 border tracking-[0.2em] transition-all ${config.color} bg-transparent`}>
                            {cand.status_display || config.label}
                        </span>
                    </div>

                    <div className="relative">
                        <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button
                                style={{ borderColor: 'var(--delos-border)', color: 'var(--delos-black)' }}
                                className="w-10 h-10 flex items-center justify-center border hover:bg-[var(--delos-black)] hover:text-[var(--delos-surface)] transition-all duration-300 group-hover:rotate-90 outline-none"
                            >
                                <ChevronRight size={16} />
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="transform opacity-0 scale-95 -translate-y-2"
                                enterTo="transform opacity-100 scale-100 translate-y-0"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 w-56 origin-top-right bg-[var(--delos-surface)] border border-[var(--delos-border)] shadow-2xl focus:outline-none rounded-sm overflow-hidden z-[50]">
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => setIsModalOpen(true)}
                                                    className={`${active ? 'bg-black text-white' : 'text-[var(--delos-black)]'} group flex w-full items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors`}
                                                >
                                                    <Trash2 size={14} className={active ? 'text-[var(--delos-red)]' : 'opacity-100'} />
                                                    Desistir
                                                </button>
                                            )}
                                        </Menu.Item>

                                        <div className="h-[1px] bg-[var(--delos-border)] opacity-20 my-1 mx-2" />

                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => handleReport(cand.id)}
                                                    className={`${active ? 'bg-[var(--delos-red)] text-white' : 'text-[var(--delos-red)]'} group flex w-full items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors`}
                                                >
                                                    <AlertTriangle size={14} />
                                                    Reportar
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>

            {/* Modal Delos Westworld */}
            <WithdrawalModal
                isOpen={isModalOpen}
                onClose={() => !isAborting && setIsModalOpen(false)}
                onConfirm={handleConfirmWithdraw}
                loading={isAborting}
            />
        </>
    );
};

export default ApplicationItem;