import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PokemonType } from '../../types';
import { TYPE_LABELS } from '../../data/typeEfficacy';
import { analyzeDefense } from '../../utils/typeLogic';
import { TypeBadge } from '../../components/TypeBadge';
import { Card } from '../../components/ui';

const ALL_TYPES = Object.keys(TYPE_LABELS) as PokemonType[];

export function TypeCalculator() {
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

    const analysis = useMemo(() => {
        if (selectedTypes.length === 0) return null;
        return analyzeDefense(selectedTypes);
    }, [selectedTypes]);

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
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Calculadora de Defensas</h2>
                <p className="text-sm text-slate-400">Selecciona 1 o 2 tipos para ver sus debilidades y resistencias clave como defensor.</p>
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
                    {analysis ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-6 grid gap-6 sm:grid-cols-2 rounded-xl bg-slate-900/50 p-4 border border-slate-700/50"
                        >
                            <div className="space-y-4">
                                {/* Weaknesses */}
                                {renderList(analysis.weaknesses.filter(t => analysis.multipliers[t] === 4), "Debilidad Doble", "x4")}
                                {renderList(analysis.weaknesses.filter(t => analysis.multipliers[t] === 2), "Débil Contra", "x2")}
                            </div>
                            <div className="space-y-4">
                                {/* Resistances & Immunities */}
                                {renderList(analysis.resistances.filter(t => analysis.multipliers[t] === 0.5), "Resiste", "x0.5")}
                                {renderList(analysis.resistances.filter(t => analysis.multipliers[t] === 0.25), "Resistencia Doble", "x0.25")}
                                {renderList(analysis.immunities, "Inmune A", "x0")}
                            </div>
                        </motion.div>
                    ) : (
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
