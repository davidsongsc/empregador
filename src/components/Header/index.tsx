"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, User, Search, PlusCircle, X, Menu, LogOut, ChevronRight, LayoutDashboard, Binary } from 'lucide-react';
import Image from 'next/image';

import { useAuthStore } from '@/store/useAuthStore';
import { usePathname } from 'next/dist/client/components/navigation';
import PostJobModal from '@/components/Modal/PostJobModal';
import LogoFreelaCerto from '../MiniComponents/Logo';
import { useUIStore } from '@/store/useUiStore';
import { checkModuleAccess } from '@/utils/hasRecruitmentPermission';
const Header = () => {
    const isScrolled = useUIStore((state) => state.isScrolled);
    const setScrolled = useUIStore((state) => state.setScrolled);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isDockOpen, setIsDockOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();
    const pathname = usePathname();
    const isDashboardRoute = pathname.startsWith('/dashboard');
    const [isPostJobOpen, setIsPostJobOpen] = useState(false);
    const isRecruiter = checkModuleAccess(user?.profile?.empresas, 'RECRUITMENT');

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 20;
            if (useUIStore.getState().isScrolled !== scrolled) {
                setScrolled(scrolled);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [setScrolled]);

    if (isDashboardRoute) return null;

    const closeDock = () => setIsDockOpen(false);

    return (
        <>
            <header className={`fixed top-0 w-full transition-all duration-700 z-50 hidden md:block px-6 ${isScrolled ? 'pt-2' : 'pt-6'}`}>
                <div className={`max-w-7xl mx-auto flex items-center justify-between px-8 py-4 rounded-[24px] transition-all duration-500 border ${isScrolled
                    ? 'bg-white/80 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.04)] border-gray-100'
                    : 'bg-white/40 backdrop-blur-md border-white/40'
                    }`}>

                    {/* LOGO - Westworld Style */}
                    <LogoFreelaCerto />

                    {/* NAVIGATION - Minimalista Clinical */}
                    <nav className="hidden lg:flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
                        {[
                            { name: 'Vagas', href: '/vagas' },
                            { name: 'Comercial', href: '/comercial/marketing' },
                            { name: 'Empresas', href: '/empresas' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pathname === item.href ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black hover:bg-white/50'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-1 flex justify-end items-center gap-4">
                        {/* SEARCH - Industrial Look */}
                        <div className="relative hidden xl:block group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="text"
                                placeholder="PROCURAR_PROTOCOLO..."
                                className="w-44 bg-gray-100/50 border-2 border-transparent rounded-xl py-2.5 pl-10 pr-4 text-[9px] font-black uppercase tracking-widest outline-none focus:border-black focus:bg-white transition-all duration-500"
                            />
                        </div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                                {isRecruiter && (
                                    <Link
                                        href="/dashboard/home"
                                        className="p-3 hover:bg-gray-50 text-black rounded-xl transition-all"
                                        title="Painel de Controle"
                                    >
                                        <Binary className="w-4 h-4" />
                                    </Link>
                                )}
                                <Link href="/perfil" className="flex items-center gap-3 pl-4 pr-1 group">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black text-indigo-600 uppercase tracking-tighter leading-none mb-1">
                                            {isRecruiter ? "Acesso_Staff" : "Host_Ativo"}
                                        </span>
                                        <span className="text-[11px] font-black text-black uppercase italic leading-none">
                                            {user?.profile?.name?.split(' ')[0]}
                                        </span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white overflow-hidden shadow-lg group-hover:scale-105 transition-transform border-2 border-white">
                                        {user?.profile?.foto ? (
                                            <Image src={user.profile.foto} alt="Avatar" width={40} height={40} className="object-cover" />
                                        ) : <User className="w-5 h-5" />}
                                    </div>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-3 text-gray-300 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="text-[10px] font-black text-black px-6 uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors">
                                Login
                            </Link>
                        )}

                        <button
                            onClick={() => setIsPostJobOpen(true)}
                            className="bg-black text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-amber-600 hover:shadow-[0_10px_25px_rgba(217,119,6,0.3)] transition-all active:scale-95"
                        >
                            Nova_Vaga
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE HEADER - Clean Industrial */}
            <div className="md:hidden fixed top-0 w-full flex justify-between items-center px-6 py-5 z-40 bg-white border-b border-gray-100">
                <Link href="/" className="flex items-center">
                    <div className="flex text-[10px] font-black uppercase tracking-widest italic">
                        <span className="bg-black text-white px-3 py-1">F</span>
                        <span className="bg-amber-600 text-white px-3 py-1">C</span>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSearchOpen(true)} className="p-3 bg-gray-50 rounded-xl text-black">
                        <Search className="w-5 h-5" />
                    </button>
                    {isAuthenticated ? (
                        <Link href="/perfil" className="w-11 h-11 rounded-xl bg-black flex items-center justify-center overflow-hidden border-2 border-white shadow-xl">
                            {user?.profile?.foto ? (
                                <Image src={user.profile.foto} alt="Avatar" width={44} height={44} className="object-cover" />
                            ) : <User className="w-6 h-6 text-white" />}
                        </Link>
                    ) : (
                        <Link href="/login" className="p-3 bg-black rounded-xl text-white">
                            <User className="w-5 h-5" />
                        </Link>
                    )}
                </div>
            </div>

            {/* MOBILE SEARCH OVERLAY */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-white z-[60] p-8 flex flex-col animate-in fade-in slide-in-from-bottom duration-700">
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-2">Protocolo_Busca</span>
                            <span className="font-black text-4xl tracking-tighter uppercase italic">O que você <br /> procura?</span>
                        </div>
                        <button onClick={() => setIsSearchOpen(false)} className="p-4 bg-gray-100 rounded-2xl">
                            <X className="w-8 h-8 text-black" />
                        </button>
                    </div>
                    <div className="relative mb-10">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black w-6 h-6" />
                        <input
                            autoFocus
                            placeholder="CARGO, TECH OU CIDADE..."
                            className="w-full bg-gray-50 rounded-[24px] py-8 pl-16 pr-8 text-lg font-black uppercase tracking-widest outline-none border-2 border-transparent focus:border-black transition-all"
                        />
                    </div>
                </div>
            )}

            {/* MOBILE DOCK MENU */}
            <div className="md:hidden fixed bottom-10 right-8 flex flex-col items-end z-50">
                <div className={`flex flex-col gap-4 mb-8 transition-all duration-700 ${isDockOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-50 pointer-events-none'}`}>
                    {[
                        ...(isRecruiter ? [{ icon: LayoutDashboard, label: 'Painel', href: '/dashboard/home', color: 'bg-black text-white' }] : []),
                        { icon: PlusCircle, label: 'Nova Vaga', href: '/anunciar', color: 'bg-amber-600 text-white' },
                        { icon: Briefcase, label: 'Ver Vagas', href: '/vagas', color: 'bg-white text-black' },
                        { icon: User, label: 'Perfil', href: '/perfil', color: 'bg-white text-black' },
                    ].map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            onClick={closeDock}
                            className={`flex items-center gap-5 shadow-2xl py-5 px-8 rounded-[24px] border border-gray-100 active:scale-95 transition-all ${item.color}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{item.label}</span>
                            <item.icon className="w-5 h-5" />
                        </Link>
                    ))}
                </div>

                <button
                    onClick={() => setIsDockOpen(!isDockOpen)}
                    className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all duration-700 active:scale-90 ${isDockOpen ? 'bg-black -rotate-90' : 'bg-amber-600 rotate-0 shadow-amber-200'
                        }`}
                >
                    {isDockOpen ? <X className="text-white w-8 h-8" /> : <Menu className="text-white w-8 h-8" />}
                </button>
            </div>

            {isDockOpen && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-40 md:hidden" onClick={closeDock} />
            )}

            <PostJobModal
                isOpen={isPostJobOpen}
                onClose={() => setIsPostJobOpen(false)}
            />
        </>
    );
};

export default React.memo(Header);