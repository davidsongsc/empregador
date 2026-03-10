import InputGroup from "@/components/MiniComponents/InputGroup";
import { X } from "lucide-react";
import { useState } from "react";


function CreateDepartmentModal({ companyId, onClose, onConfirm }: any) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--delos-surface)]/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[var(--delos-surface)] border border-[var(--delos-black)] p-8 shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-8 border-b border-[var(--delos-border)] pb-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em]">Initialize_New_Sector</h2>
                    <button onClick={onClose} className="text-[var(--delos-grey)] hover:text-[var(--delos-black)]"><X size={18} /></button>
                </div>
                <div className="space-y-6 mb-10">
                    <InputGroup label="Sector_Name" defaultValue={name} onChange={setName} />
                    <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-[var(--delos-grey)]">Description</label>
                        <textarea className="w-full bg-transparent border border-[var(--delos-border)] p-3 text-[10px] uppercase outline-none focus:border-[var(--delos-amber)]" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest border border-[var(--delos-border)]">Cancel</button>
                    <button disabled={!name} onClick={() => onConfirm({ name, description: desc, company: companyId })} className="flex-1 py-3 bg-[var(--delos-black)] text-[var(--delos-surface)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--delos-amber)] disabled:opacity-30">Confirm_Init</button>
                </div>
            </div>
        </div>
    );
}
export default CreateDepartmentModal;