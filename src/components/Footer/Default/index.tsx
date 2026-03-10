import Link from 'next/link';
import {
    Briefcase, Instagram, Linkedin, Twitter,
    Mail, Terminal, Activity, Binary
} from 'lucide-react';
import LogoFreelaCerto from '@/components/MiniComponents/Logo';

const Footer = () => {
    return (
        <footer className="bg-delos-surface border-t border-white/5 pt-16 pb-24 md:pb-8 px-4 font-mono">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Coluna 1: Marca e Matriz */}
                    <div className="space-y-6">
                        <LogoFreelaCerto />
                        <p className="text-delos-grey text-[10px] leading-relaxed font-bold uppercase tracking-widest">
                            A maior infraestrutura de conexões profissionais da região.
                            Sincronizando hosts e protocolos de carreira em tempo real.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 border border-white/10 rounded-lg text-delos-grey hover:text-delos-amber hover:border-delos-amber transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 border border-white/10 rounded-lg text-delos-grey hover:text-delos-amber hover:border-delos-amber transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 border border-white/10 rounded-lg text-delos-grey hover:text-delos-amber hover:border-delos-amber transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Coluna 2: Protocolos Candidatos */}
                    <div>
                        <h4 className="text-[10px] font-black text-delos-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <Activity size={12} className="text-delos-amber" />
                            Hosts_Candidatos
                        </h4>
                        <ul className="space-y-4 text-[10px] font-bold text-delos-grey uppercase tracking-widest">
                            <li><Link href="/comercial/marketing" className="hover:text-delos-black transition">Comercial</Link></li>
                            <li><Link href="/vagas" className="hover:text-delos-black transition">Explorar_Vagas</Link></li>
                            <li><Link href="/perfil" className="hover:text-delos-black transition">Minhas_Candidaturas</Link></li>
                            <li><Link href="/blog" className="hover:text-delos-black transition">Dicas_De_Matriz</Link></li>
                            <li><Link href="/cursos" className="hover:text-delos-black transition">Capacitação_System</Link></li>
                        </ul>
                    </div>

                    {/* Coluna 3: Protocolos Empresas */}
                    <div>
                        <h4 className="text-[10px] font-black text-delos-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <Binary size={12} className="text-delos-amber" />
                            Corporate_Domain
                        </h4>
                        <ul className="space-y-4 text-[10px] font-bold text-delos-grey uppercase tracking-widest">
                            <li><Link href="/anunciar" className="hover:text-delos-black transition">Anunciar_Protocolo</Link></li>
                            <li><Link href="/planos" className="hover:text-delos-black transition">Planos_De_Expansão</Link></li>
                            <li><Link href="/guia" className="hover:text-delos-black transition">Guia_Contratação</Link></li>
                            <li><Link href="/suporte" className="hover:text-delos-black transition">Suporte_Técnico</Link></li>
                        </ul>
                    </div>

                    {/* Coluna 4: Terminal de Newsletter */}
                    <div className="bg-delos-black p-6 rounded-xl space-y-4 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Terminal size={40} className="text-white" />
                        </div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Stay_Connected</h4>
                        <p className="text-[9px] text-delos-grey font-bold leading-relaxed uppercase tracking-widest">
                            Receba alertas de novos protocolos diretamente no seu terminal de e-mail.
                        </p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="E-MAIL_ADDRESS"
                                className="w-full bg-delos-surface border border-white/10 rounded-lg py-3 px-4 text-[9px] font-bold outline-none focus:border-delos-amber text-delos-black transition-all"
                            />
                            <button className="absolute right-1 top-1 bottom-1 bg-delos-amber text-white px-3 rounded-md hover:shadow-[0_0_10px_#d97706] transition-all">
                                <Mail className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: System Info */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[8px] font-black text-delos-grey uppercase tracking-[0.4em]">
                        © 2026 DELOS_MATRIX // FREELACERTO. ALL_SYSTEMS_OPERATIONAL.
                    </p>
                    <div className="flex gap-6 text-[8px] font-black text-delos-grey uppercase tracking-[0.3em]">
                        <Link href="#" className="hover:text-delos-black transition">Privacidade_Data</Link>
                        <Link href="#" className="hover:text-delos-black transition">Termos_De_Uso</Link>
                        <Link href="#" className="hover:text-delos-black transition">Cookies_Trace</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;