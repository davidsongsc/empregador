import { api } from "@/lib/api";

const DELTA_HEADERS = {
  "X-Protocol-Mode": "DELTA_SYNC",
  "X-Sync-Policy": "STALE_WHILE_REVALIDATE",
};

export const eventService = {
  // --- EVENTOS ---
  getEvents: async () => {
    return await api("/eventos/events/", {
      method: "GET",
      headers: DELTA_HEADERS,
    });
  },

  getEventDetails: async (uid: string) => {
    return await api(`/eventos/events/${uid}/`, {
      method: "GET",
      headers: DELTA_HEADERS,
    });
  },

  // --- ESCALAS (SCHEDULES) ---
  getScheduleDetails: async (uid: string) => {
    return await api(`/eventos/schedules/${uid}/`, {
      method: "GET",
      headers: DELTA_HEADERS,
    });
  },

  updateSchedule: async (uid: string, data: Partial<any>) => {
    return await api(`/eventos/schedules/${uid}/`, {
      method: "PATCH",
      headers: { ...DELTA_HEADERS, "X-Delta-Target": "SCHEDULE_UPDATE" },
      body: JSON.stringify(data),
    });
  },

  publishSchedule: async (uid: string) => {
    return await api(`/eventos/schedules/${uid}/publish/`, {
      method: "POST",
      headers: DELTA_HEADERS,
    });
  },

  // --- REQUISITOS (STAFF REQUIREMENTS) ---
  updateRequirement: async (uid: string, data: Partial<any>) => {
    return await api(`/eventos/requirements/${uid}/`, {
      method: "PATCH",
      headers: { ...DELTA_HEADERS, "X-Delta-Target": "REQUIREMENT_UPDATE" },
      body: JSON.stringify(data),
    });
  },

  // --- ALOCAÇÕES (ASSIGNMENTS) ---
  updateAssignment: async (uid: string, data: Partial<any>) => {
    return await api(`/eventos/assignments/${uid}/`, {
      method: "PATCH",
      headers: { ...DELTA_HEADERS, "X-Delta-Target": "ASSIGNMENT_UPDATE" },
      body: JSON.stringify(data),
    });
  },

  createEvent: async (data: { name: string; description?: string }) => {
    return await api("/eventos/events/", {
      method: "POST",
      headers: {
        ...DELTA_HEADERS,
        "X-Delta-Action": "CREATE_ROOT"
      },
      body: JSON.stringify(data),
    });
  },
  createSchedule: async (data: { event: string; chamada: string; start_time: string; end_time: string }) => {
    return await api("/eventos/schedules/", {
      method: "POST",
      headers: DELTA_HEADERS,
      body: JSON.stringify(data),
    });
  },
};

