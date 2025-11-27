You're absolutely right - this is where Capacitor becomes a pain and PWAs shine!

## The Distribution Problem

### PWA Distribution
```
You: "Hey, try my app: myapp.com"
Friend: *Opens link, clicks "Add to Home Screen"*
Done. Takes 10 seconds.
```

### Capacitor Distribution (iOS)
```
You: Build app → Sign with certificate → Upload somewhere
Friend: Install provisioning profile → Install app → Trust certificate
Takes 30+ minutes, highly technical, breaks after 7 days
```

Let me break down your actual options:

## Option 1: PWA (Easiest for Testing)

**Pros:**
- ✅ Send a link, done
- ✅ Updates instantly (refresh page)
- ✅ Works on any device with a browser
- ✅ Zero setup for testers

**Cons:**
- ❌ iOS Safari limitations (we discussed)
- ❌ Doesn't feel as "native"
- ❌ Limited filesystem access on mobile

**For your use case**: This is perfect for initial testing and getting feedback.

## Option 2: TestFlight (Apple's Official Way)

If you go the Capacitor route:

```bash
# 1. Build your app in Xcode
# 2. Archive for distribution
# 3. Upload to App Store Connect
# 4. Add testers' email addresses
# 5. They install TestFlight app, accept invite
```

**Pros:**
- ✅ Official Apple solution
- ✅ Testers get real native app
- ✅ Easy updates (push new builds)
- ✅ Up to 10,000 testers
- ✅ Builds last 90 days

**Cons:**
- ❌ Requires Apple Developer account ($99/year)
- ❌ Initial setup is complex
- ❌ Apple reviews app before first TestFlight (can take days)
- ❌ Each build upload takes 10-30 minutes

**Workflow for adding a friend:**
```
1. You: Add their email in App Store Connect
2. Friend: Gets email, installs TestFlight app
3. Friend: Accepts invite, app installs
4. Takes about 5 minutes for friend, once set up
```

## Option 3: Ad-Hoc Distribution (Without App Store)

For iOS testing without TestFlight:

**Requirements:**
- Still need Apple Developer account ($99/year)
- Need tester's device UDID
- Limited to 100 devices per year

**Process:**
```bash
# 1. Get friend's iPhone UDID
#    (They plug into computer, open iTunes/Finder)
# 2. Register device in Apple Developer Portal
# 3. Create Ad-Hoc provisioning profile with their UDID
# 4. Build .ipa with that profile
# 5. Send .ipa file + install via Xcode or third-party tool
```

**Honestly**: This is tedious and not worth it for casual testing.

## Option 4: Expo (If You Switch Frameworks)

If you were willing to use React Native instead of Svelte+Capacitor:

**Expo Go app** lets friends test without building:
```
You: npx expo start
Friend: Scans QR code in Expo Go app
Friend: App loads and runs
```

**Pros:**
- ✅ Dead simple for testing
- ✅ No Apple Developer account needed
- ✅ Updates in seconds

**Cons:**
- ❌ Would need to rewrite in React Native (not Svelte)
- ❌ Still has iOS limitations (no raw filesystem access)
- ❌ Can't access all native features

## Option 5: Hybrid Approach (My Recommendation)

Use PWA for testing, Capacitor for yourself:

```typescript
// Write once, works both ways
class AudioAnnotationApp {
  async saveData(songId: string, data: SongData) {
    if (this.isCapacitor()) {
      // Use real filesystem
      await Filesystem.writeFile({...});
    } else {
      // Use IndexedDB for PWA
      await this.indexedDB.put(songId, data);
    }
  }
  
  isCapacitor(): boolean {
    return (window as any).Capacitor !== undefined;
  }
}
```

**How this works:**
1. Deploy as PWA at `yourapp.com`
2. Friends test via browser link
3. YOU use the Capacitor version on your iPhone
4. Same codebase, best of both worlds

**Benefits:**
- ✅ Easy sharing for feedback
- ✅ You get full native features
- ✅ No compromise on core functionality
- ✅ Gradually migrate features to Capacitor as needed

## Option 6: PWA + Better Storage Strategies

Make the PWA work better instead:

### Strategy A: Cloud-backed PWA
```typescript
// Store annotations in your own simple backend
async function saveAnnotations(songId: string, data: SongData) {
  // Save locally first (instant)
  await localDB.put(songId, data);
  
  // Sync to cloud (when online)
  if (navigator.onLine) {
    await fetch(`https://api.yourapp.com/sync/${songId}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}
```

Now data syncs across all devices, and you sidestep storage limits.

### Strategy B: Use the File System Access API
```typescript
// Only works on desktop Chrome, but very powerful
async function pickMusicFolder() {
  const dirHandle = await window.showDirectoryPicker();
  
  // Now you can read/write directly to user's chosen folder
  // Just like a native app!
  const fileHandle = await dirHandle.getFileHandle('song.mp3');
  const file = await fileHandle.getFile();
}
```

**Reality**: This doesn't work on iOS Safari yet, but it's the future.

## What I'd Actually Do

For your specific scenario (learning tool for yourself + occasional friend testing):

### Phase 1: Start with PWA
```
Week 1-4: Build core features as PWA
- Host on Netlify/Vercel (free)
- Share link with friends for feedback
- Iterate quickly based on feedback
```

### Phase 2: Add Capacitor for Yourself
```
Week 5-6: Wrap in Capacitor
- Install on YOUR iPhone
- Keep PWA version live for others
- Get real filesystem access where you need it
```

### Phase 3: TestFlight (Only if People Love It)
```
Week 7+: If friends actually use it regularly
- Pay for Apple Developer account
- Submit to TestFlight
- Now friends can install native version
```

## The Pragmatic Middle Ground

**Here's a clever trick**: Deploy both simultaneously

```bash
# Your project structure
my-app/
├── src/              # Svelte code (shared)
├── dist/             # Built web files
├── ios/              # Capacitor iOS
└── android/          # Capacitor Android

# Build once
npm run build

# Deploy PWA
npx cap copy web
# Now dist/ can be deployed to any web host

# Build native
npx cap copy ios
npx cap open ios
# Build in Xcode for your device
```

**Your friends use**: `https://myapp.com` (PWA)
**You use**: Native app on your iPhone (Capacitor)
**Same code, different deployment**

## Distribution Comparison Table

| Method | Setup Time | Friend's Time | Updates | Cost | Best For |
|--------|-----------|---------------|---------|------|----------|
| PWA | 5 min | 10 sec (click link) | Instant | Free | Testing, iteration |
| TestFlight | 4+ hours | 5 min (first time) | 15 min per build | $99/year | Beta testing |
| Ad-Hoc | 2+ hours | 30+ min per person | Rebuild everything | $99/year | Never use this |
| Expo | 1 hour | 30 sec (scan QR) | Instant | Free | If using React Native |
| Hybrid PWA/Capacitor | 2 hours | 10 sec (PWA) | Instant (PWA) | Free→$99 | Your scenario! |

## My Actual Recommendation

**Start here:**
1. Build as Svelte + TypeScript PWA
2. Host on Netlify (free, takes 5 minutes to set up)
3. Share link with friends: "Try myapp.netlify.app"
4. Use on your own phone via browser (good enough for testing)

**Then if you actually use it daily for 2+ weeks:**
5. Add Capacitor for yourself
6. Keep PWA live for friends
7. Abstract storage layer to work in both

**Only if friends actually want to install:**
8. Get Apple Developer account
9. Submit to TestFlight
10. Now they get native app too

This way you never over-invest until you know it's worth it.

---

**Want me to show you how to set up the hybrid PWA/Capacitor approach?** I could create a starter template that works as both, with the storage abstraction layer already built in. Then you'd have maximum flexibility from day one.