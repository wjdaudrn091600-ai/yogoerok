// 요괴록 서비스 워커 (11-19)
// · 그림 묶음·core 는 주소에 내용 지문(h=)이 붙어 있어 한 번 받으면 보관 → 업데이트 때 바뀐 묶음만 다시 받음
// · 음악·음성도 보관
// · 첫 화면·코드는 인터넷 먼저(업데이트 바로 반영), 안 되면 보관본 → 인터넷 없이도 켜짐
const CACHE = "yogoerok-1"; // 11-20 2.3: 그림 파일(img/…?h=)도 한 번 받으면 보관
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (u.origin !== location.origin) return;
  if (/version\.json$/.test(u.pathname)) return; // 업데이트 확인은 늘 인터넷
  const keep = u.searchParams.has("h") || /\/(bgm|voice)\//.test(u.pathname);
  e.respondWith(keep ? cacheFirst(req, u) : networkFirst(req, u));
});
async function putLatest(c, req, u, res) { // 같은 파일의 예전 판은 지움 (보관 용량이 계속 늘지 않게)
  try {
    for (const k of await c.keys(req, { ignoreSearch: true })) { const ku = new URL(k.url); if (ku.search !== u.search) await c.delete(k); } // 11-20 그림이 수천 장이라 같은 주소만 찾음
    await c.put(req, res);
  } catch (e) { }
}
async function cacheFirst(req, u) {
  const c = await caches.open(CACHE);
  const hit = await c.match(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (r.ok && r.status === 200) putLatest(c, req, u, r.clone());
  return r;
}
async function networkFirst(req, u) {
  const c = await caches.open(CACHE);
  try {
    const r = await fetch(req);
    if (r.ok && r.status === 200) putLatest(c, req, u, r.clone());
    return r;
  } catch (err) {
    const hit = (await c.match(req)) || (await c.match(req, { ignoreSearch: true })) || (req.mode === "navigate" ? await c.match(new URL("index.html", self.registration.scope).href, { ignoreSearch: true }) : null);
    if (hit) return hit;
    throw err;
  }
}
