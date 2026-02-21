import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePokemonList, usePokemon } from './api';
import { analyzeDefense } from '../../utils/typeLogic';
import { TypeBadge } from '../../components/TypeBadge';
import { Card } from '../../components/ui';
import { Search, Loader2 } from 'lucide-react';
import type { PokemonType } from '../../types';

export function PokemonSearcher() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPokemonName, setSelectedPokemonName] = useState('');
    const { data: pokemonList, isLoading: isLoadingList } = usePokemonList();
    const { data: pokemon, isLoading: isLoadingPokemon } = usePokemon(selectedPokemonName);

    const matchedNames = useMemo(() => {
        if (!searchTerm || searchTerm.length < 2 || !pokemonList) return [];
        return pokemonList
            .filter(name => name.includes(searchTerm.toLowerCase()))
            .slice(0, 5);
    }, [searchTerm, pokemonList]);

    const analysis = useMemo(() => {
        if (!pokemon) return null;
        return analyzeDefense(pokemon.types);
    }, [pokemon]);

    const handleSelect = (name: string) => {
        setSelectedPokemonName(name);
        setSearchTerm('');
    };

    const renderMultipliers = (types: PokemonType[], title: string, multiplierStr: string) => {
        if (!types.length) return null;
        return (
            <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium text-slate-400">{title} <span className="font-mono text-xs ml-1 bg-slate-700/50 px-1.5 py-0.5 rounded text-slate-300">{multiplierStr}</span></h4>
                <div className="flex flex-wrap gap-2">
                    {types.map(t => <TypeBadge key={t} type={t} />)}
                </div>
            </div>
        );
    };

    return (
        <Card className="flex flex-col gap-6 relative">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Analizador de Especies</h2>
                <p className="text-sm text-slate-400">Busca cualquier Pokémon y descubre cuáles son sus peores pesadillas.</p>
            </div>

            <div className="relative z-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        placeholder={isLoadingList ? "Cargando Pokedex..." : "Escribe un Pokémon (ej: garchomp)"}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={isLoadingList}
                    />
                </div>

                <AnimatePresence>
                    {matchedNames.length > 0 && (
                        <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden"
                        >
                            {matchedNames.map(name => (
                                <li
                                    key={name}
                                    className="px-4 py-3 hover:bg-slate-700 cursor-pointer capitalize text-slate-200 transition-colors"
                                    onClick={() => handleSelect(name)}
                                >
                                    {name}
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>

            <div className="min-h-[250px] relative">
                {isLoadingPokemon && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {pokemon && analysis && !isLoadingPokemon && (
                        <motion.div
                            key={pokemon.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col sm:flex-row gap-8 items-start bg-slate-900/40 p-6 rounded-xl border border-slate-700/50"
                        >
                            <div className="flex flex-col items-center gap-4 min-w-[120px]">
                                <div className="w-32 h-32 relative group">
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl group-hover:bg-purple-500/30 transition-all" />
                                    <img
                                        src={pokemon.image}
                                        alt={pokemon.name}
                                        className="w-full h-full object-contain relative z-10 drop-shadow-2xl hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-lg font-bold capitalize text-slate-100">{pokemon.name}</h3>
                                <div className="flex gap-2">
                                    {pokemon.types.map(t => <TypeBadge key={t} type={t} />)}
                                </div>
                            </div>

                            <div className="flex-1 w-full grid gap-6 sm:grid-cols-2">
                                <div className="space-y-4">
                                    {renderMultipliers(analysis.weaknesses.filter(t => analysis.multipliers[t] === 4), "Puntos Críticos", "x4")}
                                    {renderMultipliers(analysis.weaknesses.filter(t => analysis.multipliers[t] === 2), "Debilidades", "x2")}
                                </div>
                                <div className="space-y-4">
                                    {renderMultipliers(analysis.resistances, "Resiste", "x0.5 - x0.25")}
                                    {renderMultipliers(analysis.immunities, "Inmune A", "x0")}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {!pokemon && !isLoadingPokemon && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-800/30 text-sm text-slate-500"
                        >
                            Busca un Pokémon para analizar sus debilidades.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </Card>
    );
}
