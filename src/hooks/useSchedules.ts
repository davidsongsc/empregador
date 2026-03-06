"use client";

import { useEffect, useState, useCallback } from "react";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useParams } from "next/navigation";

export function useSchedules() {
    const params = useParams();
    // Captura o ID da escala se estiver na URL (ex: /schedules/[id])
    const scheduleUid = params?.id as string;

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { 
        schedules, 
        count, 
        activeSchedule, 
        loading, 
        error, 
        fetchSchedules, 
        fetchScheduleDetails,
        updateSchedule 
    } = useScheduleStore();

    const loadData = useCallback(async () => {
        if (scheduleUid) {
            await fetchScheduleDetails(scheduleUid);
        } else {
            await fetchSchedules(page, search);
        }
    }, [scheduleUid, page, search, fetchSchedules, fetchScheduleDetails]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        schedules: Array.isArray(schedules) ? schedules : [],
        activeSchedule,
        count,
        loading,
        error,
        page,
        setPage,
        search,
        setSearch,
        totalPages: Math.ceil(count / 10),
        refresh: loadData,
        update: updateSchedule,
        scheduleUid
    };
}