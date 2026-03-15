'use client';
import { useEffect, useState, use } from 'react'; // Importe 'use'
import { useEventStore } from '@/store/useEventStore';
import { Terminal, Plus } from 'lucide-react';
import { ScheduleCard } from '@/components/Events/ScheduleCard';
import { CreateScheduleForm } from '@/components/Events/CreateScheduleForm';

// Tipagem correta para Next.js 15+
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventAdminPage({ params }: PageProps) {
  // 1. Desempacota o ID da Promise do Next.js
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const { events, fetchEvents, loading } = useEventStore();
  const [showForm, setShowForm] = useState(false);

  // 2. Localizamos o evento ativo usando o ID resolvido
  const activeEvent = events.find((e: any) => e.uid === eventId);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading && !activeEvent) {
    return <div className="text-delos-amber p-10 font-mono animate-pulse">CONNECTING_TO_MAINFRAME...</div>;
  }

  return (
    <div className="min-h-screen bg-delos-black p-6 font-mono text-delos-grey">
      <header className="border-b border-delos-border pb-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="text-delos-amber" size={20} />
          <span className="text-delos-amber text-xs tracking-widest uppercase">Root_Event_Admin</span>
        </div>
        <h1 className="text-3xl font-bold text-white uppercase">{activeEvent?.name || 'UNKNOWN_EVENT'}</h1>
        <p className="text-sm opacity-60 mt-2">{activeEvent?.description || 'NO_DESCRIPTION_PROVIDED'}</p>
      </header>

      <section className="space-y-6">
        <div className="flex justify-between items-center border-l-2 border-delos-amber pl-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-tighter">Event_Schedules (Inlines)</h2>
          <button onClick={() => setShowForm(true)} className="bg-delos-amber text-delos-black px-4 py-1 text-xs font-bold hover:bg-white transition-all flex items-center gap-2">
            <Plus size={14} /> ADD_NEW_SCHEDULE
          </button>
        </div>

        <div className="grid gap-4">
          {activeEvent?.schedules?.map((scheduleUid: string) => (
            <ScheduleCard key={scheduleUid} scheduleUid={scheduleUid} />
          ))}
        </div>
      </section>

      {showForm && (
        <CreateScheduleForm
          eventUid={eventId} // Passa o ID correto para o formulário
          onSuccess={() => setShowForm(false)}
        />
      )}
    </div>
  );
}