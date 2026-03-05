"use client";

import { useEffect, useState, useCallback } from "react";
import { useEventStore } from "@/store/useEventStore";
import { useParams } from "next/navigation";

export function useEvents() {
  const params = useParams();
  const eventUid = params?.uid as string;

  // Estados locais para controle de filtros (Search e Pagination)
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Seletores da Store (Zustand)
  const events = useEventStore((s) => s.events);
  const count = useEventStore((s) => s.count);
  const activeEvent = useEventStore((s) => s.activeEvent);
  const loading = useEventStore((s) => s.loading);
  const error = useEventStore((s) => s.error);

  // Ações da Store
  const fetchEvents = useEventStore((s) => s.fetchEvents);
  const fetchEventDetails = useEventStore((s) => s.fetchEventDetails);
  const publish = useEventStore((s) => s.publishSchedule);

  /**
   * Função de carregamento inteligente.
   * Se houver UID na URL, foca no detalhe. Caso contrário, foca na lista.
   */
  const loadData = useCallback(async () => {
    if (eventUid) {
      await fetchEventDetails(eventUid);
    } else {
      await fetchEvents(page, search);
    }
  }, [eventUid, page, search, fetchEvents, fetchEventDetails]);

  // Dispara o fetch sempre que o contexto (UID, Página ou Busca) mudar
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    // Dados (Garantindo que events seja sempre um array para o .map)
    events: Array.isArray(events) ? events : [],
    activeEvent,
    count: count || 0,
    loading,
    error,

    // Filtros e Paginação
    page,
    setPage,
    search,
    setSearch,
    totalPages: Math.ceil((count || 0) / 10), // Baseado no PAGE_SIZE: 10 do Django

    // Ações
    refresh: loadData,
    publish,
    eventUid
  };
}