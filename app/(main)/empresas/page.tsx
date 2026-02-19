"use client";

import { Building2, Users, MapPin, Star, ArrowUpRight, Search } from 'lucide-react';

const EmpresasPage = () => {
  const empresas = [
    { id: 1, nome: "TechSoluções", setor: "Tecnologia", vagas: 12, rating: 4.8, local: "São Paulo, SP" },
    { id: 2, nome: "ModaVibe Retail", setor: "Varejo", vagas: 5, rating: 4.2, local: "Rio de Janeiro, RJ" },
    { id: 3, nome: "LogiTrans S.A.", setor: "Logística", vagas: 28, rating: 4.5, local: "Curitiba, PR" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Seccional */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-xl">
            <h1 className="text-4xl font-black text-gray-900 mb-4">Empresas que estão <span className="text-indigo-600">contratando</span></h1>
            <p className="text-gray-500 font-medium">Conheça o ambiente de trabalho e as oportunidades nas maiores empresas da região.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100">Sou Recrutador</button>
          </div>
        </div>

        {/* Grid de Empresas */}
        <div className="grid md:grid-cols-3 gap-6">
          {empresas.map((emp) => (
            <div key={emp.id} className="bg-white p-8 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors">
                <Building2 className="text-gray-400 group-hover:text-indigo-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{emp.nome}</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-4">{emp.setor}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-300" /> {emp.local}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {emp.rating} <span className="text-gray-300">(Review Funcionários)</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                Ver {emp.vagas} vagas <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmpresasPage;