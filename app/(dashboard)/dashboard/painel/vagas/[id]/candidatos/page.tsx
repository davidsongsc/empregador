"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useCorporateApplications } from "@/hooks/useCorporateApplications";
import { updateApplicationStatus } from "@/services/jobService";
import { toast } from "@/components/Notification";
import { FLOW_SEQUENCE, GROUPED_STATUS, STATUS_CONFIG } from "@/data/statusLabels";
import { CandidateFilters } from "@/components/Candidate/Filters";
import { CandidateList } from "@/components/Candidate/List";
import { FooterHUD } from "@/components/Footer/System";
import { Application } from "@/interfaces/aplications";
import { checkLevel } from "@/utils/checkLevel";

export default function CandidatosPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { candidatos, total, loading, updateStatus } = useCorporateApplications({
    status: filterStatus === "all" ? undefined : filterStatus,
    page: page,
    pageSize: 10,
    jobId: jobId
  });

  /**
   * REVISÃO DO FILTRO LOCAL:
   * 1. Removemos candidatos com status 'HIRED' (Contratados)
   * 2. Aplicamos a busca por nome
   */
  const filteredCandidatos = useMemo(() => {
    return candidatos.filter(app => {
      // 1. Condição de Exclusão: Se já foi contratado, sai da visualização de candidatos
      // Certifique-se de que a string "HIRED" bate com o valor do seu backend/enum
      const isHired = app.status === "HIRED" || app.status?.toString().endsWith("HIRED");
      
      if (isHired) return false;

      // 2. Filtro de Busca por nome
      return app.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [candidatos, searchTerm]);

  // Níveis de acesso para operações
  const hasMidAccess = checkLevel("mid");
  const hasHighAccess = checkLevel("high");

  const handleNextStep = async (app: Application) => {
    if (!hasMidAccess) {
      toast.error("Você não possui permissão para avançar o candidato de etapa!");
      return;
    };

    if (isUpdating) return;

    const currentIndex = FLOW_SEQUENCE.indexOf(app.status);

    if (currentIndex !== -1 && currentIndex < FLOW_SEQUENCE.length - 1) {
      const nextStatus = FLOW_SEQUENCE[currentIndex + 1];
      setIsUpdating(true);

      try {
        await updateApplicationStatus(app.id, nextStatus);
        updateStatus(app.id, nextStatus);

        toast.success(`Protocolo Atualizado: ${STATUS_CONFIG[nextStatus].label}`);

        if (selectedApp?.id === app.id) {
          setSelectedApp({ ...app, status: nextStatus });
        }
      } catch (err) {
        toast.error("Falha na atualização de protocolo");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    if (!hasHighAccess) {
      toast.error("Você não possui permissão para alterar o status!");
      return null;
    };
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await updateApplicationStatus(appId, newStatus);
      updateStatus(appId, newStatus);

      const statusLabel = STATUS_CONFIG[newStatus]?.label || newStatus;
      toast.success(`Protocolo reescrito para: ${statusLabel}`);

      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err) {
      toast.error("Erro na reescrita de dados do Host");
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div className="min-h-screen bg-delos-surface/70 text-slate-400 font-sans overflow-x-hidden pb-20 selection:bg-amber-500/30">
      <CandidateFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        total={filteredCandidatos.length}
        loading={loading}
      />

      <CandidateList
        loading={loading}
        isUpdating={isUpdating}
        candidatos={candidatos}
        filteredCandidatos={filteredCandidatos} // Agora utiliza a lista filtrada sem os contratados
        selectedApp={selectedApp}
        setSelectedApp={setSelectedApp}
        STATUS_CONFIG={STATUS_CONFIG}
        GROUPED_STATUS={GROUPED_STATUS}
        total={total}
        page={page}
        setPage={setPage}
        calculateAge={calculateAge}
        handleNextStep={handleNextStep}
        handleStatusChange={handleStatusChange}
      />

      <FooterHUD />
    </div>
  );
}