/* 旅費帳本 — 最小 service worker
   只負責快取 app shell（index.html / manifest / icons），
   讓瀏覽器判定可安裝，並讓離線時仍能打開網頁本身。
   實際記帳資料的離線讀寫由 Firestore 的 enablePersistence 負責，與此無關，
   所以這裡刻意只處理同源的靜態檔案，其餘（Firebase/Google 等）一律略過不攔截。 */
const CACHE_NAME = 'travel-ledger-shell-v1';
const SHELL_FILES = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // 不攔截 Firebase/Google 等外部請求

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request)
        .then((resp) => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
