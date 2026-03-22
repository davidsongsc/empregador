import React from 'react';

const JobCardSkeleton = () => {
  return (
    <div className="bg-delos-surface border border-delos-border rounded-[24px] p-5 space-y-4 animate-pulse flex flex-col justify-between min-h-[280px]">
      <div>
        {/* Badge de Categoria/Tipo e Salário */}
        <div className="flex gap-2 mb-3">
          <div className="w-20 h-3 bg-delos-grey-light dark:bg-delos-grey-dark rounded" />
          <div className="w-16 h-3 bg-delos-success/10 dark:bg-delos-success/5 rounded" />
        </div>

        <div className="space-y-3">
          {/* Título do Cargo (Simulando 2 linhas) */}
          <div className="w-full h-6 bg-delos-grey-light dark:bg-delos-grey-dark rounded-lg" />
          <div className="w-3/4 h-6 bg-delos-grey-light dark:bg-delos-grey-dark rounded-lg opacity-60" />
          
          {/* Info da Empresa (Com toque de Âmbar para simular o ícone) */}
          <div className="flex items-center gap-2 mt-4">
            <div className="w-3.5 h-3.5 bg-delos-amber/20 rounded-sm" />
            <div className="w-32 h-2 bg-delos-grey-light dark:bg-delos-grey-dark rounded" />
          </div>

          {/* Localização */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-delos-grey-light dark:bg-delos-grey-dark rounded-full" />
            <div className="w-24 h-2 bg-delos-grey-light dark:bg-delos-grey-dark rounded opacity-50" />
          </div>
        </div>
      </div>

      {/* Botão de Candidatura */}
      <div className="mt-6 pt-2">
        <div className="w-full h-[46px] bg-delos-black opacity-10 dark:opacity-20 rounded-xl" />
      </div>
    </div>
  );
};

export default JobCardSkeleton;