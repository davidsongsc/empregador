"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useCorporateApplications } from "@/hooks/useCorporateApplications";
import { updateApplicationStatus } from "@/services/jobService";
import {
  User, Phone, ChevronLeft, Loader2, MapPin, Lock, Mail,
  FileText, History, Search, ArrowRight, Zap, X,
  CheckCircle2, Ban, MoreHorizontal, Calendar, Info,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/components/Notification";
import { GROUPED_STATUS, STATUS_CONFIG } from "@/data/statusLabels";
import { CandidateFilters } from "@/components/Candidate/Filters";
import { CandidateDrawer } from "@/components/Candidate/Drawer";
import { CandidateList } from "@/components/Candidate/List";
import { FooterHUD } from "@/components/Footer/System";
import { Application } from "@/interfaces/aplications";
import { checkModuleAccess } from "@/utils/hasRecruitmentPermission";

const FLOW_SEQUENCE = [
  'applied', 'screening', 'reviewing', 'shortlisted',
  'interview_scheduled', 'interviewing', 'technical_test',
  'test_submitted', 'test_review', 'offer_sent', 'hired'
];

export default function CandidatosPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const { user, } = useAuthStore();
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  // Estados de Filtro e UI
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isUpdating, setIsUpdating] = useState(false); // Adicione este estado no topo do componente
  // Hook Corporativo Original
  const { candidatos, total, loading, updateStatus } = useCorporateApplications({
    jobId: jobId,
    status: filterStatus === "all" ? undefined : filterStatus,
    page: page,
    pageSize: 10
  });

  // Filtro de busca local (nome)
  const filteredCandidatos = useMemo(() => {
    return candidatos.filter(app =>
      app.candidate_details?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidatos, searchTerm]);


  const handleNextStep = async (app: any) => {
    // 1. Bloqueio imediato se já estiver carregando
    if (isUpdating) return;

    const currentIndex = FLOW_SEQUENCE.indexOf(app.status);

    if (currentIndex !== -1 && currentIndex < FLOW_SEQUENCE.length - 1) {
      const nextStatus = FLOW_SEQUENCE[currentIndex + 1];

      setIsUpdating(true); // 2. Inicia o estado de bloqueio

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
        setIsUpdating(false); // 3. Libera o botão independente do resultado
      }
    }
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    if (isUpdating) return; // Bloqueio preventivo

    setIsUpdating(true); // Ativa o lock
    try {
      // Chamas a API
      await updateApplicationStatus(appId, newStatus);

      // Atualiza o estado local (supondo que updateStatus venha de um hook ou prop)
      updateStatus(appId, newStatus);

      // Feedback de sistema - Usando o label do config com fallback
      const statusLabel = STATUS_CONFIG[newStatus]?.label || newStatus;
      toast.success(`Protocolo reescrito para: ${statusLabel}`);

      // Atualiza o objeto selecionado se ele for o que está sendo editado
      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }

      setIsChangingStatus(false); // Fecha o menu após sucesso
    } catch (err) {
      toast.error("Erro na reescrita de dados do Host");
      console.error(err);
    } finally {
      setIsUpdating(false); // Libera o lock
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
    <div className="min-h-screen bg-[#080808] text-slate-400 font-sans overflow-x-hidden pb-20 selection:bg-amber-500/30">

      {/* HEADER DINÂMICO DELOS */}
      <CandidateFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        total={total}
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

      {/* DRAWER LATERAL: PAINEL DE CONTROLE DE HOST */}


      <FooterHUD />
    </div>
  );
}