"use client";
import { Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export function SearchBar({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(window.location.search);
    if (term) params.set('search', term); else params.delete('search');
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative group w-full md:max-w-md">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className={`w-4 h-4 ${isPending ? 'animate-spin' : 'text-delos-black/20'}`} />
      </div>
      <input
        type="text"
        defaultValue={initialValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="PROCURAR_CARGO_OU_ID..."
        className="w-full bg-white border border-black/10 py-5 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:border-delos-amber transition-all"
      />
    </div>
  );
}