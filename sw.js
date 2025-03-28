// Ім'я кешу, який використовуватиметься для збереження ресурсів
const CACHE_NAME = "pwa-cache-v1";

// Масив ресурсів, які будуть кешовані при встановленні Service Worker 
// ви кешуєте всі свої файли
const ASSETS = [
  "/",
  "/students.html",
  "/dashboard.html",
  "/tasks.html",
  "/messages.html",
  "/styles.css",
  "/script.js",
  "/icons/avatar.png",
  "/icons/bell.png",
  "/icons/delete.png",
  "/icons/deleteWhite.png",
  "/icons/email.png",
  "/icons/menu.png",
  "/icons/pen.png",
  "/icons/penWhite.png",
  "/icons/personAvatar.png",
  "/icons/plus.png",
  "/icons/profile.png"
];

// Подія встановлення Service Worker
// Відбувається при першому запуску або коли SW оновлюється
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching resources...");// логування не обовязкове
      // Додаємо файли до кешу, якщо якийсь файл не вдасться завантажити, обробляємо помилку
      return cache.addAll(ASSETS).catch(console.error);
    })
  );
});

// Подія обробки запитів від клієнта (браузера)
// Якщо файл є в кеші – повертаємо його, інакше робимо запит до мережі
self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => caches.match("./students.html")); // Якщо запит не вдався, повертаємо головну сторінку
      })
    );
  });
  

// Подія активації Service Worker
// Видаляє старі кеші, які більше не використовуються
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME) // Знаходимо старі кеші
          .map((key) => caches.delete(key))   // Видаляємо їх
      );
    }).then(() => {
      console.log("New service worker activated.");
      return self.clients.claim(); // Переключаємо новий SW для всіх вкладок
    })
  );
});
