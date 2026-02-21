import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamStore } from './store';
import { usePokemonList } from '../pokemonSearcher/api';
import { analyzeDefense } from '../../utils/typeLogic';
import type { PokemonType } from '../../types';
import { TYPE_LABELS } from '../../data/typeEfficacy';
import { TypeBadge } from '../../components/TypeBadge';
import { Card } from '../../components/ui';
import { Plus, X, ShieldAlert, ShieldCheck } from 'lucide-react';

const ALL_TYPES = Object.keys(TYPE_LABELS) as PokemonType[];

export function TeamBuilder() {
    const { team, addMember, removeMember } = useTeamStore();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: pokemonList } = usePokemonList();
    const matchedNames = useMemo(() => {
        if (!searchTerm || searchTerm.length < 2 || !pokemonList) return [];
        return pokemonList.filter(name => name.includes(searchTerm.toLowerCase())).slice(0, 5);
    }, [searchTerm, pokemonList]);

    // We need a way to fetch and add directly. For simplicity, we just fetch on select.
    // Actually, we can't easily fetch conditionally inside an action without an async thunk or manual fetch.
    const handleAdd = async (name: string) => {
        setSearchTerm('');
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
            const data = await res.json();
            addMember({
                name: data.name,
                types: data.types.map((t: any) => t.type.name),
                image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default
            });
        } catch (err) {
            console.error(err);
        }
    };

    const coverage = useMemo(() => {
        if (team.length === 0) return null;

        // For each type, how many team members are weak/resistant to it?
        const weaknessesByType: Record<PokemonType, number> = {} as any;
        const resistancesByType: Record<PokemonType, number> = {} as any;

        ALL_TYPES.forEach(t => {
            weaknessesByType[t] = 0;
            resistancesByType[t] = 0;
        });

        team.forEach(member => {
            const analysis = analyzeDefense(member.types);
            analysis.weaknesses.forEach(w => weaknessesByType[w]++);
            analysis.resistances.forEach(r => resistancesByType[r]++);
            analysis.immunities.forEach(i => resistancesByType[i]++);
        });

        // A critical threat is a type that 3+ members are weak to, and 0 or 1 resist.
        const threats = ALL_TYPES.filter(t => weaknessesByType[t] >= 2 && resistancesByType[t] === 0);
        const covered = ALL_TYPES.filter(t => resistancesByType[t] >= 3 && weaknessesByType[t] <= 1);

        return { weaknessesByType, resistancesByType, threats, covered };
    }, [team]);

    return (
        <Card className="flex flex-col gap-6 border-amber-700/50 bg-amber-900/10">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Analizador de Equipos</h2>
                <p className="text-sm text-slate-400">Añade hasta 6 Pokémon para analizar la cobertura defensiva global.</p>
            </div>

            {/* Team Slots */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <AnimatePresence>
                    {team.map((member) => (
                        <motion.div
                            key={member.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            layout
                            className="relative aspect-square rounded-xl bg-slate-800/50 border border-slate-700 flex flex-col items-center justify-center p-2 group"
                        >
                            <button
                                onClick={() => removeMember(member.id)}
                                className="absolute top-1 right-1 p-1 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/40"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <img src={member.image} alt={member.name} className="w-16 h-16 object-contain filter drop-shadow-md" />
                            <span className="text-xs font-bold capitalize text-slate-300 mt-2 truncate w-full text-center">{member.name}</span>
                        </motion.div>
                    ))}
                    {team.length < 6 && (
                        <motion.div
                            layout
                            className="relative aspect-square rounded-xl bg-slate-900/50 border border-dashed border-slate-600 flex flex-col items-center justify-center min-h-[120px]"
                        >
                            <Plus className="w-8 h-8 text-slate-600 mb-2" />
                            <div className="w-full px-2 relative">
                                <input
                                    type="text"
                                    placeholder="Añadir..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-800 text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-slate-700"
                                />
                                {matchedNames.length > 0 && (
                                    <div className="absolute top-full left-0 w-[150%] z-20 mt-1 bg-slate-800 border border-slate-700 rounded shadow-xl overflow-hidden text-xs">
                                        {matchedNames.map(name => (
                                            <div
                                                key={name}
                                                onClick={() => handleAdd(name)}
                                                className="px-3 py-2 hover:bg-slate-700 cursor-pointer capitalize text-slate-200"
                                            >
                                                {name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {coverage && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="grid gap-6 sm:grid-cols-2 mt-4 p-4 bg-slate-900/40 rounded-xl"
                >
                    <div className="flex flex-col gap-3">
                        <div className="flex border-b border-red-900/50 pb-2 items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-red-400" />
                            <h3 className="text-sm font-bold text-slate-200">Amenazas Críticas del Equipo</h3>
                        </div>
                        {coverage.threats.length > 0 ? (
                            <p className="text-xs text-slate-400 mb-2">Tu equipo sufre mucho daño contra estos tipos y no tiene resistencias para cubrirlos:</p>
                        ) : (
                            <p className="text-xs text-green-400 mb-2">¡No hay debilidades críticas sin cubrir!</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {coverage.threats.map(t => <TypeBadge key={t} type={t} />)}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex border-b border-green-900/50 pb-2 items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-400" />
                            <h3 className="text-sm font-bold text-slate-200">Cobertura Sólida</h3>
                        </div>
                        {coverage.covered.length > 0 ? (
                            <p className="text-xs text-slate-400 mb-2">Tu equipo recibe muy poco daño de estos tipos:</p>
                        ) : (
                            <p className="text-xs text-slate-500 mb-2">Añade más Pokémon para mejorar tus defensas combinadas.</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {coverage.covered.map(t => <TypeBadge key={t} type={t} />)}
                        </div>
                    </div>
                </motion.div>
            )}

        </Card>
    );
}
