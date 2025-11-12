import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidMobile(mobile: string) {
  return /^[0-9]{7,15}$/.test(mobile);
}

export function getRedirectUri({
  provider,
  intent,
}: {
  provider: "google" | "facebook" | "wx" | "sina";
  intent: "register" | "login" | "bind";
}) {
  return `${window.location.origin}/social-callback?provider=${provider}&intent=${intent}`;
}
