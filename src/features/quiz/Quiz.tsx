import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PokemonType } from '../../types';
import { TYPE_LABELS } from '../../data/typeEfficacy';
import { analyzeDefense } from '../../utils/typeLogic';
import { TypeBadge } from '../../components/TypeBadge';
import { Card } from '../../components/ui';
import { cn } from '../../components/ui';

const ALL_TYPES = Object.keys(TYPE_LABELS) as PokemonType[];

interface Question {
    defenderType: PokemonType;
    correctWeakness: PokemonType[]; // Types that do x2 or x4 to the defender
    options: PokemonType[]; // For easy mode
}

function generateQuestion(): Question {
    const defenderType = ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)];
    const analysis = analyzeDefense([defenderType]);
    const weaknesses = analysis.weaknesses;

    // Pick 3 random types, plus 1 correct weakness
    const optionsSet = new Set<PokemonType>();
    if (weaknesses.length > 0) {
        optionsSet.add(weaknesses[Math.floor(Math.random() * weaknesses.length)]);
    }

    while (optionsSet.size < 4 && optionsSet.size < ALL_TYPES.length) {
        const randomType = ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)];
        optionsSet.add(randomType);
    }

    return {
        defenderType,
        correctWeakness: weaknesses,
        options: Array.from(optionsSet).sort(() => Math.random() - 0.5)
    };
}

export function Quiz() {
    const [mode, setMode] = useState<'easy' | 'hard'>('easy');
    const [question, setQuestion] = useState<Question | null>(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [hardInput, setHardInput] = useState('');

    const startQuiz = () => {
        setScore(0);
        setFeedback(null);
        setHardInput('');
        setQuestion(generateQuestion());
    };

    const handleAnswerEasy = (selected: PokemonType) => {
        if (!question) return;
        const isCorrect = question.correctWeakness.includes(selected);
        submitAnswer(isCorrect);
    };

    const handleAnswerHard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question || !hardInput.trim()) return;

        // Find if the translated or eng name matches any weakness
        const normalizedInput = hardInput.trim().toLowerCase();

        const isCorrect = question.correctWeakness.some(w =>
            t(w).toLowerCase() === normalizedInput || w.toLowerCase() === normalizedInput
        );

        submitAnswer(isCorrect);
    };

    const submitAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(s => s + 1);
            setFeedback('correct');
        } else {
            setScore(0);
            setFeedback('wrong');
        }

        setTimeout(() => {
            setFeedback(null);
            setHardInput('');
            setQuestion(generateQuestion());
        }, 1500);
    };

    const t = (type: PokemonType) => TYPE_LABELS[type];

    return (
        <Card className="flex flex-col gap-6 mt-12 bg-slate-800/90 border-blue-500/30">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b-2 border-slate-700/50 pb-4">
                <div>
                    <h2 className="text-xl font-bold font-pixel text-blue-400">Matchup Quiz</h2>
                    <p className="text-sm text-slate-400">Demuestra tus conocimientos del Meta.</p>
                </div>

                <div className="flex bg-slate-900 rounded-lg p-1 border-2 border-slate-700">
                    <button
                        className={cn("px-4 py-2 rounded-md font-bold text-xs transition-colors", mode === 'easy' ? "bg-slate-700 text-blue-300" : "text-slate-500")}
                        onClick={() => { setMode('easy'); setQuestion(null); }}
                    >
                        Modo Fácil
                    </button>
                    <button
                        className={cn("px-4 py-2 rounded-md font-bold text-xs transition-colors", mode === 'hard' ? "bg-slate-700 text-purple-300" : "text-slate-500")}
                        onClick={() => { setMode('hard'); setQuestion(null); }}
                    >
                        Modo Difícil
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                {!question ? (
                    <button
                        onClick={startQuiz}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-pixel text-lg py-4 px-8 rounded-xl shadow-[0_4px_0_rgb(30,58,138)] hover:-translate-y-1 hover:shadow-[0_6px_0_rgb(30,58,138)] active:translate-y-1 active:shadow-[0_0px_0_rgb(30,58,138)] transition-all"
                    >
                        INICIAR TEST
                    </button>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={question.defenderType + score}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center w-full max-w-md gap-8"
                        >
                            <div className="flex justify-between w-full text-slate-400 font-pixel text-xs">
                                <span>SCORE: <span className="text-green-400">{score}</span></span>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <h3 className="text-lg text-slate-300">¿Qué tipo es **Súper Efectivo** contra:</h3>
                                <TypeBadge type={question.defenderType} className="scale-125" />
                                <span className="text-2xl mt-2 font-bold select-none">?</span>
                            </div>

                            {feedback === 'correct' && <div className="text-green-400 font-bold text-xl animate-bounce">¡Súper Efectivo!</div>}
                            {feedback === 'wrong' && <div className="text-red-400 font-bold text-xl">No es muy efectivo...</div>}

                            {mode === 'easy' && feedback === null && (
                                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                    {question.options.map(opt => (
                                        <TypeBadge
                                            key={opt}
                                            type={opt}
                                            onClick={() => handleAnswerEasy(opt)}
                                            className="w-full py-3 text-base h-12 shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all"
                                        />
                                    ))}
                                </div>
                            )}

                            {mode === 'hard' && feedback === null && (
                                <form onSubmit={handleAnswerHard} className="w-full mt-4 flex gap-2">
                                    <input
                                        type="text"
                                        value={hardInput}
                                        onChange={e => setHardInput(e.target.value)}
                                        placeholder="Escribe el tipo (ej: fuego)"
                                        className="flex-1 bg-slate-900 border-2 border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-500 p-2 font-bold"
                                        autoFocus
                                    />
                                    <button type="submit" className="bg-purple-600 hover:bg-purple-500 rounded-lg px-6 font-bold text-white transition-colors">
                                        Ok
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </Card>
    );
}
