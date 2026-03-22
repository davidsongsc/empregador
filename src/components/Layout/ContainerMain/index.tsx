import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
    children: ReactNode;
    className?: string;
}

/**
 * Container Utilitário Delos_System
 * Repassa os filhos dentro de uma estrutura com animação de entrada padrão.
 */
const ContainerMain = ({ children, className }: ContainerProps) => {
    return (
        <div className={cn(
            "sm:py-16 max-w-8xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 bg-delos-surface",
            className
        )}>
            {children}
        </div>
    );
};

export default React.memo(ContainerMain);