"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  ChevronDown,
  CheckCircle,
  Terminal,
  Activity,
  Mail
} from "lucide-react";
import { toast } from "@/components/Notification";
import { useAuthStore } from "@/store/useAuthStore";
import { login } from "@/services/login";
import { sendGAEvent } from "@next/third-parties/google";
import { useProfile } from "@/hooks/useProfile";


const LoginUser = () => {
  const { setUser, isAuthenticated } = useAuthStore();
  const { refresh } = useProfile();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("55");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // 1. Validação em tempo real
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
      // GA4: Rastreia tentativa de acesso
      sendGAEvent('event', 'login_attempt', { method: 'email_password' });

      const res = await login(email, password, rememberMe);

      // Verificação robusta da resposta
      if (res && (res.user || res.ok || res.data?.user)) {

        // --- LÓGICA DE PERSISTÊNCIA (Local Storage) ---
        if (rememberMe) {
          localStorage.setItem("saved_email", email);
          localStorage.setItem("saved_country", countryCode);
        } else {
          localStorage.removeItem("saved_email");
          localStorage.removeItem("saved_country");
        }

        const userData = res.user || res.data?.user || res;
        setUser(userData);
        refresh(); // Sincroniza o perfil atualizado
        // GA4: Login efetuado com sucesso
        sendGAEvent('event', 'login', {
          method: 'email_password',
          user_id: userData.id || userData.usuario_id
        });

        toast.success(`ACESSO_AUTORIZADO: Bem-vindo.`);
        router.push("/perfil");

      } else {
        const errorMsg = "ACESSO_NEGADO: Credenciais inválidas.";
        setError(errorMsg);
        sendGAEvent('event', 'login_failure', { reason: 'invalid_credentials' });
      }
    } catch (err: any) {
      // --- LÓGICA DE CAPTURA DE ERRO DO FASTAPI ---
      let backendError = "CRITICAL_ERROR: Falha na autenticação.";
      toast.error(err)

      // GA4: Rastreia o erro técnico no login
      sendGAEvent('event', 'login_error', {
        error_message: backendError,
        error_code: err.response?.status || 500
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-delos-surface font-mono">
      {/* LADO ESQUERDO: ESTÉTICA DELOS INC. */}
      <div className="hidden lg:flex flex-col justify-between bg-delos-black p-12 text-white relative overflow-hidden border-r border-white/5">
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-delos-amber rounded-full opacity-10 blur-[120px]"></div>

        <Link href="/" className="flex items-center gap-3 z-10 group">
          <div className="bg-delos-amber p-2 rounded-lg group-hover:shadow-[0_0_15px_#d97706] transition-all">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter italic">
            Freela<span className="text-delos-amber">CERTO</span>
          </span>
        </Link>

        <div className="z-10 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-delos-amber w-4 h-4 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-delos-grey">System_Status: Online</span>
          </div>
          <h2 className="text-6xl font-black leading-none italic uppercase tracking-tighter">
            Sincronize sua <br /> <span className="text-delos-amber">Carreira.</span>
          </h2>
          <p className="text-delos-grey text-sm tracking-widest max-w-sm">
            Acesso restrito ao painel de gerenciamento de hosts e protocolos de recrutamento FreelaCerto.
          </p>
        </div>

        <div className="z-10 text-[10px] font-bold text-delos-grey tracking-[0.3em] uppercase opacity-50">
          © 2026 Protocolo Delos_White // All Rights Reserved
        </div>
      </div>
      {!isAuthenticated && (<>
        {/* LADO DIREITO: FORMULÁRIO */}
        <div className="flex items-center justify-center p-8 md:p-16 relative">
          {/* Background Grid Subtle */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(var(--delos-black) 1px, transparent 1px), linear-gradient(90deg, var(--delos-black) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          <div className="w-full max-w-md space-y-10 relative z-10">
            <div>
              <h1 className="text-3xl font-black text-delos-black italic uppercase tracking-tighter">Login_Protocol</h1>
              <p className="text-delos-grey font-bold text-[10px] uppercase tracking-widest mt-2">
                Não possui credenciais?{" "}
                <Link href="/cadastro" className="text-delos-amber hover:underline">
                  Registrar_Novo_Host
                </Link>
              </p>
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

            {/* Social login */}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <p className="text-center text-[8px] font-black text-delos-grey uppercase tracking-[0.4em]">External_Auth_Gateways</p>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all text-delos-black">
                  Google_ID
                </button>
                <button className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all text-delos-black">
                  <Github className="w-4 h-4" /> GitHub_Vault
                </button>
              </div>
            </div>
          </div>
        </div>
      </>)}
    </div>
  );
};

export default LoginUser;