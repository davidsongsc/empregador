"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Lock,
    Phone,
    Eye,
    EyeOff,
    ArrowRight,
    ChevronDown,
    Activity,
    X,
    Mail,
    CheckCircle
} from "lucide-react";
import { toast } from "@/components/Notification";
import { useAuthStore } from "@/store/useAuthStore";
import { login } from "@/services/login";
import { ThemePanel } from "../ThemeModal";
import DelosSpaceTimeBackground from "@/components/MiniComponents/Background";

const COUNTRIES = [
    { code: "55", name: "Brasil", flag: "🇧🇷" },
    { code: "351", name: "Portugal", flag: "🇵🇹" },
    { code: "1", name: "USA", flag: "🇺🇸" },
    { code: "244", name: "Angola", flag: "🇦🇴" },
];

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [countryCode, setCountryCode] = useState("55");
    const [whatsapp, setWhatsapp] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(email);
        const isPasswordValid = password.length >= 8;

        setIsValid(isEmailValid && isPasswordValid);
    }, [email, password]);

    useEffect(() => {
        const savedEmail = localStorage.getItem("saved_email");
        const savedCountry = localStorage.getItem("saved_country");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
        if (savedCountry) setCountryCode(savedCountry);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await login(email, password, rememberMe);

            if (res && (res.user || res.ok)) {
                // --- LÓGICA DE PERSISTÊNCIA ---
                if (rememberMe) {
                    localStorage.setItem("saved_email", email);
                    localStorage.setItem("saved_country", countryCode);
                } else {
                    localStorage.removeItem("saved_email");
                    localStorage.removeItem("saved_country");
                }

                // ... Lógica de redirecionamento (empresas, etc)
                const userData = res.user || res.data?.user || res;
                setUser(userData);
                onClose();
                router.refresh();
                toast.info("Login efetuado com sucesso.");

            } else {
                setError("ACESSO_NEGADO: Credenciais inválidas.");
            }
        } catch (err: any) {
            // --- LÓGICA DE CAPTURA DE ERRO DO FASTAPI ---
            let backendError = "CRITICAL_ERROR: Falha ao criar conta.";

            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;

                // Se for o array de erros do FastAPI (validação)
                if (Array.isArray(detail)) {
                    backendError = `VALIDATION_ERROR: ${detail[0].msg}`;
                    toast.error(backendError);
                } else {
                    // Se for uma mensagem simples (HTTPException)
                    backendError = detail;
                }
            } else {
                backendError = err.message || backendError;
            }

            setError(backendError);
            toast.error(backendError); // Agora a notificação mostra o erro real
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="flex justify-center items-center gap-4 fixed inset-0 z-[100] flex items-center justify-center p-4 font-mono">
            <DelosSpaceTimeBackground />
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-[6px] grayscale-[60%] transition-opacity duration-500 -z-10"
                aria-hidden="true"
            />
            {/* Container do Modal: Tematizado com Delos Colors */}
            <div className="relative w-full max-w-md bg-delos-surface rounded-none border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Scanner Line Effect (Opcional, estética Delos) */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-delos-amber/30 shadow-[0_0_15px_#d97706] animate-scan" />

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-delos-black hover:text-delos-amber transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 md:p-10 relative">
                    {/* Grid técnico de fundo */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{
                        backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }} />

                    <div className="relative z-10 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="text-delos-amber w-3 h-3 animate-pulse" />
                                <span className="text-[8px] uppercase tracking-[0.4em] text-delos-black">Area de segurança</span>
                            </div>
                            <h1 className="text-2xl font-black text-delos-black italic uppercase tracking-tighter">
                                acessar_<span className="text-delos-amber">conta</span>
                            </h1>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* WhatsApp */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-delos-grey uppercase tracking-[0.2em]">
                                    Identification_Number (WhatsApp)
                                </label>
                                <div className="flex gap-2">

                                    <div className="relative flex-1">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-grey" />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-delos-surface border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-delos-amber text-delos-black transition-all font-bold tracking-widest"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Senha */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-delos-grey uppercase tracking-[0.2em]">
                                    Access_Key (Senha)
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-grey" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-delos-surface border border-white/10 rounded-xl py-4 pl-12 pr-12 outline-none focus:border-delos-amber text-delos-black transition-all font-bold tracking-widest"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-delos-grey hover:text-delos-amber"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-4 h-4 border border-white/10 rounded bg-delos-surface peer-checked:bg-delos-amber peer-checked:border-delos-amber transition-all flex items-center justify-center">
                                        <CheckCircle className={`w-3 h-3 text-white ${rememberMe ? 'block' : 'hidden'}`} />
                                    </div>
                                    <span className="text-[9px] font-black text-delos-grey uppercase tracking-widest group-hover:text-delos-black transition-colors">
                                        Lembrar_Sessão
                                    </span>
                                </label>

                                <Link href="/recuperar-senha" className="text-[9px] font-black text-delos-grey hover:text-delos-amber transition-colors uppercase tracking-widest">
                                    Recuperar_Acesso?
                                </Link>
                            </div>

                            {error && (
                                <div className="text-[10px] text-red-600 font-black uppercase tracking-widest bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!isValid || loading}
                                className={`
    w-full py-5 rounded-xl font-black uppercase tracking-[0.3em] transition-all 
    flex items-center justify-center gap-3 group active:scale-[0.98]
    ${!isValid || loading
                                        ? "bg-delos-amber opacity-30 grayscale cursor-not-allowed border border-white/5"
                                        : "bg-delos-black text-white hover:bg-delos-amber hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
                                    }
  `}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 animate-spin" />
                                        PROCESSANDO...
                                    </span>
                                ) : (
                                    <>
                                        Entrar
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-4 border-t border-white/5 text-center">
                            <p className="text-[9px] text-delos-black font-bold uppercase tracking-widest">
                                External_Node? <Link href="/cadastro" className="text-delos-amber hover:underline">Register_New_Host</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default React.memo(LoginModal);