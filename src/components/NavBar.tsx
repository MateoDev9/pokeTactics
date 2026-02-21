import { useState, useEffect } from 'react';
import { cn } from './ui';
import { Calculator, Search, ShieldAlert, Swords } from 'lucide-react';

export function NavBar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const navItems = [
        { id: 'searcher', label: 'Especies', icon: Search },
        { id: 'calculator', label: 'Calculadora', icon: Calculator },
        { id: 'versus', label: 'Versus', icon: Swords },
        { id: 'quiz', label: 'Quiz', icon: ShieldAlert },
    ];

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled ? "bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-lg py-3" : "bg-transparent py-5"
        )}>
            <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
                <div className="font-heading font-black text-xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-1">
                        <div className="w-full h-full border-2 border-white/20 rounded-full" />
                    </div>
                    PokeTactics
                </div>

                <div className="hidden md:flex gap-1 bg-slate-800/50 backdrop-blur-sm p-1 rounded-full border border-slate-700/50">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => scrollTo(item.id)}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
