"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
} from "lucide-react";
import { login } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

const LoginUser = () => {
  const { refreshSession } = useAuth();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [whatsapp, setWhatsapp] = useState("5521983108439");
  const [password, setPassword] = useState("22558888");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!whatsapp || !password) {
      setError("Informe WhatsApp e senha");
      return;
    }

    setLoading(true);

    try {
      const res = await login(whatsapp, password);

      if (res?.ok === true) {
        await login(whatsapp, password);
        await refreshSession();
        router.push("/vagas");
        return;
      }

      setError("Falha ao autenticar");
    } catch (err: any) {
      setError(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white mt-25">
      {/* LADO ESQUERDO */}
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
            <h1 className="text-3xl font-black text-gray-900">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-500 font-medium">
              Ainda não tem conta?{" "}
              <Link
                href="/cadastro"
                className="text-indigo-600 font-bold"
              >
                Cadastre-se grátis
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="tel"
                  placeholder="5511998765432"
                  value={whatsapp}
                  onChange={(e) =>
                    setWhatsapp(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full bg-gray-50 rounded-2xl py-4 pl-12 pr-4 outline-none"
                />
              </div>
            </div>

            {/* Senha */}
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
                  className="w-full bg-gray-50 rounded-2xl py-4 pl-12 pr-12 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Entrando..." : "Entrar na conta"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Social login permanece igual */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border rounded-2xl font-bold text-sm">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border rounded-2xl font-bold text-sm">
              <Github className="w-5 h-5" /> GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;