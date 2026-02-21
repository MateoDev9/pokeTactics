import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePokemonList, usePokemon } from './api';
import { analyzeDefense } from '../../utils/typeLogic';
import { TypeBadge } from '../../components/TypeBadge';
import { Card, cn } from '../../components/ui';
import { Search, Loader2, BarChart2 } from 'lucide-react';
import type { PokemonType } from '../../types';

export function PokemonSearcher() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPokemonName, setSelectedPokemonName] = useState('');
    const [showStats, setShowStats] = useState(false);
    const { data: pokemonList, isLoading: isLoadingList } = usePokemonList();
    const { data: pokemon, isLoading: isLoadingPokemon } = usePokemon(selectedPokemonName);

    const matchedNames = useMemo(() => {
        if (!searchTerm || searchTerm.length < 2 || !pokemonList) return [];
        return pokemonList
            .map((name, index) => ({ name, id: index + 1 }))
            .filter(p => p.name.includes(searchTerm.toLowerCase()))
            .slice(0, 5);
    }, [searchTerm, pokemonList]);

    const analysis = useMemo(() => {
        if (!pokemon) return null;
        return analyzeDefense(pokemon.types);
    }, [pokemon]);

    const handleSelect = (name: string) => {
        setSelectedPokemonName(name);
        setSearchTerm('');
        setShowStats(false);
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
                            className="absolute w-full mt-2 bg-slate-800 border-2 border-slate-700 rounded-lg shadow-xl overflow-hidden z-20 divide-y divide-slate-700/50"
                        >
                            {matchedNames.map((match: { name: string; id: number }) => (
                                <li
                                    key={match.name}
                                    className="px-4 py-2 hover:bg-slate-700 cursor-pointer capitalize text-slate-200 transition-colors flex items-center group"
                                    onClick={() => handleSelect(match.name)}
                                >
                                    <img
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${match.id}.png`}
                                        alt={match.name}
                                        className="w-10 h-10 object-contain drop-shadow-md mr-3 group-hover:scale-110 transition-transform"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    <span className="font-semibold">{match.name}</span>
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
                                <button
                                    onClick={() => setShowStats(!showStats)}
                                    className={cn("mt-2 text-xs flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold transition-colors border shadow-sm w-full", showStats ? "bg-purple-900/40 text-purple-300 border-purple-500/50" : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700")}
                                >
                                    <BarChart2 className="w-4 h-4" /> {showStats ? 'Ocultar Stats' : 'Ver Base Stats'}
                                </button>
                            </div>

                            <div className="flex-1 w-full flex flex-col gap-6">
                                <AnimatePresence>
                                    {showStats && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="w-full grid grid-cols-2 gap-x-6 gap-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 overflow-hidden"
                                        >
                                            {pokemon.stats.map((s: { name: string; value: number }) => (
                                                <div key={s.name} className="flex flex-col gap-1.5">
                                                    <div className="flex justify-between text-slate-400 capitalize text-xs">
                                                        <span>{s.name.replace('special-', 'sp. ')}</span>
                                                        <span className="font-bold text-slate-200">{s.value}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn("h-full rounded-full", s.value >= 100 ? "bg-teal-400" : s.value >= 70 ? "bg-amber-400" : "bg-rose-400")}
                                                            style={{ width: `${Math.min(100, (s.value / 150) * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-4">
                                        {renderMultipliers(analysis.weaknesses.filter(t => analysis.multipliers[t] === 4), "Puntos Críticos", "x4")}
                                        {renderMultipliers(analysis.weaknesses.filter(t => analysis.multipliers[t] === 2), "Debilidades", "x2")}
                                    </div>
                                    <div className="space-y-4">
                                        {renderMultipliers(analysis.resistances, "Resiste", "x0.5 - x0.25")}
                                        {renderMultipliers(analysis.immunities, "Inmune A", "x0")}
                                    </div>
                                </div>
                                {pokemon.moves && pokemon.moves.length > 0 && (
                                    <div className="mt-2 space-y-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                        <h4 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                            Movimientos Destacados
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {pokemon.moves.map((move: string) => (
                                                <span key={move} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold capitalize rounded-md border border-slate-700">
                                                    {move}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
