/*
 * Self-destroying service worker.
 *
 * notesdiary used to ship a vite-plugin-pwa service worker. It has been removed
 * (portfolio, the sibling app whose Drive OAuth works, never had one). Visitors
 * who already loaded the old build still have that worker installed and
 * controlling their tab, serving a stale precache and interposing on the OAuth
 * popup round-trip. This stub is what their browser fetches on its next
 * service-worker update check: it unregisters itself, deletes every cache the
 * old worker left behind, and reloads open pages so they run the network copy
 * from here on. New visitors never register a worker at all.
 */
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.registration.unregister()
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      const clients = await self.clients.matchAll({ type: 'window' })
      for (const client of clients) client.navigate(client.url)
    })(),
  )
})
