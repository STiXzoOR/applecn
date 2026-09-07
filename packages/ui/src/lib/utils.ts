import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merges class names, resolving Tailwind conflicts so the last one wins. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
