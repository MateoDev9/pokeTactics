import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PokemonType } from '../../types';
import { TYPE_LABELS } from '../../data/typeEfficacy';
import { analyzeDefense, analyzeOffense } from '../../utils/typeLogic';
import { TypeBadge } from '../../components/TypeBadge';
import { Card, cn } from '../../components/ui';
import { Shield, Sword } from 'lucide-react';

const ALL_TYPES = Object.keys(TYPE_LABELS) as PokemonType[];

export function TypeCalculator() {
    const [mode, setMode] = useState<'defense' | 'offense'>('defense');
    const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);

    const handleTypeToggle = (type: PokemonType) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(prev => prev.filter(t => t !== type));
        } else {
            if (selectedTypes.length < 2) {
                setSelectedTypes(prev => [...prev, type]);
            } else {
                // Replace second type if 2 already selected (simulate game limits of 2 types max)
                setSelectedTypes([selectedTypes[0], type]);
            }
        }
    };

    const defenseAnalysis = useMemo(() => {
        if (selectedTypes.length === 0 || mode !== 'defense') return null;
        return analyzeDefense(selectedTypes);
    }, [selectedTypes, mode]);

    const offenseAnalysis = useMemo(() => {
        if (selectedTypes.length === 0 || mode !== 'offense') return null;
        return analyzeOffense(selectedTypes);
    }, [selectedTypes, mode]);

    // View Helpers
    const renderList = (types: PokemonType[], title: string, multiplierStr: string) => {
        if (!types.length) return null;
        return (
            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-slate-400">{title} <span className="font-mono text-xs ml-1 bg-slate-700/50 px-1.5 py-0.5 rounded text-slate-300">{multiplierStr}</span></h3>
                <div className="flex flex-wrap gap-2">
                    {types.map(t => (
                        <TypeBadge key={t} type={t} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Card className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold font-pixel tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 drop-shadow-md">
                        {mode === 'defense' ? 'Defensas' : 'Ofensiva'}
                    </h2>
                    <p className="text-sm text-slate-400">
                        {mode === 'defense'
                            ? 'Selecciona 1 o 2 tipos para ver sus debilidades.'
                            : 'Selecciona tus tipos de ataque (STAB) para ver tu cobertura.'}
                    </p>
                </div>

                <div className="flex bg-slate-900 rounded-lg p-1 border-2 border-slate-700">
                    <button
                        className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all", mode === 'defense' ? "bg-slate-700 text-teal-400" : "text-slate-500 hover:text-slate-300")}
                        onClick={() => setMode('defense')}
                    >
                        <Shield className="w-4 h-4" /> Defensa
                    </button>
                    <button
                        className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all", mode === 'offense' ? "bg-slate-700 text-red-400" : "text-slate-500 hover:text-slate-300")}
                        onClick={() => setMode('offense')}
                    >
                        <Sword className="w-4 h-4" /> Ataque
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ALL_TYPES.map(type => (
                    <TypeBadge
                        key={type}
                        type={type}
                        selected={selectedTypes.includes(type) ? true : selectedTypes.length === 2 ? false : undefined}
                        onClick={() => handleTypeToggle(type)}
                    />
                ))}
            </div>

            <div className="min-h-[200px]">
                <AnimatePresence mode="popLayout">
                    {mode === 'defense' && defenseAnalysis && (
                        <motion.div
                            key="defense"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-6 grid gap-6 sm:grid-cols-2 rounded-xl bg-slate-900/50 p-4 border border-slate-700/50"
                        >
                            <div className="space-y-4">
                                {renderList(defenseAnalysis.weaknesses.filter(t => defenseAnalysis.multipliers[t] === 4), "Debilidad Doble", "x4")}
                                {renderList(defenseAnalysis.weaknesses.filter(t => defenseAnalysis.multipliers[t] === 2), "Débil Contra", "x2")}
                            </div>
                            <div className="space-y-4">
                                {renderList(defenseAnalysis.resistances.filter(t => defenseAnalysis.multipliers[t] === 0.5), "Resiste", "x0.5")}
                                {renderList(defenseAnalysis.resistances.filter(t => defenseAnalysis.multipliers[t] === 0.25), "Resistencia Doble", "x0.25")}
                                {renderList(defenseAnalysis.immunities, "Inmune A", "x0")}
                            </div>
                        </motion.div>
                    )}

                    {mode === 'offense' && offenseAnalysis && (
                        <motion.div
                            key="offense"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-6 grid gap-6 sm:grid-cols-2 rounded-xl bg-slate-900/50 p-4 border border-slate-700/50"
                        >
                            <div className="space-y-4">
                                {renderList(offenseAnalysis.superEffective, "Súper Efectivo Contra", "x2")}
                            </div>
                            <div className="space-y-4">
                                {renderList(offenseAnalysis.notVeryEffective, "Poco Efectivo Contra", "x0.5")}
                                {renderList(offenseAnalysis.noEffect, "No Afecta A", "x0")}
                            </div>
                        </motion.div>
                    )}

                    {selectedTypes.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-800/30 text-sm text-slate-500"
                        >
                            Elige al menos un tipo para ver el análisis.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    );
}
