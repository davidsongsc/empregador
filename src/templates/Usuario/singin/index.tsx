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
  Activity
} from "lucide-react";
import { toast } from "@/components/Notification";
import { useAuthStore } from "@/store/useAuthStore";
import { login } from "@/services/login";

const COUNTRIES = [
  { code: "55", name: "Brasil", flag: "🇧🇷" },
  { code: "351", name: "Portugal", flag: "🇵🇹" },
  { code: "1", name: "USA", flag: "🇺🇸" },
  { code: "244", name: "Angola", flag: "🇦🇴" },
];

const LoginUser = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("55");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Monitor de Parâmetros de Acesso
  useEffect(() => {
    const cleanWhatsapp = whatsapp.replace(/\D/g, "");

    // Critérios: WhatsApp (min 10 dígitos) E Senha (min 8 caracteres)
    const isPhoneNumberReady = cleanWhatsapp.length >= 10;
    const isPasswordReady = password.length >= 8;

    setIsValid(isPhoneNumberReady && isPasswordReady);
  }, [whatsapp, password]);
  useEffect(() => {
    const savedWhatsapp = localStorage.getItem("saved_whatsapp");
    const savedCountry = localStorage.getItem("saved_country");
    if (savedWhatsapp) setWhatsapp(savedWhatsapp);
    if (savedCountry) setCountryCode(savedCountry);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDAÇÃO DE PROTOCOLO ---
    const cleanWhatsapp = whatsapp.replace(/\D/g, "");

    if (cleanWhatsapp.length < 10) {
      setError("INVALID_ID: Número de WhatsApp incompleto.");
      return;
    }

    if (password.length < 8) {
      setError("SECURITY_BREACH: Senha deve conter no mínimo 8 caracteres.");
      return;
    }
    // ------------------------------

    setLoading(true);
    setError(null);

    try {
      const fullNumber = `${countryCode}${cleanWhatsapp}`;
      const res = await login(fullNumber, password, rememberMe);

      if (res && (res.user || res.profile || res.ok)) {
        const userData = res.user || res.data?.user || res;

        if (!userData?.profile) {
          setError("PROTOCOL_ERROR: Perfil não localizado.");
          return;
        }

        useAuthStore.getState().setUser(userData);
        const empresas = userData.profile.empresas || [];

        if (empresas.length > 1) {
          router.push("/select-company");
        } else if (empresas.length === 1) {
          const companyId = empresas[0].id;
          useAuthStore.getState().setActiveCompany(companyId);
          router.push(`/dashboard/painel/companies`);
        } else {
          router.push("/vagas");
        }
        toast.success("Sincronização realizada.");
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
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="appearance-none bg-delos-surface border border-white/10 rounded-xl py-4 pl-4 pr-10 outline-none font-bold text-delos-black cursor-pointer focus:border-delos-amber transition-all"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-delos-surface text-delos-black">
                        {c.flag} +{c.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-grey pointer-events-none" />
                </div>

                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-grey" />
                  <input
                    type="tel"
                    placeholder="Número"
                    value={whatsapp}
                    required
                    onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
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
    </div>
  );
};

export default LoginUser;