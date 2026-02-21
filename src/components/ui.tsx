import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-3xl border border-slate-700/50 bg-slate-800/80 p-6 md:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden transition-all duration-300",
                className
            )}
            {...props}
        />
    );
}
