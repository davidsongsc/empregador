export type StatusSummary = {
  status: string;
  total: number;
};

export type DashboardStats = {
  status_servidor: {
    uptime: string;
    banco_dados: string;
    scope: string;
  };

  totais: {
    vagas: number;
    candidatos: number;
    empresas: number;
    inscricoes: number;
  };

  analytics_periodo: {
    tempo_real_48h: {
      total_acumulado: number;
      hoje: number;
      ontem: number;
      diff: number;
      tendencia: "up" | "down" | "stable";
    };

    semanal: {
      valor: number;
      media_diaria: number;
    };

    mensal: {
      valor: number;
      media_diaria: number;
    };
  };

  crescimento_diario: {
    data: string;
    quantidade: number;
  }[];
};