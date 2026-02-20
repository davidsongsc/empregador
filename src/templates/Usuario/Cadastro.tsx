"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Lock,
  Phone,
  ArrowRight,
  Github,
  ShieldCheck,
} from "lucide-react";
import { registerUser } from "@/services/auth";


const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (!whatsapp) {
      setError("Informe seu WhatsApp");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(whatsapp, password);
      console.log("User criado:", data.id);

      // próximo passo: enviar OTP / redirecionar
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* LADO ESQUERDO (inalterado visualmente) */}
      <div className="hidden lg:flex flex-col justify-between bg-indigo-600 p-12 text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>

        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="bg-white p-2 rounded-xl">
            <Briefcase className="text-indigo-600 w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight">
            Área do <span className="text-indigo-200">Trabalhador</span>
          </span>
        </Link>

        <div className="z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-indigo-200" />
            100% Seguro e Gratuito
          </div>
          <h2 className="text-5xl font-black leading-tight">
            Crie sua conta <br /> com seu WhatsApp.
          </h2>
        </div>

        <div className="z-10 text-sm font-bold text-indigo-200">
          © 2026 Área do Trabalhador
        </div>
      </div>

      {/* FORM */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-xl space-y-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              Criar conta
            </h1>
            <p className="text-gray-500 font-medium">
              Já tem conta?{" "}
              <Link
                href="/login"
                className="text-indigo-600 font-bold"
              >
                Fazer login
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* WhatsApp */}
            <div className="space-y-2 ">
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
                  className={`w-full bg-gray-50 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 rounded-2xl py-4 pl-12 pr-4 outline-none font-medium border ${error ? "border-red-600" : "border-gray-500"}`}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Senha
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl py-4 px-4 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Confirmar Senha
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="w-full bg-gray-50 rounded-2xl py-4 px-4 outline-none"
                />
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
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;