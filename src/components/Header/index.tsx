"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, User, Search, PlusCircle, X, Menu, LogOut, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isDockOpen, setIsDockOpen] = useState(false);
    const { user, isAuthenticated, logoutUser } = useAuth();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeDock = () => setIsDockOpen(false);

    return (
        <>
            {/* --- DESKTOP HEADER --- */}
            <header className={`fixed top-0 w-full transition-all duration-500 z-50 hidden md:block px-4 ${isScrolled ? 'pt-2' : 'pt-4'}`}>
                <div className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
                    isScrolled 
                    ? 'bg-white/90 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-white/40' 
                    : 'bg-white/40 backdrop-blur-md border border-white/20'
                }`}>
                    
                    {/* 1. Logo Section - Mantém sempre à esquerda */}
                    <div className="flex-1 flex justify-start">
                        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
                            <div className="relative w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-xl shadow-indigo-100 shadow-lg group-hover:rotate-6 transition-all">
                                <Briefcase className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-gray-900">
                                Freela<span className="text-indigo-600">Certo</span>
                            </span>
                        </Link>
                    </div>

                    {/* 2. Navigation Central - Escondemos em telas muito pequenas, priorizamos aqui */}
                    <nav className="hidden lg:flex items-center gap-1 bg-gray-200/30 p-1 rounded-xl border border-gray-100/50">
                        {[
                            { name: 'Vagas', href: '/vagas' },
                            { name: 'Freelancer', href: '/freelancer' },
                            { name: 'Empresas', href: '/empresas' }
                        ].map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className="px-5 py-2 rounded-lg text-sm font-black text-gray-700 hover:text-indigo-600 hover:bg-white transition-all duration-300"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* 3. User Actions - Adaptável */}
                    <div className="flex-1 flex justify-end items-center gap-3">
                        
                        {/* INPUT DE BUSCA - Só aparece se a tela for "Extra Large" (>= 1280px) */}
                        {/* Isso evita que ele bata no menu central em telas de 1024px */}
                        <div className="relative hidden xl:block group">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                             <input 
                                type="text" 
                                placeholder="Pesquisar..." 
                                className="w-48 bg-gray-100/80 border-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all duration-300"
                             />
                        </div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 bg-white/50 p-1 rounded-xl border border-white shadow-sm">
                                <Link href="/perfil" className="flex items-center gap-2 pl-3 pr-1 group">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Olá,</span>
                                        <span className="text-xs font-black text-gray-800 leading-none capitalize">
                                            {user?.profile?.name?.split(' ')[0]}
                                        </span>
                                    </div>
                                    <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                                        {user?.profile?.foto ? (
                                            <Image src={user.profile.foto} alt="Avatar" width={36} height={36} />
                                        ) : <User className="w-5 h-5" />}
                                    </div>
                                </Link>
                                <button 
                                    onClick={logoutUser}
                                    className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-lg text-gray-400 transition-colors cursor-pointer"
                                    title="Sair"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="text-sm font-black text-gray-900 px-4 hover:text-indigo-600 transition-colors">
                                Entrar
                            </Link>
                        )}
                        
                        <Link href="/anunciar" className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-black hover:bg-indigo-600 hover:-translate-y-0.5 transition-all shadow-xl shadow-gray-200 active:scale-95">
                            Postar Vaga
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- MOBILE TOP BAR --- */}
            <div className="md:hidden fixed top-0 w-full flex justify-between items-center px-6 py-4 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <Briefcase className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">FreelaCerto</span>
                </Link>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="p-3 bg-gray-50 rounded-xl text-gray-500 active:scale-90 transition-transform"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    {isAuthenticated ? (
                        <Link href="/perfil" className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
                             {user?.profile?.foto ? (
                                <Image src={user.profile.foto} alt="Avatar" width={44} height={44} />
                             ) : <User className="w-6 h-6 text-white" />}
                        </Link>
                    ) : (
                        <Link href="/login" className="p-3 bg-gray-900 rounded-xl text-white active:scale-90 transition-transform">
                            <User className="w-5 h-5" />
                        </Link>
                    )}
                </div>
            </div>

            {/* --- MOBILE SEARCH OVERLAY --- */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-white z-[60] p-6 flex flex-col animate-in slide-in-from-bottom duration-500">
                    <div className="flex justify-between items-center mb-10">
                        <span className="font-black text-3xl tracking-tighter">O que você <br/> <span className="text-indigo-600">precisa?</span></span>
                        <button onClick={() => setIsSearchOpen(false)} className="p-4 bg-gray-100 rounded-2xl active:bg-gray-200">
                            <X className="w-7 h-7" />
                        </button>
                    </div>
                    <div className="relative mb-8">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-600 w-6 h-6" />
                        <input 
                            autoFocus
                            placeholder="Cargo, tecnologia ou cidade..."
                            className="w-full bg-gray-50 rounded-3xl py-6 pl-14 pr-6 text-xl font-bold outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         {['Home Office', 'React Native', 'Designer', 'São Paulo'].map(item => (
                             <button key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-left hover:bg-indigo-50 transition-colors">
                                <span className="text-sm font-bold text-gray-700">{item}</span>
                                <ChevronRight className="w-4 h-4 text-indigo-300" />
                             </button>
                         ))}
                    </div>
                </div>
            )}

            {/* --- MOBILE FLOATING DOCK --- */}
            <div className="md:hidden fixed bottom-8 right-6 flex flex-col items-end z-50">
                <div className={`flex flex-col gap-4 mb-6 transition-all duration-500 ${
                    isDockOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-50 pointer-events-none'
                }`}>
                    {[
                        { icon: PlusCircle, label: 'Postar Vaga', href: '/anunciar', color: 'bg-indigo-600 text-white' },
                        { icon: Briefcase, label: 'Minhas Vagas', href: '/vagas', color: 'bg-white text-gray-900' },
                        { icon: User, label: 'Meu Perfil', href: '/perfil', color: 'bg-white text-gray-900' },
                    ].map((item, idx) => (
                        <Link 
                            key={idx} 
                            href={item.href} 
                            onClick={closeDock}
                            className={`flex items-center gap-4 shadow-2xl py-4 px-6 rounded-3xl border border-gray-100 group active:scale-95 transition-all ${item.color}`}
                        >
                            <span className="text-xs font-black uppercase tracking-[0.15em]">{item.label}</span>
                            <item.icon className="w-5 h-5" />
                        </Link>
                    ))}
                </div>

                <button 
                    onClick={() => setIsDockOpen(!isDockOpen)}
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-[0_20px_50px_rgba(79,70,229,0.4)] transition-all duration-500 active:scale-90 ${
                        isDockOpen ? 'bg-gray-900 -rotate-90' : 'bg-indigo-600 rotate-0'
                    }`}
                >
                    {isDockOpen ? <X className="text-white w-8 h-8" /> : <Menu className="text-white w-8 h-8" />}
                </button>
            </div>

            {/* Backdrop */}
            {isDockOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-500" onClick={closeDock}/>
            )}
        </>
    );
};

export default Header;