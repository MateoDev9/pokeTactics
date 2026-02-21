import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePokemonList, usePokemon } from '../pokemonSearcher/api';
import { analyzeDefense } from '../../utils/typeLogic';
import { TypeBadge } from '../../components/TypeBadge';
import { Card, cn } from '../../components/ui';
import { Search, Loader2, Swords } from 'lucide-react';

export function Versus() {
    const [searchLeft, setSearchLeft] = useState('');
    const [searchRight, setSearchRight] = useState('');
    const [selectedLeft, setSelectedLeft] = useState('');
    const [selectedRight, setSelectedRight] = useState('');

    const { data: pokemonList, isLoading: isLoadingList } = usePokemonList();
    const { data: pLeft, isLoading: isLoadingLeft } = usePokemon(selectedLeft);
    const { data: pRight, isLoading: isLoadingRight } = usePokemon(selectedRight);

    const matchLeft = useMemo(() => {
        if (!searchLeft || searchLeft.length < 2 || !pokemonList) return [];
        return pokemonList
            .map((name, index) => ({ name, id: index + 1 }))
            .filter(p => p.name.includes(searchLeft.toLowerCase()))
            .slice(0, 5);
    }, [searchLeft, pokemonList]);

    const matchRight = useMemo(() => {
        if (!searchRight || searchRight.length < 2 || !pokemonList) return [];
        return pokemonList
            .map((name, index) => ({ name, id: index + 1 }))
            .filter(p => p.name.includes(searchRight.toLowerCase()))
            .slice(0, 5);
    }, [searchRight, pokemonList]);

    const handleSelectLeft = (name: string) => {
        setSelectedLeft(name);
        setSearchLeft('');
    };

    const handleSelectRight = (name: string) => {
        setSelectedRight(name);
        setSearchRight('');
    };

    const leftAnalysis = useMemo(() => pLeft ? analyzeDefense(pLeft.types) : null, [pLeft]);
    const rightAnalysis = useMemo(() => pRight ? analyzeDefense(pRight.types) : null, [pRight]);

    const compareStats = (statIndex: number) => {
        if (!pLeft || !pRight) return 0;
        return pLeft.stats[statIndex].value - pRight.stats[statIndex].value;
    };

    return (
        <Card className="flex flex-col gap-8 relative items-center">
            <div className="flex flex-col gap-2 w-full">
                <h2 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
                    <Swords className="w-5 h-5 text-red-500" />
                    Versus
                </h2>
                <p className="text-sm text-slate-400">Compara las estadísticas base y la ventaja elemental entre dos especies.</p>
            </div>

            {/* Selectores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full mt-4">
                {/* Selector Izquierdo */}
                <div className="relative z-20">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                            type="text"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-all font-bold"
                            placeholder={isLoadingList ? "Cargando..." : "Pokémon 1"}
                            value={searchLeft}
                            onChange={(e) => setSearchLeft(e.target.value)}
                        />
                    </div>
                    {matchLeft.length > 0 && (
                        <ul className="absolute w-full mt-2 bg-slate-800 border-[3px] border-slate-700 rounded-lg shadow-xl overflow-hidden z-30">
                            {matchLeft.map(match => (
                                <li key={match.name} className="px-4 py-2 hover:bg-slate-700 cursor-pointer capitalize flex items-center" onClick={() => handleSelectLeft(match.name)}>
                                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${match.id}.png`} alt={match.name} className="w-8 h-8 mr-2" />
                                    {match.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* VS Badge en Desktop */}
                <div className="hidden md:flex absolute left-1/2 top-[160px] -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-slate-900 border-[3px] border-slate-700 rounded-full items-center justify-center font-black text-slate-400 shadow-xl">
                    VS
                </div>

                {/* Selector Derecho */}
                <div className="relative z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                            type="text"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all font-bold text-right"
                            placeholder={isLoadingList ? "Cargando..." : "Pokémon 2"}
                            value={searchRight}
                            onChange={(e) => setSearchRight(e.target.value)}
                        />
                    </div>
                    {matchRight.length > 0 && (
                        <ul className="absolute w-full mt-2 bg-slate-800 border-[3px] border-slate-700 rounded-lg shadow-xl overflow-hidden z-30 text-right">
                            {matchRight.map(match => (
                                <li key={match.name} className="px-4 py-2 hover:bg-slate-700 cursor-pointer capitalize flex flex-row-reverse items-center" onClick={() => handleSelectRight(match.name)}>
                                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${match.id}.png`} alt={match.name} className="w-8 h-8 ml-2" />
                                    {match.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Arena */}
            <div className="w-full min-h-[300px] mt-8 bg-slate-900/50 rounded-2xl border-[3px] border-slate-700/50 p-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative overflow-hidden">
                {!pLeft && !pRight && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-bold opacity-50">
                        ZONA DE COMBATE
                    </div>
                )}

                {/* Fighter 1 */}
                <div className="flex flex-col items-center gap-4 w-full md:w-1/3 z-10">
                    {isLoadingLeft && <Loader2 className="w-8 h-8 text-red-500 animate-spin" />}
                    {pLeft && !isLoadingLeft && (
                        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center">
                            <h3 className="text-xl font-bold capitalize mb-2">{pLeft.name}</h3>
                            <div className="relative group w-40 h-40">
                                <div className="absolute inset-x-8 bottom-0 h-4 bg-black/30 rounded-[100%] blur-sm" />
                                <img src={pLeft.image} alt={pLeft.name} className="w-full h-full object-contain relative z-10 drop-shadow-2xl hover:scale-110 transition-transform -scale-x-100" />
                            </div>
                            <div className="flex gap-2 mt-4">
                                {pLeft.types.map(t => <TypeBadge key={t} type={t} />)}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Arena Stats Comparison */}
                <div className="flex-1 w-full bg-slate-950/50 rounded-xl px-4 py-8 border border-slate-700/50 flex flex-col justify-center items-center gap-4 z-10 min-h-[300px]">
                    {pLeft && pRight ? pLeft.stats.map((s, i) => {
                        const diff = compareStats(i);
                        return (
                            <div key={s.name} className="flex flex-col gap-1.5 w-full max-w-[280px]">
                                <div className="flex justify-between items-center w-full">
                                    <span className={cn("text-xs font-bold font-mono", diff > 0 ? "text-red-400" : "text-slate-500")}>{pLeft.stats[i].value}</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-sans">{s.name.replace('special-', 'sp. ')}</span>
                                    <span className={cn("text-xs font-bold font-mono", diff < 0 ? "text-blue-400" : "text-slate-500")}>{pRight.stats[i].value}</span>
                                </div>
                                <div className="flex w-full h-2 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-slate-800">
                                    <div className="w-1/2 h-full flex justify-end">
                                        <div className={cn("h-full transition-all duration-500 ease-out", diff > 0 ? "bg-red-500" : "bg-slate-700")} style={{ width: `${Math.min(100, (pLeft.stats[i].value / 255) * 100)}%` }} />
                                    </div>
                                    <div className="w-[2px] bg-slate-950 h-full z-10" />
                                    <div className="w-1/2 h-full flex justify-start">
                                        <div className={cn("h-full transition-all duration-500 ease-out", diff < 0 ? "bg-blue-500" : "bg-slate-700")} style={{ width: `${Math.min(100, (pRight.stats[i].value / 255) * 100)}%` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                            <Swords className="w-8 h-8 opacity-20" />
                            Selecciona a ambos Pokémon para compararlos.
                        </div>
                    )}

                    {/* Ventaja de tipos */}
                    {pLeft && pRight && leftAnalysis && rightAnalysis && (
                        <div className="mt-6 pt-4 border-t border-slate-800 w-full text-center text-xs flex flex-col gap-1.5 font-bold uppercase tracking-wide">
                            {pLeft.types.some(t => rightAnalysis.weaknesses.includes(t)) && (
                                <div className="text-red-400 drop-shadow-sm flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    {pLeft.name} tiene ventajas contra {pRight.name}
                                </div>
                            )}
                            {pRight.types.some(t => leftAnalysis.weaknesses.includes(t)) && (
                                <div className="text-blue-400 drop-shadow-sm flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    {pRight.name} tiene ventajas contra {pLeft.name}
                                </div>
                            )}
                            {!pLeft.types.some(t => rightAnalysis.weaknesses.includes(t)) && !pRight.types.some(t => leftAnalysis.weaknesses.includes(t)) && (
                                <div className="text-slate-500">Combate Neutro</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Fighter 2 */}
                <div className="flex flex-col items-center gap-4 w-full md:w-1/3 z-10">
                    {isLoadingRight && <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />}
                    {pRight && !isLoadingRight && (
                        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center">
                            <h3 className="text-xl font-bold capitalize mb-2">{pRight.name}</h3>
                            <div className="relative group w-40 h-40">
                                <div className="absolute inset-x-8 bottom-0 h-4 bg-black/30 rounded-[100%] blur-sm" />
                                <img src={pRight.image} alt={pRight.name} className="w-full h-full object-contain relative z-10 drop-shadow-2xl hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex gap-2 mt-4">
                                {pRight.types.map(t => <TypeBadge key={t} type={t} />)}
                            </div>
                        </motion.div>
                    )}
                </div>

            </div>
        </Card>
    );
}
