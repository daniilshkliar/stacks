import { RouteMatchCallbackOptions, clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

declare const self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

const manifestMatchCallback = ({ request }: RouteMatchCallbackOptions) =>
  request.destination === "manifest";

const pagesMatchCallback = ({ request }: RouteMatchCallbackOptions) =>
  request.mode === "navigate";

const staticResourcesMatchCallback = ({ request }: RouteMatchCallbackOptions) =>
  request.destination === "style" ||
  request.destination === "script" ||
  request.destination === "worker";

const imagesMatchCallback = ({ request }: RouteMatchCallbackOptions) =>
  request.destination === "image";

const fontsMatchCallback = ({ request }: RouteMatchCallbackOptions) =>
  request.destination === "font";

registerRoute(
  manifestMatchCallback,
  new CacheFirst({
    cacheName: "manifest",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  pagesMatchCallback,
  new CacheFirst({
    cacheName: "pages",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  staticResourcesMatchCallback,
  new CacheFirst({
    cacheName: "static-resources",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  imagesMatchCallback,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 150,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  fontsMatchCallback,
  new CacheFirst({
    cacheName: "fonts",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

self.skipWaiting();
clientsClaim();
