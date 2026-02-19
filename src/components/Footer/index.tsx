import Link from 'next/link';
import { Briefcase, Instagram, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-24 md:pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Coluna 1: Marca e Sobre */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                                <Briefcase className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-gray-900">
                                Área do <span className="text-indigo-600">Trabalhador</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            A maior plataforma de conexões profissionais da região. Facilitando o acesso ao emprego e capacitação gratuita.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Coluna 2: Para Candidatos */}
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Para Candidatos</h4>
                        <ul className="space-y-4 text-sm font-semibold text-gray-500">
                            <li><Link href="/vagas" className="hover:text-indigo-600 transition">Explorar Vagas</Link></li>
                            <li><Link href="/perfil" className="hover:text-indigo-600 transition">Minhas Candidaturas</Link></li>
                            <li><Link href="/blog" className="hover:text-indigo-600 transition">Dicas de Currículo</Link></li>
                            <li><Link href="/cursos" className="hover:text-indigo-600 transition">Cursos Gratuitos</Link></li>
                        </ul>
                    </div>

                    {/* Coluna 3: Para Empresas */}
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Para Empresas</h4>
                        <ul className="space-y-4 text-sm font-semibold text-gray-500">
                            <li><Link href="/anunciar" className="hover:text-indigo-600 transition">Anunciar Vaga</Link></li>
                            <li><Link href="/planos" className="hover:text-indigo-600 transition">Planos de Recrutamento</Link></li>
                            <li><Link href="/guia" className="hover:text-indigo-600 transition">Guia de Contratação</Link></li>
                            <li><Link href="/suporte" className="hover:text-indigo-600 transition">Suporte Corporativo</Link></li>
                        </ul>
                    </div>

                    {/* Coluna 4: Contato / Newsletter */}
                    <div className="bg-gray-50 p-6 rounded-[32px] space-y-4">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Fique por dentro</h4>
                        <div>
                            
                            <ul className="space-y-4 text-sm font-semibold text-gray-500">
                                <li><Link href="/ajuda" className="hover:text-indigo-600 transition">Ajuda?</Link></li>
                
                            </ul>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            Receba novas vagas e cursos diretamente no seu e-mail.
                        </p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Seu e-mail"
                                className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            <button className="absolute right-1 top-1 bottom-1 bg-gray-900 text-white px-3 rounded-lg hover:bg-indigo-600 transition-colors">
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        © 2026 ÁREA DO TRABALHADOR. TODOS OS DIREITOS RESERVADOS.
                    </p>
                    <div className="flex gap-6 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                        <Link href="#" className="hover:text-gray-900 transition">Privacidade</Link>
                        <Link href="#" className="hover:text-gray-900 transition">Termos de Uso</Link>
                        <Link href="#" className="hover:text-gray-900 transition">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;