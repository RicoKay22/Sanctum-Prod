/// <reference lib="webworker" />
// The line above brings in worker-only types (like ServiceWorkerGlobalScope)
// for this file only — it doesn't touch tsconfig.json's project-wide "lib",
// which needs to stay "dom" for every other file in the app.

import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

// Lets TypeScript know about the precache manifest Serwist injects at
// build time — without this, __SW_MANIFEST below is a type error.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

// This is the heart of "offline works" for Sanctum: skipWaiting +
// clientsClaim means an updated app takes over immediately rather than
// waiting for every open tab to close — important for a tool a media
// team might have open for weeks between Sundays.
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
