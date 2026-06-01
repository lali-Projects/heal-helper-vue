// Minimal service worker for web push subscription
self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (event) => {
  let data = { title: "תזכורת תרופה", body: "הגיע הזמן לקחת את התרופה" };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch (_) {}
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body }));
});
