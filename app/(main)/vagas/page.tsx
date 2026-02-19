"use client";

import { useState } from 'react';
import { 
  Search, Filter, Laptop, Utensils, Car, Stethoscope, 
  ChevronRight, Building2, Wallet, Briefcase, X 
} from 'lucide-react';

const VagasPage = () => {
  const [search, setSearch] = useState("");
  
  // Mock de Categorias e Subcategorias
  const categories = [
    { 
      id: 1, 
      name: "Tecnologia", 
      icon: <Laptop className="w-6 h-6" />, 
      count: 124, 
      subs: ["Frontend", "Backend", "Mobile", "Dados"] 
    },
    { 
      id: 2, 
      name: "Gastronomia", 
      icon: <Utensils className="w-6 h-6" />, 
      count: 85, 
      subs: ["Cozinheiro", "Garçom", "Confeiteiro"] 
    },
    { 
      id: 3, 
      name: "Logística", 
      icon: <Car className="w-6 h-6" />, 
      count: 210, 
      subs: ["Motorista", "Estoquista", "Expedição"] 
    },
    { 
      id: 4, 
      name: "Saúde", 
      icon: <Stethoscope className="w-6 h-6" />, 
      count: 56, 
      subs: ["Enfermagem", "Fisioterapia", "Recepcionista"] 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER DA PÁGINA --- */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Explorar Categorias</h1>
            <p className="text-gray-500 font-medium">Encontre a vaga certa filtrando por sua área de especialidade.</p>
          </div>
          
          {/* BARRA DE PESQUISA RÁPIDA */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Pesquisar categoria ou cargo..."
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* --- SIDEBAR DE FILTROS (Desktop) --- */}
          <aside className="hidden lg:col-span-3 lg:block space-y-8">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 font-bold text-gray-900 border-b border-gray-50 pb-4">
                <Filter className="w-4 h-4 text-indigo-600" /> Filtros Avançados
              </div>

              {/* Filtro de Salário */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Pretensão Salarial</label>
                <div className="space-y-2 text-sm font-medium text-gray-600">
                  {['Até R$ 2.000', 'R$ 2.000 - R$ 5.000', 'R$ 5.000+'].map(f => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /> {f}
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtro de Empresa */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tipo de Empresa</label>
                <div className="space-y-2 text-sm font-medium text-gray-600">
                  {['Multinacional', 'Startup', 'Pequena/Média'].map(f => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /> {f}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Banner Auxiliar */}
            <div className="bg-indigo-600 rounded-[32px] p-6 text-white">
              <h4 className="font-bold mb-2">Não achou o que procurava?</h4>
              <p className="text-sm text-indigo-100 mb-4 opacity-80">Cadastre seu currículo e deixe as empresas te encontrarem.</p>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition">Cadastrar Currículo</button>
            </div>
          </aside>

          {/* --- GRID DE CATEGORIAS (Main Content) --- */}
          <main className="lg:col-span-9 grid md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="bg-white p-8 rounded-[40px] border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    {cat.count} vagas
                  </span>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>

                <div className="flex flex-wrap gap-2 mb-6">
                  {cat.subs.map(sub => (
                    <span key={sub} className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition">
                      {sub}
                    </span>
                  ))}
                </div>

                <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:translate-x-2 transition-transform">
                  Ver todas as vagas <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </main>
        </div>

      </div>
    </div>
  );
};

export default VagasPage;