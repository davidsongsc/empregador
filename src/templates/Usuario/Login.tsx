"use client";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { login } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

// Lista de países sugerida
const COUNTRIES = [
  { code: "55", name: "Brasil", flag: "🇧🇷" },
  { code: "351", name: "Portugal", flag: "🇵🇹" },
  { code: "1", name: "USA", flag: "🇺🇸" },
  { code: "244", name: "Angola", flag: "🇦🇴" },
];

const LoginUser = () => {
  const { refreshSession, isAuthenticated } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("55"); // Estado para o país
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validação básica
    if (!whatsapp || !password) {
      setError("Informe WhatsApp e senha");
      return;
    }

    setLoading(true);

    // 2. Formatação do número (DDI + Número limpo)
    const fullNumber = `${countryCode}${whatsapp.replace(/\D/g, "")}`;

    try {
      // 3. Chamada de login
      // Esta função deve retornar o objeto com os tokens (access/refresh)
      const res = await login(fullNumber, password, rememberMe);

      // Verificamos se a resposta foi positiva
      if (res?.ok === true) {
        // ADICIONE ESTA PAUSA DE 100ms
        // Isso dá tempo ao navegador para processar o Set-Cookie recebido no login
        await new Promise(resolve => setTimeout(resolve, 150));

        await refreshSession();
        router.push("/vagas");
        return;
      }

      // Se o backend retornou 200 mas com erro de negócio ou ok: false
      setError(res?.message || "Credenciais incorretas ou conta inativa.");

    } catch (err: any) {
      // 6. Tratamento de erros de rede ou backend (401, 403, 500)
      console.error("Erro no submit:", err);

      // Captura a mensagem de erro vinda do Django (ex: { "detail": "..." })
      const apiErrorMessage = err.response?.data?.detail
        || err.response?.data?.message
        || "Ocorreu um erro ao tentar entrar. Tente novamente.";

      setError(apiErrorMessage);
    } finally {
      setLoading(false);
      router.push("/");
    }
  };


  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/vagas");
    }
  }, [isAuthenticated, loading]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white mt-25">
      {/* LADO ESQUERDO (Mantido igual) */}
      <div className="hidden lg:flex flex-col justify-between bg-gray-700 p-12 text-white relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="bg-white p-2 rounded-xl">
            <Briefcase className="text-indigo-600 w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight">
            Área do <span className="text-indigo-200">Trabalhador</span>
          </span>
        </Link>
        <div className="z-10 space-y-6">
          <h2 className="text-5xl font-black leading-tight">
            Sua carreira merece <br /> um novo começo.
          </h2>
        </div>
        <div className="z-10 text-sm font-bold text-indigo-200">
          © 2026 Área do Trabalhador
        </div>
      </div>

      {/* FORM */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Bem-vindo de volta</h1>
            <p className="text-gray-500 font-medium">
              Ainda não tem conta?{" "}
              <Link href="/cadastro" className="text-indigo-600 font-bold">
                Cadastre-se grátis
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* WhatsApp com Select de País */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                WhatsApp
              </label>
              <div className="flex gap-2">
                {/* Select de País */}
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="appearance-none bg-gray-50 rounded-2xl py-4 pl-4 pr-10 outline-none font-bold text-gray-700 cursor-pointer border-2 border-transparent focus:border-indigo-100 transition-all"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Input do Número */}
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input
                    type="tel"
                    placeholder="11998765432"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-gray-50 rounded-2xl py-4 pl-12 pr-4 outline-none border-2 border-transparent focus:border-indigo-100 transition-all font-medium"
                  />
                </div>

              </div>

            </div>

            {/* Senha (Mantido igual) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl py-4 pl-12 pr-12 outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-gray-200 rounded-lg peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                    <CheckCircle className={`w-3 h-3 text-white ${rememberMe ? 'block' : 'hidden'}`} />
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">
                  Lembrar de mim
                </span>
              </label>

              <Link href="/recuperar-senha" className="text-xs font-bold text-indigo-600 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            {error && (
              <div className="text-sm text-red-600 font-bold animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-200"
            >
              {loading ? "Entrando..." : "Entrar na conta"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-50 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-50 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">
              <Github className="w-5 h-5" /> GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;