Great questions! Let me break down PWAs systematically.

## What is a PWA?

A Progressive Web App is just a regular website with **three extra features** that make it feel more like a native app:

1. **Works offline** (via Service Workers)
2. **Can be "installed"** to your home screen (via a manifest file)
3. **Feels like an app** (full-screen, no browser chrome)

That's it. It's not a different technology - it's regular HTML/CSS/JS with some browser APIs added on top.

## The Timeline

**2015**: Google coined the term "Progressive Web App" at Chrome Dev Summit
- Google engineer Alex Russell wrote the defining blog post
- This was primarily a **Google/Chrome initiative**, not W3C-led
- Google was frustrated that web apps couldn't compete with native apps

**2016-2017**: Service Workers became stable in Chrome, then Firefox
- Apple (Safari) resisted initially, seeing it as competition to the App Store

**2018**: Apple finally added Service Worker support to iOS Safari
- But with significant limitations (still true today)

**2019-2024**: Gradual improvement in support
- Microsoft embraced PWAs heavily (you can publish them in Windows Store)
- Apple slowly improved support but remains the weakest link

## Browser Politics

This WAS a vendor-driven initiative, not standards-first:
- **Google**: Enthusiastic (competes with native Android apps)
- **Microsoft**: Very supportive (revived Edge with Chromium)
- **Mozilla**: Supportive (aligns with open web philosophy)
- **Apple**: Reluctant (threatens App Store revenue model)

The W3C standardized the technologies after browsers implemented them.

## Essential Files & What They Do

### 1. Your Normal HTML/CSS/JS Files
Just regular web files - nothing special here.

### 2. `manifest.json` (Required for installation)
```json
{
  "name": "Video Practice Looper",
  "short_name": "Looper",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**What it does**: Tells the browser how to install your app (name, icon, colors, whether to show browser UI)

### 3. `service-worker.js` (Required for offline functionality)
This is where the magic happens.

## What is a Service Worker?

Think of it as a **programmable proxy** that sits between your web page and the network.

```
[Your Web Page] ←→ [Service Worker] ←→ [Network/Cache]
```

**Key insight**: It's a JavaScript file that runs in the background, separate from your web page. It can:
- Intercept network requests
- Decide whether to fetch from network or serve from cache
- Cache files for offline use
- Run even when your page is closed (for push notifications)

## Minimal PWA Example

Let me show you the absolute minimum:

### index.html
```html
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="manifest" href="manifest.json">
  <title>Minimal PWA</title>
</head>
<body>
  <h1>Hello PWA</h1>
  <p>This works offline!</p>
  
  <script>
    // Register the service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered', reg))
        .catch(err => console.log('SW failed', err));
    }
  </script>
</body>
</html>
```

### sw.js (Service Worker)
```javascript
const CACHE_NAME = 'v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css'
];

// Install: Cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

// Fetch: Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### manifest.json
```json
{
  "name": "Minimal PWA",
  "short_name": "MinPWA",
  "start_url": "/",
  "display": "standalone",
  "icons": [{"src": "icon.png", "sizes": "192x192", "type": "image/png"}]
}
```

That's the complete PWA! Three files total.

## Your Key Question: How Does File Storage Work?

You're exactly right to be confused - this is the tricky part.

### The Problem
On a desktop server: you have a file system, can add new videos anytime
On a PWA: **No direct file system access** (for security reasons)

### The Solution: Multiple Storage Options

**1. Cache API** (what Service Workers use)
```javascript
// In your service worker
const cache = await caches.open('videos');
await cache.put('/video1.mp4', response);
```
- Good for: Caching resources fetched from network
- NOT good for: User-uploaded content
- Limitation: You need to fetch from somewhere first

**2. IndexedDB** (Browser database)
```javascript
// In your main app
const db = await openDB('my-videos');
await db.put('videos', videoBlob, 'my-video-1');
```
- Good for: Storing large files (user uploads)
- Persists across sessions
- Can store Blobs (video files)

**3. File System Access API** (NEW, limited support)
```javascript
// Pick a directory on user's device
const dirHandle = await window.showDirectoryPicker();
const fileHandle = await dirHandle.getFileHandle('video.mp4');
const file = await fileHandle.getFile();
```
- Good for: Accessing actual device files
- **Best for your use case!**
- Limitation: Not supported on iOS Safari (yet)

## How Your Video App Would Work

### Scenario: Adding New Videos

**On Desktop (Chrome/Edge):**
1. User picks a folder with File System Access API
2. App reads videos directly from that folder
3. Works completely offline
4. No "uploading" - direct access to local files

**On iPhone (Safari):**
1. User picks video with `<input type="file">`
2. App stores video in IndexedDB
3. Video is now "inside" the browser's storage
4. Works offline from there

### The iPhone Reality Check

iOS Safari has **severe PWA limitations**:
- Service Workers clear cache after ~2 weeks of non-use
- Storage quota is limited (~50MB-1GB depending on device)
- No background sync
- No push notifications (recently added, but limited)
- File System Access API not supported

**This is intentional** - Apple wants you to build native iOS apps instead.

## Does PWA Check for Internet?

Sort of. The Service Worker intercepts EVERY request and you decide:

```javascript
// Strategy 1: Cache First (offline-first)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
      // Try cache first, fallback to network
  );
});

// Strategy 2: Network First (online-first)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
      // Try network first, fallback to cache if offline
  );
});
```

## Managing the Cache

Service Workers don't automatically update. You control this:

```javascript
const VERSION = 'v2'; // Change this to bust cache

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  // Delete old caches
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== VERSION)
            .map(key => caches.delete(key))
      );
    })
  );
});
```

## When NOT to Use a PWA

**Use native app instead when:**
- Need deep OS integration (contacts, calendar, bluetooth)
- Need reliable background processing
- Need access to all device hardware
- iOS is your primary platform (PWA support is weak)
- Need to be in app stores for discovery/monetization

**Use regular web app (no PWA features) when:**
- Don't need offline support
- Content changes frequently (news sites)
- SEO is critical (though PWAs can be indexed)

**PWAs are perfect for:**
- Tools and utilities (your use case!)
- Content you want available offline
- Apps where you control distribution (not relying on app stores)
- Cross-platform without maintaining multiple codebases

## For Your Video Practice App

Given what you want, I'd recommend:

**Phase 1**: Build as regular web app
- Works on desktop perfectly
- Use File System Access API on Chrome
- Test your concepts

**Phase 2**: Add PWA features
- Add manifest.json for "install" button
- Add Service Worker for offline HTML/CSS/JS
- Use IndexedDB for video storage on mobile

**Reality check for iPhone**: 
You'll likely need to either:
1. Accept limited storage (just a few videos at a time)
2. Build a companion native iOS app eventually
3. Use a hybrid approach (store videos in iCloud, stream when online)

The good news: starting with a PWA gets you 90% there, and you learn everything you'd need to know to build native later.

Want me to build you a working example that demonstrates Service Workers and IndexedDB with a simple video looper?