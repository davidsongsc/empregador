
function TabButton({ active, onClick, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-[var(--delos-black)] text-[var(--delos-surface)]' : 'text-[var(--delos-grey)] hover:text-[var(--delos-black)]'}`}
        >
            {label}
        </button>
    );
}

export default TabButton