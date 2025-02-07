import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function combineDateTime(dateString: string, timeString: string) {
  if (!dateString || !timeString) return null;

  dateString = dateString.split("T")[0];

  return `${dateString}T${timeString}:00`; // Format: YYYY-MM-DDTHH:MM:SS
}
