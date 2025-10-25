# Steve Reich's Clapping Music - TDD-Inspired Tutorial

I love this idea! Let's build this step-by-step, getting to the satisfying core experience as quickly as possible, then polishing from there.

## Step 1: Project Setup

```bash
npm create vite@latest clapping-music -- --template vue-ts
cd clapping-music
npm install
npm install primevue primeicons
npm install tone
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/style.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Update `src/main.ts`:
```typescript
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import './style.css'
import 'primeicons/primeicons.css'
import App from './App.vue'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    }
  }
})
app.mount('#app')
```

## Step 2: Basic Recording (Quick Win!)

Replace `src/App.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import * as Tone from 'tone'

const isRecording = ref(false)
const recorder = ref<Tone.Recorder | null>(null)
const recordedBlob = ref<Blob | null>(null)

async function startRecording() {
  await Tone.start()
  const mic = new Tone.UserMedia()
  await mic.open()
  
  recorder.value = new Tone.Recorder()
  mic.connect(recorder.value)
  recorder.value.start()
  isRecording.value = true
}

async function stopRecording() {
  if (!recorder.value) return
  
  const recording = await recorder.value.stop()
  recordedBlob.value = recording
  isRecording.value = false
  
  console.log('Recording complete!')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-light mb-8 text-center">Clapping Music</h1>
      
      <div class="flex justify-center">
        <Button 
          v-if="!isRecording && !recordedBlob"
          @click="startRecording"
          icon="pi pi-circle"
          label="Record"
          severity="danger"
          size="large"
        />
        
        <Button 
          v-if="isRecording"
          @click="stopRecording"
          icon="pi pi-stop"
          label="Stop Recording"
          severity="secondary"
          size="large"
        />
        
        <div v-if="recordedBlob" class="text-center">
          <p class="text-green-600 mb-4">✓ Recording complete!</p>
        </div>
      </div>
    </div>
  </div>
</template>
```

**Test it!** Run `npm run dev` - you should be able to record audio. Check the console for "Recording complete!"

## Step 3: Playback the Recording (Another Quick Win!)

Update `src/App.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import * as Tone from 'tone'

const isRecording = ref(false)
const recorder = ref<Tone.Recorder | null>(null)
const recordedBlob = ref<Blob | null>(null)
const audioBuffer = ref<Tone.ToneAudioBuffer | null>(null)
const player = ref<Tone.Player | null>(null)

async function startRecording() {
  await Tone.start()
  const mic = new Tone.UserMedia()
  await mic.open()
  
  recorder.value = new Tone.Recorder()
  mic.connect(recorder.value)
  recorder.value.start()
  isRecording.value = true
}

async function stopRecording() {
  if (!recorder.value) return
  
  const recording = await recorder.value.stop()
  recordedBlob.value = recording
  isRecording.value = false
  
  // Load into Tone buffer
  const arrayBuffer = await recording.arrayBuffer()
  audioBuffer.value = new Tone.ToneAudioBuffer(arrayBuffer)
}

function playRecording() {
  if (!audioBuffer.value) return
  
  player.value = new Tone.Player(audioBuffer.value).toDestination()
  player.value.start()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-light mb-8 text-center">Clapping Music</h1>
      
      <div class="flex flex-col items-center gap-4">
        <Button 
          v-if="!isRecording && !recordedBlob"
          @click="startRecording"
          icon="pi pi-circle"
          label="Record"
          severity="danger"
          size="large"
        />
        
        <Button 
          v-if="isRecording"
          @click="stopRecording"
          icon="pi pi-stop"
          label="Stop Recording"
          severity="secondary"
          size="large"
        />
        
        <div v-if="recordedBlob" class="flex flex-col items-center gap-4">
          <p class="text-green-600">✓ Recording complete!</p>
          <Button 
            @click="playRecording"
            icon="pi pi-play"
            label="Play Recording"
            size="large"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

**Test it!** Record, then play back your recording. Satisfying!

## Step 4: The Magic - Play Clapping Music! (Core Experience)

Now for the main event. Let's implement the Reich phase-shifting pattern:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import * as Tone from 'tone'

const isRecording = ref(false)
const recorder = ref<Tone.Recorder | null>(null)
const recordedBlob = ref<Blob | null>(null)
const audioBuffer = ref<Tone.ToneAudioBuffer | null>(null)
const player = ref<Tone.Player | null>(null)
const measuresPerShift = ref(2)
const isPlayingClappingMusic = ref(false)

// Players for stereo clapping music
let leftPlayer: Tone.Player | null = null
let rightPlayer: Tone.Player | null = null
let scheduledEvents: number[] = []

async function startRecording() {
  await Tone.start()
  const mic = new Tone.UserMedia()
  await mic.open()
  
  recorder.value = new Tone.Recorder()
  mic.connect(recorder.value)
  recorder.value.start()
  isRecording.value = true
}

async function stopRecording() {
  if (!recorder.value) return
  
  const recording = await recorder.value.stop()
  recordedBlob.value = recording
  isRecording.value = false
  
  const arrayBuffer = await recording.arrayBuffer()
  audioBuffer.value = new Tone.ToneAudioBuffer(arrayBuffer)
}

function playRecording() {
  if (!audioBuffer.value) return
  
  player.value = new Tone.Player(audioBuffer.value).toDestination()
  player.value.start()
}

async function playClappingMusic() {
  if (!audioBuffer.value) return
  
  await Tone.start()
  isPlayingClappingMusic.value = true
  
  const loopDuration = audioBuffer.value.duration
  const beatDuration = loopDuration / 12 // 12 beats per measure
  
  // Create stereo panners
  const leftPanner = new Tone.Panner(-1).toDestination()
  const rightPanner = new Tone.Panner(1).toDestination()
  
  // Left player - always plays at offset 0
  leftPlayer = new Tone.Player(audioBuffer.value).connect(leftPanner)
  leftPlayer.loop = true
  leftPlayer.start()
  
  // Right player - will shift phase
  rightPlayer = new Tone.Player(audioBuffer.value).connect(rightPanner)
  rightPlayer.loop = true
  
  let currentShift = 0
  const totalShifts = 12 // Will go through all 12 phases
  
  function scheduleNextShift(shiftNumber: number) {
    if (shiftNumber > totalShifts) {
      return // Done!
    }
    
    const startTime = Tone.now() + (shiftNumber * measuresPerShift.value * loopDuration)
    const offset = (shiftNumber % 12) * beatDuration
    
    const eventId = Tone.Transport.schedule((time) => {
      if (rightPlayer) {
        rightPlayer.stop(time)
        rightPlayer.start(time, offset)
      }
      scheduleNextShift(shiftNumber + 1)
    }, startTime)
    
    scheduledEvents.push(eventId)
  }
  
  // Start right player at offset 0
  rightPlayer.start()
  
  // Schedule all the phase shifts
  scheduleNextShift(1)
}

function stopClappingMusic() {
  leftPlayer?.stop()
  rightPlayer?.stop()
  leftPlayer?.dispose()
  rightPlayer?.dispose()
  
  scheduledEvents.forEach(id => Tone.Transport.clear(id))
  scheduledEvents = []
  
  isPlayingClappingMusic.value = false
}

function reset() {
  stopClappingMusic()
  recordedBlob.value = null
  audioBuffer.value = null
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-light mb-8 text-center">Clapping Music</h1>
      
      <div class="flex flex-col items-center gap-6">
        <!-- Recording Section -->
        <div v-if="!recordedBlob" class="flex flex-col items-center gap-4">
          <Button 
            v-if="!isRecording"
            @click="startRecording"
            icon="pi pi-circle"
            label="Record Base Rhythm"
            severity="danger"
            size="large"
          />
          
          <Button 
            v-if="isRecording"
            @click="stopRecording"
            icon="pi pi-stop"
            label="Stop Recording"
            severity="secondary"
            size="large"
          />
        </div>
        
        <!-- Playback Section -->
        <div v-if="recordedBlob && !isPlayingClappingMusic" class="flex flex-col items-center gap-4 w-full">
          <p class="text-green-600">✓ Recording complete!</p>
          
          <div class="flex gap-4">
            <Button 
              @click="playRecording"
              icon="pi pi-play"
              label="Test Recording"
            />
            <Button 
              @click="reset"
              icon="pi pi-refresh"
              label="Record Again"
              severity="secondary"
            />
          </div>
          
          <div class="border-t pt-6 mt-4 w-full">
            <div class="flex flex-col items-center gap-4">
              <div class="flex items-center gap-3">
                <label class="text-sm">Measures per shift:</label>
                <InputNumber 
                  v-model="measuresPerShift" 
                  :min="1" 
                  :max="8"
                  showButtons
                  buttonLayout="horizontal"
                  class="w-32"
                />
              </div>
              
              <Button 
                @click="playClappingMusic"
                icon="pi pi-play"
                label="Play Clapping Music"
                severity="success"
                size="large"
              />
            </div>
          </div>
        </div>
        
        <!-- Playing Section -->
        <div v-if="isPlayingClappingMusic" class="flex flex-col items-center gap-4">
          <p class="text-blue-600 text-lg">♪ Playing Clapping Music ♪</p>
          <p class="text-sm text-gray-600">Listen as the right channel shifts phase...</p>
          
          <Button 
            @click="stopClappingMusic"
            icon="pi pi-stop"
            label="Stop"
            severity="danger"
            size="large"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

**Test it!** Record a clapping pattern, then hit "Play Clapping Music" - you should hear Steve Reich's phasing effect with your own recording! The right channel gradually shifts through all 12 phases.

---

## Step 5: Add Loop Region Selection (Refinement)

Now let's add the ability to select a specific region of the recording to use as the loop. We'll add a simple visualization and controls:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Slider from 'primevue/slider'
import * as Tone from 'tone'

const isRecording = ref(false)
const recorder = ref<Tone.Recorder | null>(null)
const recordedBlob = ref<Blob | null>(null)
const audioBuffer = ref<Tone.ToneAudioBuffer | null>(null)
const player = ref<Tone.Player | null>(null)
const measuresPerShift = ref(2)
const isPlayingClappingMusic = ref(false)

// Loop region selection
const loopStart = ref(0)
const loopEnd = ref(100)
const isSelectingLoop = ref(false)

let leftPlayer: Tone.Player | null = null
let rightPlayer: Tone.Player | null = null
let scheduledEvents: number[] = []

const totalDuration = computed(() => audioBuffer.value?.duration || 0)
const loopDuration = computed(() => {
  const start = (loopStart.value / 100) * totalDuration.value
  const end = (loopEnd.value / 100) * totalDuration.value
  return end - start
})

async function startRecording() {
  await Tone.start()
  const mic = new Tone.UserMedia()
  await mic.open()
  
  recorder.value = new Tone.Recorder()
  mic.connect(recorder.value)
  recorder.value.start()
  isRecording.value = true
}

async function stopRecording() {
  if (!recorder.value) return
  
  const recording = await recorder.value.stop()
  recordedBlob.value = recording
  isRecording.value = false
  
  const arrayBuffer = await recording.arrayBuffer()
  audioBuffer.value = new Tone.ToneAudioBuffer(arrayBuffer)
  
  // Start in loop selection mode
  isSelectingLoop.value = true
  loopStart.value = 0
  loopEnd.value = 100
}

function playLoopPreview() {
  if (!audioBuffer.value) return
  
  const start = (loopStart.value / 100) * totalDuration.value
  const duration = loopDuration.value
  
  player.value?.dispose()
  player.value = new Tone.Player(audioBuffer.value).toDestination()
  player.value.start(Tone.now(), start, duration)
}

function confirmLoop() {
  isSelectingLoop.value = false
}

async function playClappingMusic() {
  if (!audioBuffer.value) return
  
  await Tone.start()
  isPlayingClappingMusic.value = true
  
  const start = (loopStart.value / 100) * totalDuration.value
  const duration = loopDuration.value
  const beatDuration = duration / 12
  
  const leftPanner = new Tone.Panner(-1).toDestination()
  const rightPanner = new Tone.Panner(1).toDestination()
  
  leftPlayer = new Tone.Player(audioBuffer.value).connect(leftPanner)
  leftPlayer.loop = true
  leftPlayer.loopStart = start
  leftPlayer.loopEnd = start + duration
  leftPlayer.start(Tone.now(), start)
  
  rightPlayer = new Tone.Player(audioBuffer.value).connect(rightPanner)
  rightPlayer.loop = true
  rightPlayer.loopStart = start
  rightPlayer.loopEnd = start + duration
  
  let currentShift = 0
  const totalShifts = 12
  
  function scheduleNextShift(shiftNumber: number) {
    if (shiftNumber > totalShifts) return
    
    const startTime = Tone.now() + (shiftNumber * measuresPerShift.value * duration)
    const offset = start + ((shiftNumber % 12) * beatDuration)
    
    const eventId = Tone.Transport.schedule((time) => {
      if (rightPlayer) {
        rightPlayer.stop(time)
        rightPlayer.start(time, offset)
      }
      scheduleNextShift(shiftNumber + 1)
    }, startTime)
    
    scheduledEvents.push(eventId)
  }
  
  rightPlayer.start(Tone.now(), start)
  scheduleNextShift(1)
}

function stopClappingMusic() {
  leftPlayer?.stop()
  rightPlayer?.stop()
  leftPlayer?.dispose()
  rightPlayer?.dispose()
  
  scheduledEvents.forEach(id => Tone.Transport.clear(id))
  scheduledEvents = []
  
  isPlayingClappingMusic.value = false
}

function reset() {
  stopClappingMusic()
  recordedBlob.value = null
  audioBuffer.value = null
  isSelectingLoop.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div class="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-light mb-8 text-center">Clapping Music</h1>
      
      <div class="flex flex-col items-center gap-6">
        <!-- Recording Section -->
        <div v-if="!recordedBlob" class="flex flex-col items-center gap-4">
          <Button 
            v-if="!isRecording"
            @click="startRecording"
            icon="pi pi-circle"
            label="Record Base Rhythm"
            severity="danger"
            size="large"
          />
          
          <Button 
            v-if="isRecording"
            @click="stopRecording"
            icon="pi pi-stop"
            label="Stop Recording"
            severity="secondary"
            size="large"
          />
        </div>
        
        <!-- Loop Selection Section -->
        <div v-if="recordedBlob && isSelectingLoop" class="w-full flex flex-col gap-6">
          <div class="text-center">
            <p class="text-lg mb-2">Select Loop Region</p>
            <p class="text-sm text-gray-600">Adjust the range to capture one measure (12 beats)</p>
          </div>
          
          <div class="flex flex-col gap-4 bg-gray-50 p-6 rounded">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Start Position</label>
              <Slider v-model="loopStart" :max="loopEnd - 1" />
              <span class="text-xs text-gray-500">{{ (loopStart / 100 * totalDuration).toFixed(2) }}s</span>
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">End Position</label>
              <Slider v-model="loopEnd" :min="loopStart + 1" />
              <span class="text-xs text-gray-500">{{ (loopEnd / 100 * totalDuration).toFixed(2) }}s</span>
            </div>
            
            <div class="text-center text-sm font-medium mt-2">
              Loop Duration: {{ loopDuration.toFixed(2) }}s
            </div>
          </div>
          
          <div class="flex gap-4 justify-center">
            <Button 
              @click="playLoopPreview"
              icon="pi pi-play"
              label="Preview Loop"
            />
            <Button 
              @click="confirmLoop"
              icon="pi pi-check"
              label="Use This Loop"
              severity="success"
            />
          </div>
        </div>
        
        <!-- Playback Section -->
        <div v-if="recordedBlob && !isSelectingLoop && !isPlayingClappingMusic" class="flex flex-col items-center gap-4 w-full">
          <p class="text-green-600">✓ Loop selected!</p>
          
          <div class="flex gap-4">
            <Button 
              @click="isSelectingLoop = true"
              icon="pi pi-pencil"
              label="Adjust Loop"
              severity="secondary"
            />
            <Button 
              @click="reset"
              icon="pi pi-refresh"
              label="Start Over"
              severity="secondary"
            />
          </div>
          
          <div class="border-t pt-6 mt-4 w-full">
            <div class="flex flex-col items-center gap-4">
              <div class="flex items-center gap-3">
                <label class="text-sm">Measures per shift:</label>
                <InputNumber 
                  v-model="measuresPerShift" 
                  :min="1" 
                  :max="8"
                  showButtons
                  buttonLayout="horizontal"
                />
              </div>
              
              <Button 
                @click="playClappingMusic"
                icon="pi pi-play"
                label="Play Clapping Music"
                severity="success"
                size="large"
              />
            </div>
          </div>
        </div>
        
        <!-- Playing Section -->
        <div v-if="isPlayingClappingMusic" class="flex flex-col items-center gap-4">
          <p class="text-blue-600 text-lg">♪ Playing Clapping Music ♪</p>
          <p class="text-sm text-gray-600">Listen as the right channel shifts phase...</p>
          
          <Button 
            @click="stopClappingMusic"
            icon="pi pi-stop"
            label="Stop"
            severity="danger"
            size="large"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

**Test it!** Now you can fine-tune which part of your recording becomes the loop!

---

## Step 6: Visual Phase Indicator (Polish)

Let's add a visual representation of which phase we're currently in:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Slider from 'primevue/slider'
import * as Tone from 'tone'

const isRecording = ref(false)
const recorder = ref<Tone.Recorder | null>(null)
const recordedBlob = ref<Blob | null>(null)
const audioBuffer = ref<Tone.ToneAudioBuffer | null>(null)
const player = ref<Tone.Player | null>(null)
const measuresPerShift = ref(2)
const isPlayingClappingMusic = ref(false)
const currentPhase = ref(0)

const loopStart = ref(0)
const loopEnd = ref(100)
const isSelectingLoop = ref(false)

let leftPlayer: Tone.Player | null = null
let rightPlayer: Tone.Player | null = null
let scheduledEvents: number[] = []

const totalDuration = computed(() => audioBuffer.value?.duration || 0)
const loopDuration = computed(() => {
  const start = (loopStart.value / 100) * totalDuration.value
  const end = (loopEnd.value / 100) * totalDuration.value
  return end - start
})

const pattern = [1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0]

async function startRecording() {
  await Tone.start()
  const mic = new Tone.UserMedia()
  await mic.open()
  
  recorder.value = new Tone.Recorder()
  mic.connect(recorder.value)
  recorder.value.start()
  isRecording.value = true
}

async function stopRecording() {
  if (!recorder.value) return
  
  const recording = await recorder.value.stop()
  recordedBlob.value = recording
  isRecording.value = false
  
  const arrayBuffer = await recording.arrayBuffer()
  audioBuffer.value = new Tone.ToneAudioBuffer(arrayBuffer)
  
  isSelectingLoop.value = true
  loopStart.value = 0
  loopEnd.value = 100
}

function playLoopPreview() {
  if (!audioBuffer.value) return
  
  const start = (loopStart.value / 100) * totalDuration.value
  const duration = loopDuration.value
  
  player.value?.dispose()
  player.value = new Tone.Player(audioBuffer.value).toDestination()
  player.value.start(Tone.now(), start, duration)
}

function confirmLoop() {
  isSelectingLoop.value = false
}

async function playClappingMusic() {
  if (!audioBuffer.value) return
  
  await Tone.start()
  isPlayingClappingMusic.value = true
  currentPhase.value = 0
  
  const start = (loopStart.value / 100) * totalDuration.value
  const duration = loopDuration.value
  const beatDuration = duration / 12
  
  const leftPanner = new Tone.Panner(-1).toDestination()
  const rightPanner = new Tone.Panner(1).toDestination()
  
  leftPlayer = new Tone.Player(audioBuffer.value).connect(leftPanner)
  leftPlayer.loop = true
  leftPlayer.loopStart = start
  leftPlayer.loopEnd = start + duration
  leftPlayer.start(Tone.now(), start)
  
  rightPlayer = new Tone.Player(audioBuffer.value).connect(rightPanner)
  rightPlayer.loop = true
  rightPlayer.loopStart = start
  rightPlayer.loopEnd = start + duration
  
  function scheduleNextShift(shiftNumber: number) {
    if (shiftNumber > 12) return
    
    const startTime = Tone.now() + (shiftNumber * measuresPerShift.value * duration)
    const offset = start + ((shiftNumber % 12) * beatDuration)
    
    const eventId = Tone.Transport.schedule((time) => {
      currentPhase.value = shiftNumber % 12
      if (rightPlayer) {
        rightPlayer.stop(time)
        rightPlayer.start(time, offset)
      }
      scheduleNextShift(shiftNumber + 1)
    }, startTime)
    
    scheduledEvents.push(eventId)
  }
  
  rightPlayer.start(Tone.now(), start)
  scheduleNextShift(1)
}

function stopClappingMusic() {
  leftPlayer?.stop()
  rightPlayer?.stop()
  leftPlayer?.dispose()
  rightPlayer?.dispose()
  
  scheduledEvents.forEach(id => Tone.Transport.clear(id))
  scheduledEvents = []
  
  isPlayingClappingMusic.value = false
  currentPhase.value = 0
}

function reset() {
  stopClappingMusic()
  recordedBlob.value = null
  audioBuffer.value = null
  isSelectingLoop.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div class="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-light mb-8 text-center">Clapping Music</h1>
      
      <div class="flex flex-col items-center gap-6">
        <div v-if="!recordedBlob" class="flex flex-col items-center gap-4">
          <Button 
            v-if="!isRecording"
            @click="startRecording"
            icon="pi pi-circle"
            label="Record Base Rhythm"
            severity="danger"
            size="large"
          />
          
          <Button 
            v-if="isRecording"
            @click="stopRecording"
            icon="pi pi-stop"
            label="Stop Recording"
            severity="secondary"
            size="large"
          />
        </div>
        
        <div v-if="recordedBlob && isSelectingLoop" class="w-full flex flex-col gap-6">
          <div class="text-center">
            <p class="text-lg mb-2">Select Loop Region</p>
            <p class="text-sm text-gray-600">Adjust the range to capture one measure (12 beats)</p>
          </div>
          
          <div class="flex flex-col gap-4 bg-gray-50 p-6 rounded">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Start Position</label>
              <Slider v-model="loopStart" :max="loopEnd - 1" />
              <span class="text-xs text-gray-500">{{ (loopStart / 100 * totalDuration).toFixed(2) }}s</span>
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">End Position</label>
              <Slider v-model="loopEnd" :min="loopStart + 1" />
              <span class="text-xs text-gray-500">{{ (loopEnd / 100 * totalDuration).toFixed(2) }}s</span>
            </div>
            
            <div class="text-center text-sm font-medium mt-2">
              Loop Duration: {{ loopDuration.toFixed(2) }}s
            </div>
          </div>
          
          <div class="flex gap-4 justify-center">
            <Button 
              @click="playLoopPreview"
              icon="pi pi-play"