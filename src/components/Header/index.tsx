"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, User, Search, PlusCircle, X } from 'lucide-react';
import Image from 'next/image';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Para mobile

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* --- DESKTOP HEADER --- */}
            <header className={`fixed top-0 w-full transition-all duration-300 z-40 px-6 py-8 hidden md:block ${isScrolled ? 'top-2' : 'top-0'}`}>
                <div className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl transition-all ${isScrolled
                    ? 'bg-white/60 backdrop-blur-md shadow-lg border border-white/20'
                    : 'bg-transparent'
                    }`}>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                        <Image
                            src="/img/logo.png"
                            alt="Logo"
                            width={0}
                            height={0}
                            sizes="40px"
                            className="left-3 top-1/2 -translate-y-1/8 w-12 h-12 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />

                        <span className="text-xl font-black tracking-tight text-gray-900">
                            Em<span className="text-gray-700">pre</span><span className="text-indigo-600">gado</span>
                        </span>
                    </Link>

                    {/* Menu Central + Busca */}
                    <div className="flex items-center gap-8">
                        <nav className="flex items-center gap-6 text-sm font-semibold text-gray-600">
                            <Link href="/vagas" className="hover:text-indigo-600 transition">Explorar</Link>
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
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-indigo-600 px-4">
                            Entrar
                        </Link>
                        <Link href="/anunciar" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-colors shadow-md">
                            Postar Vaga
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- MOBILE TOP BAR --- */}
            <div className="md:hidden fixed top-0 w-full flex justify-between items-center p-5 z-40 bg-white/70 backdrop-blur-lg border-b border-gray-100">
                <span className="text-xl font-black text-gray-900 leading-none">
                    Área do <span className="text-indigo-600">Trabalhador</span>
                </span>
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

            {/* --- MOBILE FLOATING DOCK --- */}
            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] h-16 bg-gray-900/90 backdrop-blur-xl rounded-2xl flex items-center justify-around px-4 shadow-2xl z-50 border border-white/10">
                <Link href="/" className="flex flex-col items-center gap-1 text-white">
                    <Briefcase className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Vagas</span>
                </Link>
                <Link href="/anunciar" className="flex flex-col items-center gap-1 text-indigo-400">
                    <PlusCircle className="w-7 h-7" />
                    <span className="text-[10px] font-medium">Anunciar</span>
                </Link>
                <Link href="/perfil" className="flex flex-col items-center gap-1 text-white/70">
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Perfil</span>
                </Link>
            </nav>
        </>
    );
};

export default Header;