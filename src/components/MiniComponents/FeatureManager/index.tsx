import React from "react";
import { ListChecks, Plus, X } from "lucide-react";
function FeatureManager({ features, onChange, disabled }: { features: string[], onChange: (val: string[]) => void, disabled: boolean }) {
    const [inputValue, setInputValue] = React.useState("");

    const addFeature = () => {
        if (inputValue.trim() && !features.includes(inputValue.trim())) {
            const newFeatures = [...features, inputValue.trim()];
            onChange(newFeatures);
            setInputValue("");
        }
    };

    const removeFeature = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index);
        onChange(newFeatures);
    };

    return (
        <div className="space-y-3">
            <span className="text-[7px] font-black uppercase text-slate-400 flex items-center gap-1">
                <ListChecks size={10} /> Protocol_Features_List
            </span>

            {/* INPUT PARA ADICIONAR */}
            <div className="flex gap-2">
                <input
                    disabled={disabled}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                    placeholder="ADD_NEW_FEATURE..."
                    className="flex-1 bg-slate-100 border border-slate-200 p-2 text-[10px] font-mono uppercase outline-none focus:border-amber-500 disabled:opacity-50"
                />
                <button
                    disabled={disabled}
                    onClick={addFeature}
                    className="bg-amber-500 text-white px-3 hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* LISTA DE TAGS DINÂMICAS */}
            <div className="flex flex-wrap gap-2 min-h-[80px] p-3 bg-slate-50 border border-dashed border-slate-200">
                {features.length > 0 ? features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 px-2 py-1 group/tag">
                        <span className="text-[9px] font-bold text-slate-600 uppercase italic">{feat}</span>
                        {!disabled && (
                            <button
                                onClick={() => removeFeature(idx)}
                                className="text-slate-300 hover:text-rose-500 transition-colors"
                            >
                                <X size={10} />
                            </button>
                        )}
                    </div>
                )) : (
                    <span className="text-[8px] text-slate-400 italic uppercase m-auto">No_Active_Features</span>
                )}
            </div>
        </div>
    );
}

export default FeatureManager;