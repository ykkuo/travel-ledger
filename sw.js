/* 旅費帳本 — 最小 service worker
   只負責快取 app shell（index.html / manifest / icons），
   讓瀏覽器判定可安裝，並讓離線時仍能打開網頁本身。
   實際記帳資料的離線讀寫由 Firestore 的 enablePersistence 負責，與此無關，
   所以這裡刻意只處理同源的靜態檔案，其餘（Firebase/Google 等）一律略過不攔截。
   注意：導覽請求（index.html／App shell 本身）改為「網路優先」，確保每次部署後
   使用者一打開就是最新版；只有在離線抓不到網路時才退回快取。其餘靜態資源
   （manifest/icons）維持「快取優先＋背景更新」，兼顧離線可用與載入速度。 */
const CACHE_NAME = 'travel-ledger-shell-v2';
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

  const isAppShellDoc = e.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html');

  if (isAppShellDoc) {
    // 網路優先：拿到新版就直接用、同時更新快取；離線時才退回快取版本。
    e.respondWith(
      fetch(e.request)
        .then((resp) => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return resp;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

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
