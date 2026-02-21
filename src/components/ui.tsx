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
                "rounded-2xl border-[3px] border-slate-700 bg-slate-800/90 p-6 shadow-[6px_6px_0_0_rgba(15,23,42,1)] backdrop-blur-md relative overflow-hidden",
                className
            )}
            {...props}
        />
    );
}
