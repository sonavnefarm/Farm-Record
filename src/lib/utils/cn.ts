import { clsx, type ClassValue } from "clsx";

/**
 * Combine class names conditionally. Thin wrapper around clsx so call sites
 * read `cn("a", condition && "b")` consistently across the codebase.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
