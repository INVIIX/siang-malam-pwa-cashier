/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';

// eslint-disable-next-line no-restricted-globals
declare const self: ServiceWorkerGlobalScope;

// Precache all static assets injected by VitePWA (self.__WB_MANIFEST will be replaced at build time)
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches
cleanupOutdatedCaches();

// Redirect SPA routes to index.html (except API or auth routes)
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler, {
    denylist: [/^\/api/, /^\/auth\//],
});
registerRoute(navigationRoute);

// Enhance navigation: focus existing PWA window if already open
self.addEventListener('fetch', (event: FetchEvent) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                const clientList = await self.clients.matchAll({
                    type: 'window',
                    includeUncontrolled: true,
                });

                for (const client of clientList) {
                    const url = new URL(client.url);
                    if (url.origin === self.location.origin && 'focus' in client) {
                        client.focus();
                        break;
                    }
                }

                return fetch(event.request);
            })()
        );
    }
});
