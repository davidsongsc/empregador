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
    X
} from "lucide-react";
import { toast } from "@/components/Notification";
import { useAuthStore } from "@/store/useAuthStore";
import { login } from "@/services/login";
import DelosBackground from "@/components/MiniComponents/Background";
import { ThemePanel } from "../ThemeModal";

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
    const searchParams = useSearchParams();

    const [showPassword, setShowPassword] = useState(false);
    const [countryCode, setCountryCode] = useState("55");
    const [whatsapp, setWhatsapp] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe] = useState(false);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const cleanWhatsapp = whatsapp.replace(/\D/g, "");
        setIsValid(cleanWhatsapp.length >= 10 && password.length >= 8);
    }, [whatsapp, password]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || loading) return;

        setLoading(true);
        setError(null);

        try {
            const cleanWhatsapp = whatsapp.replace(/\D/g, "");
            const fullNumber = `${countryCode}${cleanWhatsapp}`;

            const res = await login(fullNumber, password, rememberMe);

            if (res && (res.user || res.profile || res.ok)) {
                const userData = res.user || res.data?.user || res;
                useAuthStore.getState().setUser(userData);

                toast.success("Sincronização realizada.");
                const destination = searchParams.get("from") || "/dashboard/home";

                onClose();
                router.push(destination);
            } else {
                setError(res?.message || "ACESSO_NEGADO: Credenciais inválidas.");
            }
        } catch (err: any) {
            setError("SERVER_OFFLINE: Erro de conexão.");
            toast.error("Ocorreu um erro ao fazer login.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="flex justify-center items-center gap-4 fixed inset-0 z-[100] flex items-center justify-center p-4 font-mono">
            {/* Overlay: Minimal Blur, Grayscale acinzentado e quase transparente */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[22px] grayscale-[80%] transition-opacity duration-500"

            >
                <DelosBackground />
            </div>

            {/* Container do Modal: Tematizado com Delos Colors */}
            <div className="relative w-full max-w-md bg-delos-surface rounded-none border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Scanner Line Effect (Opcional, estética Delos) */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-delos-amber/30 shadow-[0_0_15px_#d97706] animate-scan" />

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-delos-grey hover:text-delos-amber transition-colors z-20"
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
                                <span className="text-[8px] uppercase tracking-[0.4em] text-delos-grey">Security_Protocol_Active</span>
                            </div>
                            <h1 className="text-2xl font-black text-delos-black italic uppercase tracking-tighter">
                                Login_<span className="text-delos-amber">Host</span>
                            </h1>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* WhatsApp */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-delos-grey uppercase tracking-[0.2em]">Identification_Number</label>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="appearance-none bg-black/5 border border-white/10 rounded-none py-3 pl-3 pr-8 outline-none font-bold text-sm text-delos-black focus:border-delos-amber transition-all"
                                        >
                                            {COUNTRIES.map((c) => (
                                                <option key={c.code} value={c.code} className="bg-delos-surface text-delos-black">
                                                    {c.flag} +{c.code}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-delos-grey pointer-events-none" />
                                    </div>
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-grey" />
                                        <input
                                            type="tel"
                                            placeholder="NUMBER_ID"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                                            className="w-full bg-black/5 border border-white/10 rounded-none py-3 pl-10 pr-4 outline-none focus:border-delos-amber text-sm font-bold text-delos-black placeholder:text-delos-grey/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-delos-grey uppercase tracking-[0.2em]">Access_Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-grey" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/5 border border-white/10 rounded-none py-3 pl-10 pr-10 outline-none focus:border-delos-amber text-sm font-bold text-delos-black placeholder:text-delos-grey/30"
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

                            {error && (
                                <div className="text-[9px] text-delos-red font-black uppercase p-2 bg-delos-red/5 border border-delos-red/20 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-delos-red rounded-full animate-ping" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!isValid || loading}
                                className={`w-full py-4 rounded-none font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-[0.98]
                                    ${!isValid || loading
                                        ? "bg-delos-grey/10 text-delos-grey/40 cursor-not-allowed border border-white/5"
                                        : "bg-delos-black text-white hover:bg-delos-amber hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"}`}
                            >
                                {loading ? <Activity className="w-4 h-4 animate-spin" /> : "Authorize_Session"}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="pt-4 border-t border-white/5 text-center">
                            <p className="text-[9px] text-delos-grey font-bold uppercase tracking-widest">
                                External_Node? <Link href="/cadastro" className="text-delos-amber hover:underline">Register_New_Host</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
                          <ThemePanel />

        </div>
    );
};

export default React.memo(LoginModal);