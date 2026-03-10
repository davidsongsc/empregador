"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/components/Notification";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Briefcase,
  Phone,
  ShieldCheck,
  Loader2,
  Terminal,
  Activity,
  Lock,
  ArrowRight
} from "lucide-react";
import { registerUser } from "@/services/auth";

const RegisterPage = () => {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("VALIDATION_ERROR: As senhas não coincidem");
      return;
    }
    if (password.length < 8) {
      setError("SECURITY_LOW: A senha deve ter pelo menos 8 caracteres");
      return;
    }
    if (!whatsapp || whatsapp.length < 10) {
      setError("ID_INVALID: Informe um número de WhatsApp válido");
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser(whatsapp, password);

      if (res?.id) {
        setUser(res);
        toast.success("Host registrado com sucesso!", "Sincronizando...");
        router.push("/perfil");
        router.refresh();
      }
    } catch (err: any) {
      const backendError =
        err.errors?.whatsapp_number?.[0] ||
        err.errors?.errors?.whatsapp_number?.[0] ||
        err.message ||
        "CRITICAL_ERROR: Falha ao criar conta.";
      setError(backendError);
      toast.error(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-delos-surface font-mono">
      
      {/* LADO ESQUERDO: DELOS_NARRATIVE */}
      <div className="hidden lg:flex flex-col justify-between bg-delos-black p-12 text-white relative overflow-hidden border-r border-white/5">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-delos-amber rounded-full opacity-10 blur-[120px]"></div>

        <Link href="/" className="flex items-center gap-3 z-10 group">
          <div className="bg-delos-amber p-2 rounded-lg group-hover:shadow-[0_0_15px_#d97706] transition-all">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter italic">
            DELOS_<span className="text-delos-amber">MATRIX</span>
          </span>
        </Link>

        <div className="z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-white/10">
            <ShieldCheck className="w-4 h-4 text-delos-amber" />
            Encryption_Protocol: Active
          </div>
          <h2 className="text-6xl font-black leading-none tracking-tighter italic uppercase">
            Inicie sua <br /> <span className="text-delos-amber">Sincronização</span> <br /> hoje mesmo.
          </h2>
          <div className="flex items-center gap-2 text-delos-grey">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest">Aguardando novo host...</span>
          </div>
        </div>

        <div className="z-10 text-[10px] font-black uppercase tracking-[0.4em] text-delos-grey opacity-50">
          © 2026 Plataforma FreelaCerto // Protocol_v1.1.1
        </div>
      </div>

      {/* LADO DIREITO: REGISTER_GATEWAY */}
      <div className="flex items-center justify-center p-8 md:p-16 relative">
        {/* Calibration Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(var(--delos-black) 1px, transparent 1px), linear-gradient(90deg, var(--delos-black) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="w-full max-w-md space-y-10 relative z-10">
          <div>
            <h1 className="text-4xl font-black text-delos-black tracking-tighter italic uppercase">
              Registrar_Host
            </h1>
            <p className="text-delos-grey font-bold text-[10px] uppercase tracking-widest mt-2">
              Já possui acesso?{" "}
              <Link href="/login" className="text-delos-amber hover:underline">
                Autenticar_Sistema
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-delos-grey uppercase tracking-[0.2em] px-1">
                Identification_Number (WhatsApp)
              </label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-grey" />
                <input
                  type="tel"
                  placeholder="5511999999999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                  className={`w-full bg-delos-surface border border-white/10 rounded-xl py-4 pl-14 pr-6 font-bold outline-none transition-all text-delos-black tracking-widest ${
                    error && !whatsapp ? "border-red-500/50" : "focus:border-delos-amber"
                  }`}
                />
              </div>
            </div>

            {/* Senhas */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-delos-grey uppercase tracking-[0.2em] px-1">
                  Access_Key (Senha)
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-grey" />
                  <input
                    type="password"
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-delos-surface border border-white/10 focus:border-delos-amber rounded-xl py-4 pl-14 pr-6 font-bold outline-none transition-all text-delos-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-delos-grey uppercase tracking-[0.2em] px-1">
                  Confirm_Access_Key
                </label>
                <div className="relative">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-grey" />
                  <input
                    type="password"
                    value={confirmPassword}
                    placeholder="••••••••"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-delos-surface border border-white/10 focus:border-delos-amber rounded-xl py-4 pl-14 pr-6 font-bold outline-none transition-all text-delos-black"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50/50 text-red-600 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-delos-black text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-delos-amber hover:shadow-[0_0_20px_rgba(217,119,6,0.3)] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  Finalizar_Registro
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-[8px] text-center text-delos-grey font-bold uppercase tracking-[0.3em] leading-relaxed">
            Ao registrar este host, você aceita os <br />
            <span className="text-delos-black cursor-pointer hover:text-delos-amber">Protocolos de Uso</span> e <span className="text-delos-black cursor-pointer hover:text-delos-amber">Segurança</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;