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
import { checkLevel } from "@/utils/checkLevel";
import { getActiveMembership } from "@/utils/userHelpers"; // 🔹 Importante
import { Application } from "@/interfaces/iApplication";

export default function CandidatosPage() {
  const params = useParams();
  const jobId = params.id as string;

  // 🔹 Recupera o ID da empresa ativa para o Header x-company-id
  const activeCompanyId = getActiveMembership()?.company_id;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 🔹 Passamos o activeCompanyId para o Hook buscar com o header correto
  const { candidatos, total, loading, updateStatus } = useCorporateApplications({
    status: filterStatus === "all" ? undefined : filterStatus,
    page: page,
    pageSize: 10,
    jobId: jobId,
    companyId: activeCompanyId // 👈 Verifique se seu hook aceita este campo
  });

  const filteredCandidatos = useMemo(() => {
    return candidatos.filter(app => {
      // 1. Filtro rigoroso: Remove HIRED do funil de seleção
      const isHired = app.status === "HIRED" || String(app.status).includes("HIRED");
      if (isHired) return false;

      // 2. Lógica de Busca Híbrida (Nome ou UID)
      const search = searchTerm.toLowerCase();

      // Se tiver nome, busca pelo nome. Se não, busca pelo ID (UID)
      const nameMatch = app.profile?.name?.toLowerCase().includes(search);
      const uidMatch = app.id.toString().toLowerCase().includes(search);

      return nameMatch || uidMatch;
    });
  }, [candidatos, searchTerm]);

  const hasMidAccess = checkLevel("mid");
  const hasHighAccess = checkLevel("high");

  /**
   * AVANÇAR ETAPA (Workflow)
   */
  const handleNextStep = async (app: Application) => {
    if (!hasMidAccess) {
      toast.error("Acesso Negado: Nível de permissão insuficiente.");
      return;
    }

    if (isUpdating || !activeCompanyId) return;

    const currentIndex = FLOW_SEQUENCE.indexOf(app.status);

    if (currentIndex !== -1 && currentIndex < FLOW_SEQUENCE.length - 1) {
      const nextStatus = FLOW_SEQUENCE[currentIndex + 1];
      setIsUpdating(true);

      try {
        // 🔹 Injetamos o activeCompanyId para o header x-company-id
        await updateApplicationStatus(app.id, nextStatus, activeCompanyId);
        updateStatus(app.id, nextStatus);

        toast.success(`Candidato movido para: ${STATUS_CONFIG[nextStatus]?.label}`);

        if (selectedApp?.id === app.id) {
          setSelectedApp({ ...app, status: nextStatus });
        }
      } catch (err) {
        toast.error("Falha ao comunicar com o Host");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  /**
   * MUDANÇA MANUAL DE STATUS
   */
  const handleStatusChange = async (appId: string, newStatus: string) => {
    if (!hasHighAccess) {
      toast.error("Operação restrita a administradores.");
      return;
    }

    if (isUpdating || !activeCompanyId) return;

    setIsUpdating(true);
    try {
      // 🔹 Injetamos o activeCompanyId aqui também
      await updateApplicationStatus(appId, newStatus, activeCompanyId);
      updateStatus(appId, newStatus);

      toast.success("Protocolo de status reescrito.");
      
      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err) {
      toast.error("Erro na atualização manual");
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div className="min-h-screen bg-delos-surface/70 text-slate-400 font-sans pb-20 selection:bg-amber-500/30">
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
        filteredCandidatos={filteredCandidatos}
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