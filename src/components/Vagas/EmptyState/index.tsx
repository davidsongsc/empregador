import { SearchX } from "lucide-react";

const EmptyState = ({ onReset }: any) => (
    <div className="bg-black/5 border-2 border-dashed border-black/5 py-24 md:py-40 text-center flex flex-col items-center px-6">
        <SearchX className="w-16 h-16 text-black/10 mb-6" />
        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-black/40">Data_Not_Found_In_Matrix</h3>
        <button onClick={onReset} className="mt-8 px-8 py-4 bg-delos-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-delos-amber transition-colors">
            Re-initialize_System
        </button>
    </div>
);

export default EmptyState;