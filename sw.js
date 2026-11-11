// 요괴록: 앱 설치용 최소 서비스 워커 (항상 네트워크에서 받음 → 업데이트 바로 반영)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
