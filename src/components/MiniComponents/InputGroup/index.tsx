function InputGroup({ label, defaultValue, onChange, disabled }: any) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[8px] font-black uppercase text-[var(--delos-grey)] tracking-widest">{label}</label>
            <input
                disabled={disabled}
                defaultValue={defaultValue}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent border-b border-[var(--delos-border)] py-2 text-xl font-bold uppercase italic outline-none focus:border-[var(--delos-amber)] disabled:opacity-50"
            />
        </div>
    );
}

export default InputGroup;