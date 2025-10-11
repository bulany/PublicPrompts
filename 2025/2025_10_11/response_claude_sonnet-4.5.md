This is a great project idea! Let me walk you through the best practices for packaging and releasing this.

## Licensing and Attribution

First, check webaudiofont's license (it appears to be GPL-3.0). You have several options:

1. **Fork the original repo** - Good for maintaining clear lineage, but as you noted, if you're restructuring heavily, this can be confusing
2. **Create a new repo with clear attribution** - Often cleaner when you're doing significant restructuring. Include prominent attribution in your README, package.json, and keep original license headers in adapted code
3. **Contribute improvements back** - If your changes could benefit the original project

For your use case, I'd recommend **option 2** - a new repo with clear attribution. This gives you freedom to restructure while being transparent about origins.

## Package Architecture

The smart approach is a **monorepo with multiple packages**:

```
@your-scope/webaudio-sampler/          # Core player library
@your-scope/webaudio-sampler-piano/    # Piano samples
@your-scope/webaudio-sampler-guitar/   # Guitar samples
... etc
```

### Why this structure?

1. **Scoped packages** (`@username/package-name`) keep related packages together
2. **Separate sample packages** let users install only what they need
3. **Core library** is small and handles the player logic
4. **Tree-shakeable** and bandwidth-friendly

## Recommended Setup

Use a monorepo tool like **pnpm workspaces** or **npm workspaces**:

```
webaudio-sampler/
├── packages/
│   ├── core/                    # @your-scope/webaudio-sampler
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   ├── instrument-piano/        # @your-scope/webaudio-sampler-piano
│   │   ├── samples/
│   │   ├── metadata.json
│   │   ├── package.json
│   │   └── README.md
│   └── instrument-guitar/       # @your-scope/webaudio-sampler-guitar
├── package.json                 # root workspace config
├── pnpm-workspace.yaml
└── README.md
```

## User Installation Flow

Your ideal workflow would look like:

```bash
npm create vite@latest my-app
cd my-app
npm install @your-scope/webaudio-sampler @your-scope/webaudio-sampler-piano
```

Then in code:

```typescript
import { SamplePlayer } from '@your-scope/webaudio-sampler';
import pianoSamples from '@your-scope/webaudio-sampler-piano';

const player = new SamplePlayer();
await player.loadInstrument(pianoSamples);

player.playNotes([
  { time: 0, duration: 0.5, pitch: 60, velocity: 80 },
  { time: 0.5, duration: 0.5, pitch: 64, velocity: 80 }
]);
```

## Step-by-Step Implementation

### 1. **Set up the monorepo**

```bash
mkdir webaudio-sampler
cd webaudio-sampler
npm init -y
```

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - 'packages/*'
```

### 2. **Create the core package**

```bash
mkdir -p packages/core
cd packages/core
npm init -y
```

Edit `packages/core/package.json`:
```json
{
  "name": "@your-scope/webaudio-sampler",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "tone": "^14.7.77"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  },
  "keywords": ["webaudio", "midi", "sampler", "tone.js"],
  "author": "Your Name",
  "license": "GPL-3.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/webaudio-sampler.git"
  }
}
```

### 3. **Create instrument packages**

```bash
mkdir -p packages/instrument-piano/samples
cd packages/instrument-piano
```

`packages/instrument-piano/package.json`:
```json
{
  "name": "@your-scope/webaudio-sampler-piano",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "samples"],
  "scripts": {
    "build": "node build.js"
  },
  "keywords": ["piano", "samples", "webaudio"],
  "license": "GPL-3.0"
}
```

### 4. **Build script for instrument packages**

Each instrument package needs to bundle sample metadata:

`packages/instrument-piano/build.js`:
```javascript
import fs from 'fs';
import path from 'path';

const samples = {}; // Load and structure your samples
const metadata = {
  name: 'Acoustic Piano',
  source: 'FluidSynth',
  attribution: 'Based on webaudiofont by Sergey Surikov',
  zones: samples
};

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync(
  'dist/index.js',
  `export default ${JSON.stringify(metadata, null, 2)};`
);
```

### 5. **Publishing workflow**

```bash
# From root directory
pnpm install

# Build all packages
pnpm -r build

# Login to npm (one time)
npm login

# Publish (from each package directory or use lerna/changesets)
cd packages/core && npm publish --access public
cd packages/instrument-piano && npm publish --access public
```

### 6. **Automate with GitHub Actions**

`.github/workflows/publish.yml`:
```yaml
name: Publish
on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm -r build
      - run: pnpm -r publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Naming Recommendations

Good patterns I've seen:

- `@tonejs/piano` - scoped, clear
- `@soundfont/player` - scoped by domain
- `webaudio-instruments` - descriptive

For yours, consider:
- `@webaudio-sampler/core` and `@webaudio-sampler/piano`
- `@midi-sampler/core` and `@midi-sampler/piano`
- Or without scope: `webaudio-sampler` and `webaudio-sampler-piano`

Scoped packages are cleaner but require an organization or your personal scope.

## Attribution Best Practices

In your README.md:

```markdown
## Attribution

This project is based on [webaudiofont](https://github.com/surikov/webaudiofont) 
by Sergey Surikov. The core sample playback code and instrument samples are 
adapted from that project.

### Changes from original:
- Restructured as modern npm packages
- TypeScript support
- Integration with Tone.js for scheduling
- Simplified API for common use cases
```

Also keep license headers in source files you adapted.

Would you like me to create a full working example of any of these parts?