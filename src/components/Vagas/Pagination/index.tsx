import { ArrowLeft, ChevronRight } from "lucide-react";

const Pagination = ({ current, onChange, total, pageSize, hasMore, label }: any) => {
    const totalPages = total ? Math.ceil(total / pageSize) : null;

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-4 md:gap-12 w-full justify-between md:justify-center">
                <button
                    onClick={() => onChange((p: number) => Math.max(1, p - 1))}
                    disabled={current === 1}
                    className="flex-1 md:flex-none flex items-center justify-center gap-3 py-4 md:py-2 border border-black/10 text-[10px] font-black uppercase tracking-widest disabled:opacity-10 active:bg-black active:text-white transition-all"
                >
                    <ArrowLeft size={14} /> Back
                </button>

                <div className="flex items-center gap-3 px-6">
                    <span className="text-[12px] font-black text-delos-amber underline underline-offset-4">{current.toString().padStart(2, '0')}</span>
                    {totalPages && (
                        <span className="text-[12px] font-black text-black/20 tracking-tighter">/ {totalPages.toString().padStart(2, '0')}</span>
                    )}
                </div>

                <button
                    onClick={() => onChange((p: number) => p + 1)}
                    disabled={totalPages ? current >= totalPages : !hasMore}
                    className="flex-1 md:flex-none flex items-center justify-center gap-3 py-4 md:py-2 border border-black/10 text-[10px] font-black uppercase tracking-widest disabled:opacity-10 active:bg-black active:text-white transition-all"
                >
                    Next <ChevronRight size={14} />
                </button>
            </div>
            <p className="text-[8px] font-black text-black/20 uppercase tracking-[0.5em] italic">//{label}_TRANS_ID_{Math.floor(Math.random() * 1000)}</p>
        </div>
    );
};

export default Pagination;