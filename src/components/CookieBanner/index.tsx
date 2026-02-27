"use client";

import { useConsentStore } from "@/store/useConsentStore";
import { useEffect, useState } from "react";

const CookieBanner = () => {
    const { hasAccepted, setConsent } = useConsentStore();
    const [mounted, setMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted || hasAccepted !== null) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
                
                {/* Área do Texto com funcionalidade de expandir */}
                <div 
                    className="flex-1 cursor-pointer group" 
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <p className={`text-sm text-gray-600 leading-relaxed transition-all duration-300 ${!isExpanded ? "line-clamp-2 md:line-clamp-1" : ""}`}>
                        Utilizamos cookies e tecnologias semelhantes para garantir o funcionamento adequado da página e aprimorar sua experiência de navegação.
                        
                        {isExpanded && (
                            <span className="block mt-2 animate-in fade-in slide-in-from-bottom-1">
                                O tratamento dos dados é realizado em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD), respeitando os princípios de transparência, necessidade e segurança.
                                <br /><br />
                                Ao continuar navegando, você declara estar ciente e concorda com nossa Política de Privacidade e com o uso dessas tecnologias.
                            </span>
                        )}
                    </p>
                    
                    {!isExpanded && (
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider group-hover:underline">
                            Clique para ler mais...
                        </span>
                    )}
                </div>

                {/* Botões - Mantendo sua lógica original */}
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setConsent(false);
                        }}
                        disabled
                        className="text-sm px-4 py-2 text-gray-500 hover:text-gray-700 font-medium cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 disabled:bg-gray-100 transition-colors"
                    >
                        Recusar
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setConsent(true);
                        }}
                        className="text-sm px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer font-medium hover:shadow-lg active:scale-95"
                    >
                        Aceitar Cookies
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;