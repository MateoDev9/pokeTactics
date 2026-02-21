import type { PokemonType } from '../types';
import { TYPE_LABELS, TYPE_COLORS } from '../data/typeEfficacy';
import { cn } from './ui';

interface TypeBadgeProps {
    type: PokemonType;
    className?: string;
    onClick?: () => void;
    selected?: boolean;
}

export function TypeBadge({ type, className, onClick, selected }: TypeBadgeProps) {
    const isClickable = !!onClick;

    return (
        <div
            onClick={onClick}
            className={cn(
                "inline-flex items-center justify-center rounded-sm px-2 sm:px-3 py-1 font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-white transition-all duration-200 min-w-[70px] sm:min-w-[85px] border-b-[3px] border-r-[3px] border-slate-900/50",
                isClickable && "cursor-pointer hover:-translate-y-1 hover:brightness-110 active:translate-y-0 active:border-b-0 active:border-r-0 active:mt-[3px] active:mr-[3px]",
                selected === false && "opacity-40 grayscale-[0.8]",
                className
            )}
            style={{
                backgroundColor: TYPE_COLORS[type],
                textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                boxShadow: selected ? `0 0 12px ${TYPE_COLORS[type]}80` : undefined
            }}
        >
            {TYPE_LABELS[type]}
        </div>
    );
}
