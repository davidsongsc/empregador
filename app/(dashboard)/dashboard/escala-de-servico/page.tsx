'use client';
import { useEffect, useState } from 'react';
import { useEventStore } from '@/store/useEventStore';
import { CreateEventModal } from '@/components/Events/Create';
import { Terminal, Plus, FolderOpen, Activity, Search } from 'lucide-react';
import Link from 'next/link';

export default function EventsListPage() {
  const { events, fetchEvents, loading, loadFromStorage } = useEventStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. Tenta carregar do IndexedDB primeiro (Zero Latency)
    loadFromStorage();
    // 2. Sincroniza com o Mainframe (SWR)
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-delos-black p-8 font-mono">
      {/* TOOLBAR SUPERIOR: Estilo Terminal Admin */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex justify-between items-end border-b border-delos-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-delos-amber mb-2">
              <Terminal size={16} className="animate-pulse" />
              <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Mainframe.Events_Index</span>
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
              Freela<span className="text-delos-amber">Certo</span>
            </h1>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-delos-amber text-delos-black px-6 py-3 font-bold text-xs hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
          >
            <Plus size={16} /> INITIALIZE_NEW_EVENT
          </button>
        </div>

        {/* FILTROS RÁPIDOS (Baseado no list_filter do Admin) */}
        <div className="flex gap-4 mt-6">
            <div className="flex-1 bg-delos-surface border border-delos-border flex items-center px-4 py-2 gap-3 group focus-within:border-delos-amber transition-all">
                <Search size={14} className="text-delos-grey" />
                <input 
                    placeholder="SEARCH_BY_NAME_OR_COMPANY..." 
                    className="bg-transparent text-xs text-delos-indigo outline-none w-full uppercase placeholder:text-delos-grey/30"
                />
            </div>
            <div className="px-4 py-2 border border-delos-border text-[10px] text-delos-grey flex items-center gap-2 uppercase">
                <Activity size={12} className="text-delos-indigo" />
                Sincronia: {loading ? 'UPDATING...' : 'STABLE'}
            </div>
        </div>
      </div>

      {/* GRID DE EVENTOS: O list_display do Frontend */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link key={event.uid} href={`/dashboard/escala-de-servico/${event.uid}`}>
            <div className="bg-delos-surface border border-delos-border p-6 hover:border-delos-indigo transition-all relative group cursor-pointer overflow-hidden">
                {/* Overlay de efeito scan */}
                <div className="absolute inset-0 bg-gradient-to-b from-delos-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] text-delos-grey uppercase tracking-widest">
                        {event.owner_company_name || 'PRIVATE_CLIENT'}
                    </span>
                    <FolderOpen size={16} className="text-delos-grey group-hover:text-delos-indigo" />
                </div>

                <h2 className="text-xl font-bold text-white mb-6 group-hover:translate-x-1 transition-transform uppercase">
                    {event.name}
                </h2>

                <div className="flex justify-between items-center border-t border-delos-border/50 pt-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-delos-grey uppercase">Schedules</span>
                        {/* Como usamos o Serializer com IDs, contamos o tamanho da lista */}
                        <span className="text-sm font-bold text-delos-amber">
                            {event.schedules?.length || 0} NODES
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] text-delos-grey uppercase">Created_At</span>
                        <span className="text-[10px] block text-white/60">
                            {new Date(event.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
          </Link>
        ))}
      </main>

      {isModalOpen && <CreateEventModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}