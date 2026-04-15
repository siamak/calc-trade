"use client";

/**
 * Re-exports the PWA hook from the central PWAProvider context.
 *
 * All PWA state (online status, install prompt, update detection, SW
 * registration) lives in <PWAProvider> which is mounted once in the locale
 * layout.  This hook is the stable public API for consuming that state in any
 * client component — callers don't need to know about the context directly.
 */
export { usePWAContext as usePWA } from "@/components/providers/pwa-provider";
