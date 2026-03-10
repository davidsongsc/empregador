"use client";

import { useUIStore } from "@/store/useUiStore";
import Link from "next/link";


const LogoFreelaCerto = () => {
    const isScrolled = useUIStore((state) => state.isScrolled);

    return (
        <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center group">
                <div className="flex items-center text-[11px] font-black tracking-[0.5em] uppercase italic">
                    <span className={`px-4 py-1.5 transition-all duration-700 ${isScrolled ? 'bg-black text-white' : 'bg-white text-black border border-black/10'}`}>
                        Freela
                    </span>
                    <span className={`px-4 py-1.5 ml-1 transition-all duration-700 ${!isScrolled ? 'bg-amber-600 text-white shadow-lg shadow-amber-200/50' : 'bg-gray-100 text-gray-400'}`}>
                        Certo
                    </span>
                </div>
            </Link>
        </div>
    )
}

export default LogoFreelaCerto;