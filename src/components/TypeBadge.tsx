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
                "inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200",
                isClickable && "cursor-pointer hover:scale-105 hover:shadow-md",
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
