const StatCard = ({ icon, label, value, color = "black" }: any) => {
    const colors: any = {
        black: "bg-[var(--delos-black)] text-[var(--delos-surface)]",
        amber: "bg-[var(--delos-amber)] text-white",
        indigo: "bg-[var(--delos-indigo)] text-white",
    };

    return (
        <div className={`${colors[color]} min-w-[100px] px-5 py-2 shadow-2xl
                     flex flex-col justify-between h-12 border border-white/5`}>

            <div>
                <p className="text-[7px] font-black uppercase tracking-widest mb-1">{label}</p>
                <p className="text-xl font-black italic leading-none flex items-baseline gap-4"> <div className="opacity-40">{icon}</div> {value || 0}</p>
            </div>
        </div>
    );
};

export default StatCard