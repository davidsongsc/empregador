"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Briefcase, User, Search, PlusCircle, X, Menu, LogOut, LayoutDashboard, Binary, LogIn, Building, LayoutDashboardIcon } from 'lucide-react';
import Image from 'next/image';

import { useAuthStore } from '@/store/useAuthStore';
import { usePathname } from 'next/dist/client/components/navigation';
import LogoFreelaCerto from '../MiniComponents/Logo';
import { useUIStore } from '@/store/useUiStore';
import checkModuleAccess from '@/utils/checkModuleAccess';
import { Module } from '@/enum/moduleEnum';
import { getActiveMembership } from '@/utils/userHelpers';
import LoginModal from '../Modal/LoginModal';
import SelectCompanyModal from '../Modal/SelectCompany';
import hasModuleAccess from '@/utils/hasModuleAccess';
import { useProfile } from '@/hooks/useProfile';
import { useJobStore } from '@/store/useJobStore';

const Header = () => {
    const isScrolled = useUIStore((state) => state.isScrolled);
    const setScrolled = useUIStore((state) => state.setScrolled);
    const { profile } = useProfile();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isDockOpen, setIsDockOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();
    const pathname = usePathname();
    const isDashboardRoute = pathname.startsWith('/dashboard');
    const [isPostJobOpen, setIsPostJobOpen] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const userRole = getActiveMembership()?.role;
    const isRecruiter = hasModuleAccess(userRole, Module.OPERATIONAL);
    const {
        fetchCategories
    } = useJobStore();
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
    const logoutRefreshCategory = useCallback(() => {
        fetchCategories(1, true);
        logout();
    }, []);
    if (isDashboardRoute) return null;

    const closeDock = () => setIsDockOpen(false);

    const navItemBase = "px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300";
    const glassEffect = "backdrop-blur-xl border border-[var(--delos-border)] transition-all duration-700";

    return (
        <>
            {/* DESKTOP HEADER */}
            <header className={`fixed top-0 w-full z-50 hidden md:block px-6 transition-all duration-700 ${isScrolled ? 'pt-0' : 'pt-5'}`}>
                <div className={` mx-auto flex items-center justify-between px-8  transition-all duration-700 ${glassEffect} ${isScrolled
                    ? 'bg-[var(--delos-surface)]/90 max-w-8xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] py-0'
                    : 'bg-[var(--delos-surface)]/40 max-w-7xl py-4'
                    }`}>

                    {/* LOGO */}
                    <LogoFreelaCerto />

                    {/* NAVIGATION - Clinical Minimalist */}
                    <nav className="hidden lg:flex items-center gap-1 bg-[var(--delos-black)]/[0.03] p-1 border border-[var(--delos-border)]">
                        {[
                            { name: 'Inicio', href: '/' },
                            { name: 'Blog', href: '/blog' },
                            { name: 'Comercial', href: '/comercial/marketing' },
                            { name: 'Empresas', href: '/empresas' },

                            { name: 'Contato', href: '/contato' },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`${navItemBase} ${pathname === item.href
                                    ? 'bg-[var(--delos-black)] text-[var(--delos-surface)] shadow-lg'
                                    : 'text-[var(--delos-grey)] hover:text-[var(--delos-black)] hover:bg-[var(--delos-black)]/5'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-1 flex justify-end items-center gap-6">

                        {isScrolled && (
                            <div className="relative hidden xl:block group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--delos-grey)] group-focus-within:text-[var(--delos-amber)] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="PROCURAR_PROTOCOLO..."
                                    className="w-48 bg-transparent border-b border-[var(--delos-border)] py-2 pl-10 pr-4 text-[9px] font-black uppercase tracking-widest outline-none focus:border-[var(--delos-amber)] transition-all duration-500 text-[var(--delos-black)] placeholder:text-[var(--delos-grey)]/50"
                                />
                            </div>
                        )}


                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                {isRecruiter.hasAccess && (
                                    <>

                                        <button
                                            onClick={() => setIsOpenModal(true)}
                                            className="p-3 text-[var(--delos-black)] hover:bg-[var(--delos-black)]/5 transition-all"
                                            title="Selecionar Empresa"
                                        >
                                            <Building className="w-4 h-4" />
                                        </button>
                                        <Link
                                            href="/dashboard/home"
                                            className="p-3 text-[var(--delos-black)] hover:bg-[var(--delos-black)]/5 transition-all"
                                            title="Painel de Controle"
                                        >
                                            <LayoutDashboardIcon className="w-4 h-4" />
                                        </Link>


                                    </>
                                )}
                                <Link href="/perfil" className="flex items-center gap-3 pl-4 group">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[7px] font-black text-[var(--delos-amber)] uppercase tracking-tighter leading-none mb-1">
                                            {isRecruiter.hasAccess ? "Staff" : "Candidato"}
                                        </span>
                                        {user?.profile?.name && <span className="text-[10px] font-black text-[var(--delos-black)] uppercase leading-none">{user.profile.name.split(' ')[0]}</span>}

                                    </div>
                                    <div className="w-9 h-9 bg-[var(--delos-black)] flex items-center justify-center text-[var(--delos-surface)] overflow-hidden shadow-xl group-hover:scale-105 transition-transform border border-[var(--delos-border)]">
                                        {user?.profile?.foto ? (
                                            <Image src={user.profile.foto} alt="Avatar" width={36} height={36} className="object-cover" />
                                        ) : <User className="w-4 h-4" />}
                                    </div>
                                </Link>
                                <button
                                    onClick={logoutRefreshCategory}
                                    className="p-3 text-[var(--delos-grey)] hover:text-[var(--delos-red)] transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsPostJobOpen(true)}
                                className="bg-[var(--delos-black)] text-[var(--delos-surface)] px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--delos-amber)] transition-all active:scale-95 shadow-2xl"
                            >
                                Login
                            </button>
                        )}


                    </div>
                </div>
            </header>

            {/* MOBILE HEADER */}
            <div className={`md:hidden fixed top-0 w-full flex justify-between items-center px-6 py-5 z-40 bg-[var(--delos-surface)] border-b border-[var(--delos-border)]`}>
                <LogoFreelaCerto />
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSearchOpen(true)} className="p-3 text-[var(--delos-black)]">
                        <Search className="w-5 h-5" />
                    </button>
                    <Link href="/perfil" className="w-10 h-10 bg-[var(--delos-black)] flex items-center justify-center overflow-hidden border border-[var(--delos-border)]">
                        {user?.profile?.foto ? (
                            <Image src={user.profile.foto} alt="Avatar" width={40} height={40} className="object-cover" />
                        ) : <User className="w-5 h-5 text-[var(--delos-surface)]" />}
                    </Link>
                </div>
            </div>

            {/* MOBILE SEARCH OVERLAY */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-[var(--delos-surface)] z-[60] p-8 flex flex-col animate-in fade-in slide-in-from-bottom duration-500 font-mono">
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[var(--delos-amber)] uppercase tracking-[0.4em] mb-2">Protocolo_Busca</span>
                            <span className="font-black text-4xl tracking-tighter uppercase italic text-[var(--delos-black)]">O que você <br /> procura?</span>
                        </div>
                        <button onClick={() => setIsSearchOpen(false)} className="p-4 bg-[var(--delos-black)] text-[var(--delos-surface)]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--delos-amber)] w-6 h-6" />
                        <input
                            autoFocus
                            placeholder="CARGO, TECH OU CIDADE..."
                            className="w-full bg-transparent border-b-2 border-[var(--delos-black)] py-8 pl-16 pr-8 text-lg font-black uppercase tracking-widest outline-none text-[var(--delos-black)]"
                        />
                    </div>
                </div>
            )}

            {/* MOBILE DOCK MENU (Westworld Control) */}
            <div className="md:hidden fixed bottom-10 right-8 flex flex-col items-end z-50">
                <div className={`flex flex-col gap-4 mb-8 transition-all duration-500 ${isDockOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-50 pointer-events-none'}`}>
                    {[
                        ...(isRecruiter.hasAccess ? [{ icon: LayoutDashboard, label: 'Painel', href: '/dashboard/home', color: 'bg-[var(--delos-black)] text-[var(--delos-surface)]' }] : []),
                        { icon: PlusCircle, label: 'Nova Vaga', href: '/anunciar', color: 'bg-[var(--delos-amber)] text-white' },
                        { icon: Briefcase, label: 'Ver Vagas', href: '/vagas', color: 'bg-[var(--delos-surface)] text-[var(--delos-black)]' },
                        { icon: User, label: 'Perfil', href: '/perfil', color: 'bg-[var(--delos-surface)] text-[var(--delos-black)]' },
                    ].map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            onClick={closeDock}
                            className={`flex items-center gap-5 shadow-2xl py-5 px-8 border border-[var(--delos-border)] active:scale-95 transition-all ${item.color}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{item.label}</span>
                            <item.icon className="w-5 h-5" />
                        </Link>
                    ))}
                </div>

                <button
                    onClick={() => setIsDockOpen(!isDockOpen)}
                    className={`w-14 h-14 flex items-center justify-center shadow-2xl transition-all duration-700 active:scale-90 ${isDockOpen ? 'bg-[var(--delos-black)] text-[var(--delos-surface)] -rotate-90' : 'bg-[var(--delos-amber)] text-white rotate-0'
                        }`}
                >
                    {isDockOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
            </div>

            {isDockOpen && (
                <div className="fixed inset-0 bg-[var(--delos-surface)]/60 backdrop-blur-md z-40 md:hidden transition-all duration-500" onClick={closeDock} />
            )}
            {isAuthenticated ? (
                <></>
            ) :
                (
                    <LoginModal
                        isOpen={isPostJobOpen}
                        onClose={() => setIsPostJobOpen(false)}
                    />
                )}

            <SelectCompanyModal
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
            />

        </>
    );
};

export default React.memo(Header);