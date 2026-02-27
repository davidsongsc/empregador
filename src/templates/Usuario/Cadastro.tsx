"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importar para redirecionar
import { toast } from "@/components/Notification";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Briefcase,
  Phone,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { registerUser } from "@/services/auth";

const RegisterPage = () => {
  const router = useRouter();
  const { setUser } = useAuthStore(); // Acesso direto à função de login do Zustand
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validações de UI (Mantidas para evitar requisições inúteis)
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    if (!whatsapp || whatsapp.length < 10) {
      setError("Informe um número de WhatsApp válido");
      return;
    }

    setLoading(true);

    try {
      // 2. Chamada de Registro
      // O backend deve retornar: { ok: true, user: { id, whatsapp, profile... } }
      const res = await registerUser(whatsapp, password);

      if (res?.user) {
        // 3. PERSISTÊNCIA IMEDIATA NO ZUSTAND
        // O Zustand salva no localStorage e o Header já atualiza instantaneamente
        setUser(res.user);

        toast.success("Conta criada com sucesso!", "Bem-vindo!");

        // 4. REDIRECIONAMENTO
        // Como ele acabou de criar a conta, o nome no perfil estará vazio,
        // então mandamos para /perfil para ele completar o cadastro.
        router.push("/perfil");
      }

    } catch (err: any) {
      console.error("Erro no cadastro:", err);

      // A sua nova api.ts já formata os erros do Django no campo 'message' ou 'errors'
      const backendError =
        err.errors?.whatsapp_number?.[0] ||
        err.errors?.non_field_errors?.[0] ||
        err.message ||
        "Erro ao criar conta.";

      setError(backendError);
      toast.error(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* LADO ESQUERDO (Visual Premium) */}
      <div className="hidden lg:flex flex-col justify-between bg-indigo-600 p-12 text-white mt-25 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>

        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="bg-white p-2 rounded-xl text-indigo-600 shadow-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight uppercase italic">
            Área do <span className="text-indigo-200">Trabalhador</span>
          </span>
        </Link>

        <div className="z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md border border-white/10">
            <ShieldCheck className="w-4 h-4 text-indigo-300" />
            Acesso 100% Seguro
          </div>
          <h2 className="text-6xl font-black leading-[0.9] tracking-tighter">
            Encontre sua <br /> próxima vaga <br /> hoje mesmo.
          </h2>
        </div>

        <div className="z-10 text-[10px] font-black uppercase tracking-widest text-indigo-300">
          © 2026 Plataforma de Recrutamento
        </div>
      </div>

      {/* LADO DIREITO (Formulário) */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">
              Criar conta
            </h1>
            <p className="text-gray-400 font-bold mt-2">
              Já tem conta?{" "}
              <Link href="/login" className="text-indigo-600 hover:underline">
                Fazer login
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                Seu WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="tel"
                  placeholder="5511999999999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                  className={`w-full bg-gray-50 border-2 rounded-[24px] py-4 pl-14 pr-6 font-bold outline-none transition-all ${error && !whatsapp ? "border-red-100 ring-red-50" : "border-transparent focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    }`}
                />
              </div>
            </div>

            {/* Senhas */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50 rounded-[24px] py-4 px-6 font-bold outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="••••••••"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50 rounded-[24px] py-4 px-6 font-bold outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 active:scale-95 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Finalizar Cadastro"
              )}
            </button>
          </form>

          <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            Ao criar sua conta, você concorda com nossos <br />
            <span className="text-gray-900 cursor-pointer">Termos de Uso</span> e <span className="text-gray-900 cursor-pointer">Privacidade</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;