"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";
import LoginModal from "@/components/Modal/LoginModal";
import { useAuthStore } from "@/store/useAuthStore";
import { Activity, Lock, ShieldAlert } from "lucide-react";

const STORAGE_KEY = "@delos:security_protocol";
const RESET_TIMEOUT = 60 * 60 * 1000; // 60 minutos em ms

function TriggerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // 1. Inicialização: Recupera dados do localStorage ao montar
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { lastAttempt, attemptCount, lockedUntil } = JSON.parse(savedData);
      const now = Date.now();

      // Verifica se já passou 60min para resetar o multiplicador
      if (now - lastAttempt > RESET_TIMEOUT) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      setAttempts(attemptCount);

      // Verifica se ainda deve estar no countdown após o F5
      if (lockedUntil > now) {
        setCountdown(Math.ceil((lockedUntil - now) / 1000));
      }
    }
  }, []);

  // 2. Lógica do Timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // 3. Controle de abertura do Modal
  useEffect(() => {
    const isLoginRequested = searchParams.get("showLogin") === "true";
    if (isLoginRequested && !user && countdown === 0) {
      setIsOpen(true);
    }
  }, [searchParams, user, countdown]);

  // 4. Função ao fechar (O "Castigo")
  const handleClose = useCallback(() => {
    setIsOpen(false);
    
    if (!user) {
      const nextAttempt = attempts + 1;
      const nextDelay = Math.pow(2, nextAttempt - 1);
      const now = Date.now();
      const lockedUntil = now + nextDelay * 1000;

      setAttempts(nextAttempt);
      setCountdown(nextDelay);

      // Salva o estado crítico no LocalStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lastAttempt: now,
        attemptCount: nextAttempt,
        lockedUntil: lockedUntil
      }));

      // Limpa a URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("showLogin");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [user, attempts, searchParams, router, pathname]);

  return (
    <>
      {countdown > 0 && !user && (
        <div className="fixed inset-0 z-[120] bg-black flex flex-col items-center justify-center font-mono text-white p-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-delos-amber/10 via-transparent to-transparent opacity-50" />
          
          <ShieldAlert className="w-16 h-16 text-delos-amber mb-6 animate-pulse" />
          
          <div className="space-y-6 z-10">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-delos-amber">
              Protocolo_De_Contenção
            </h2>
            
            <p className="text-delos-grey text-[10px] uppercase tracking-[0.3em] max-w-sm mx-auto leading-loose">
              Violação de acesso detectada no Host. Bloqueio temporário aplicado para re-sincronização de credenciais.
            </p>
            
            <div className="text-6xl font-black italic tracking-tighter tabular-nums text-white">
              {countdown}<span className="text-delos-amber text-2xl">s</span>
            </div>

            <div className="flex flex-col items-center gap-2 pt-4">
              <div className="w-48 h-1 bg-white/5 overflow-hidden">
                <div 
                   className="h-full bg-delos-amber transition-all duration-1000" 
                   style={{ width: `${(countdown / Math.pow(2, attempts - 1)) * 100} %` }}
                />
              </div>
              <span className="text-[8px] text-delos-grey uppercase tracking-[0.5em]">
                Multiplicador_Nível: {attempts}
              </span>
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
}

export default function LoginTrigger() {
  return (
    <Suspense fallback={null}>
      <TriggerContent />
    </Suspense>
  );
}