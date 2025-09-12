You can't directly run Node.js or Vite on an iPhone, but there are several excellent turnkey solutions for getting your Vue.js app running offline on iOS devices for testing:

## Best Solutions for Offline iOS Testing

**1. Capacitor (Most Recommended)**
Capacitor by Ionic is probably your best bet. It's specifically designed for this use case:
- Build your Vue app normally (`npm run build`)
- Capacitor wraps it as a native iOS app with a webview
- All your public assets get bundled into the app
- Works completely offline
- Easy setup: `npm install @capacitor/core @capacitor/ios`
- Built-in development workflow with live reload over network

**2. Cordova/PhoneGap**
Similar to Capacitor but older. Still works well:
- Packages your web app as a native iOS app
- All assets are local to the device
- Good documentation and tooling

**3. Progressive Web App (PWA) + Safari**
If you don't need native app features:
- Add a service worker to cache all your assets
- Use a web app manifest
- Users can "Add to Home Screen" from Safari
- Works offline once cached
- Fastest to implement if you're already familiar with PWAs

**4. Expo (if you're open to React Native)**
While not Vue.js, Expo has excellent tooling:
- Expo Go app for instant testing
- Easy deployment pipeline
- Strong offline capabilities

## Quick Start Recommendation

For Vue.js specifically, I'd go with **Capacitor**:

```bash
# Build your Vue app
npm run build

# Add Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init

# Add iOS platform
npx cap add ios

# Copy your built app
npx cap copy ios

# Open in Xcode
npx cap open ios
```

Then build and install on your device through Xcode. All your public assets will be bundled locally, so it works completely offline.

The PWA approach is also worth considering if you want something even quicker to test and don't need native features.