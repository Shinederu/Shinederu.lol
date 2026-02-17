import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Permet de merge des classes Tailwind
export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
}
