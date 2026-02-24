"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, User, Search, PlusCircle, X, Menu } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from "@/contexts/AuthContext";

/**
 * Header component, containing the main navigation and logo.
 * Includes a mobile-specific search input and a floating dock for the main menu items.
 * @returns {JSX.Element} The Header component.
 */
const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Para mobile
    const [isDockOpen, setIsDockOpen] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { user, isAuthenticated, logoutUser } = useAuth();

    return (
        <>
            {/* --- DESKTOP HEADER --- */}
            <header className={`fixed top-0 w-full transition-all duration-300 z-40 px-6 py-4 hidden md:block ${isScrolled ? 'top-2' : 'top-0'}`}>
                <div className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl transition-all ${isScrolled
                    ? 'bg-white/60 backdrop-blur-md shadow-lg border border-white/20'
                    : 'bg-transparent'
                    }`}>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                        <Image
                            src="/img/logop.png"
                            alt="Logo"
                            width={0}
                            height={0}
                            sizes="40px"
                            className="left-3 top-1/2 -translate-y-1/8 w-8 h-8 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />

                        <span className="text-2xl semibold font-black tracking-tight text-gray-900">
                            Jobs<span className="text-gray-700">da</span><span className="text-indigo-600">hora</span>
                        </span>
                    </Link>


                    {/* Menu Central + Busca */}
                    <div className="flex items-center gap-8">
                        <nav className="flex items-center gap-6 text-sm font-semibold text-gray-600">
                            <Link href="/freelancer" className="hover:text-indigo-600 transition">Freelancer</Link>
                            <Link href="/vagas" className="hover:text-indigo-600 transition">Vagas</Link>
                            <Link href="/empresas" className="hover:text-indigo-600 transition">Empresas</Link>
                        </nav>

                        {/* Barra de Pesquisa Desktop */}
                        <div className="relative group">
                            <Image
                                src="/img/search.png"
                                alt="Logo"
                                width={0}
                                height={0}
                                sizes="40px"
                                className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                            />
                            <input
                                type="text"
                                placeholder="Buscar cargo ou cidade..."
                                className="bg-gray-100/50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 rounded-xl py-2 pl-10 pr-4 text-sm outline-none w-64 transition-all"
                            />
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-4 text-black">
                        {isAuthenticated ? (
                            <>
                                <div className="flex gap-4 items-center">

                                    <span>{user?.profile?.name}</span>
                                    <Link href="/perfil" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-colors shadow-md">
                                        Perfil
                                    </Link>
                                    <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-colors shadow-md" onClick={logoutUser}>Sair</button>
                                </div>
                            </>
                        ) : (
                            <Link href="/login" className='text-black'>Entrar</Link>
                        )}
                        <Link href="/anunciar" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-colors shadow-md">
                            Postar Vaga
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- MOBILE TOP BAR --- */}
            <div className="md:hidden fixed top-0 w-full flex justify-between items-center p-5 z-40 bg-white/70 backdrop-blur-lg border-b border-gray-100">
                <Link href="/" className="text-xl font-black tracking-tight text-gray-900">
                    Em<span className="text-gray-700">pre</span><span className="text-indigo-600">gado</span>
                </Link>
                <div className="flex gap-3">
                    {/* Botão para abrir busca no mobile */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="bg-gray-100 p-2 rounded-full text-gray-600"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="bg-gray-100 p-2 rounded-full text-gray-600">
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* --- MOBILE SEARCH OVERLAY --- */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-white z-[60] p-6 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top duration-300">
                    <div className="flex justify-between items-center">
                        <h2 className="font-black text-xl">Pesquisar</h2>
                        <button onClick={() => setIsSearchOpen(false)} className="p-2 bg-gray-100 rounded-full">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="O que você procura?"
                            className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-lg outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Buscas recentes</p>
                        <div className="flex flex-wrap gap-2">
                            {['Vendedor', 'Auxiliar', 'Home Office'].map(tag => (
                                <span key={tag} className="bg-gray-50 border border-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- MOBILE FLOATING DOCK (FAB STYLE) --- */}
            <div className="md:hidden fixed bottom-6 right-6 flex flex-col items-end z-50">

                {/* Itens do Menu (Aparecem quando aberto) */}
                <div className={`flex flex-col gap-3 mb-4 transition-all duration-300 transform ${isDockOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
                    }`}>
                    <Link href="/" className="flex items-center gap-3 bg-white shadow-xl border border-gray-100 py-3 px-5 rounded-2xl text-gray-800">
                        <span className="text-sm font-bold">Vagas</span>
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                    </Link>

                    <Link href="/anunciar" className="flex items-center gap-3 bg-white shadow-xl border border-gray-100 py-3 px-5 rounded-2xl text-gray-800">
                        <span className="text-sm font-bold">Anunciar</span>
                        <PlusCircle className="w-5 h-5 text-indigo-600" />
                    </Link>

                    <Link href="/perfil" className="flex items-center gap-3 bg-white shadow-xl border border-gray-100 py-3 px-5 rounded-2xl text-gray-800">
                        <span className="text-sm font-bold">Perfil</span>
                        <User className="w-5 h-5 text-indigo-600" />
                    </Link>
                </div>

                {/* Botão Principal (Trigger) */}
                <button
                    onClick={() => setIsDockOpen(!isDockOpen)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 ${isDockOpen ? 'bg-red-500 rotate-90' : 'bg-gray-900 rotate-0'
                        }`}
                >
                    {isDockOpen ? (
                        <X className="w-9 h-9 text-white" />
                    ) : (
                        <Menu className="w-7 h-7 text-white" />
                    )}
                </button>
            </div>

            {/* Overlay para fechar ao clicar fora */}
            {isDockOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 md:hidden"
                    onClick={() => setIsDockOpen(false)}
                />
            )}
        </>
    );
};

export default Header;