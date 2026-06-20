import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// The "cn" helper automatically resolves Tailwind class conflicts gracefully
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}