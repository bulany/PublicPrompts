Here is a step-by-step, TDD-inspired tutorial to build your 'Clapping Music' learning tool.

This guide prioritizes getting a functional audio engine running as quickly as possible, per your request. We will first get the recording and the core "Clapping Music" playback logic working with the *entire* recorded clip. Then, in later steps, we'll add the visual loop selection (the "fiddly bit") and refine the UI.

-----

## Step 0: Project Setup

First, let's get the boilerplate out of the way. We'll create a new Vue + TypeScript project with Vite, then add TailwindCSS and PrimeVue.

1.  **Create the Vue Project:**

    ```bash
    # npm 6.x
    npm create vite@latest clapping-music-tool --template vue-ts
    # npm 7+, extra double-dash is needed:
    npm create vite@latest clapping-music-tool -- --template vue-ts

    cd clapping-music-tool
    npm install
    ```

2.  **Add TailwindCSS:**
    Follow the official [Tailwind guide for Vite](https://tailwindcss.com/docs/guides/vite).

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

      * Edit `tailwind.config.js` to include your Vue files:
        ```js
        /** @type {import('tailwindcss').Config} */
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
      * Create `./src/index.css` and add the Tailwind directives:
        ```css
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        ```
      * Import this file in your `./src/main.ts`:
        ```ts
        import { createApp } from 'vue'
        import './style.css'
        import './index.css' // <-- Add this line
        import App from './App.vue'

        createApp(App).mount('#app')
        ```

3.  **Add PrimeVue:**

    ```bash
    npm install primevue
    npm install primeicons
    ```

      * Update `main.ts` to include PrimeVue. We'll use the unstyled mode so Tailwind can take over.

    <!-- end list -->

    ```ts
    import { createApp } from 'vue'
    import './style.css'
    import './index.css'
    import App from './App.vue'
    import PrimeVue from 'primevue/config';

    // Import a theme (we need one, even if minimal)
    // You can choose others like 'aura-light-noir'
    import 'primevue/resources/themes/aura-light-noir/theme.css';
    import 'primeicons/primeicons.css'

    const app = createApp(App)

    app.use(PrimeVue, { 
      unstyled: false // Set to false to use the theme, true for full Tailwind control
    }); 

    app.mount('#app')
    ```

    *For this tutorial, `unstyled: false` is simpler to get started. You can change this later.*

4.  **Install Audio Libraries:**
    We'll install `tone` now, as it's critical for our audio engine. We'll install `wavesurfer.js` in a later step.

    ```bash
    npm install tone
    ```

5.  **Clean up `App.vue`:**
    Replace the contents of `src/App.vue` with a minimal starting point.

    ```vue
    <script setup lang="ts">
    // We will add imports here
    </script>

    <template>
      <div class="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
        <h1 class="text-4xl font-thin mb-8">Clapping Music Tool</h1>
        
        <div class="w-full max-w-md space-y-4">
          <p class="text-center text-gray-400">Step 1: Record your rhythm</p>
        </div>
        
      </div>
    </template>

    <style>
    /* You can add global styles here if needed */
    </style>
    ```

6.  **Run the App:**

    ```bash
    npm run dev
    ```

    You should see a dark page with the title "Clapping Music Tool".

-----

## Step 1: The Record Button

Let's add our first piece of UI: the Record button.

1.  **Import PrimeVue Components:**
    In `src/App.vue`, update the `<script>` block to import `Button`:

    ```ts
    import { ref } from 'vue';
    import Button from 'primevue/button';

    const isRecording = ref(false);
    ```

2.  **Add the Button to the Template:**
    Inside the `div` with the class `w-full max-w-md...`, add the button:

    ```vue
    <template>
      <div class="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
        <h1 class="text-4xl font-thin mb-8">Clapping Music Tool</h1>
        
        <div class="w-full max-w-md space-y-4">
          
          <Button 
            @click="isRecording = !isRecording" 
            :label="isRecording ? 'Stop Recording' : 'Start Recording'"
            :icon="isRecording ? 'pi pi-stop-circle' : 'pi pi-circle-fill'"
            :severity="isRecording ? 'danger' : 'success'"
            class="w-full p-4 text-xl" 
          />

        </div>
      </div>
    </template>
    ```

**Checkpoint:** You should now see a large green "Start Recording" button. Clicking it changes it to a red "Stop Recording" button. It doesn't do anything yet, but the UI state is wired up.

-----

## Step 2: Recording Audio (The First "Win")

Let's make that button actually record audio using the browser's `MediaRecorder` API.

1.  **Add State & Logic in `<script setup>`:**
    We need refs to hold the recorder itself and the final audio data.

    ```ts
    import { ref }fs } from 'vue';
    import Button from 'primevue/button';

    const isRecording = ref(false);

    // Refs for recording
    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];
    const recordedAudioUrl = ref<string | null>(null);

    const toggleRecording = async () => {
      if (isRecording.value) {
        // Stop recording
        mediaRecorder?.stop();
        isRecording.value = false;
      } else {
        // Start recording
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } }); // Request mono
          mediaRecorder = new MediaRecorder(stream);
          audioChunks = []; // Clear previous recording
          recordedAudioUrl.value = null;

          mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            recordedAudioUrl.value = URL.createObjectURL(audioBlob);
            
            // Clean up the stream tracks
            stream.getTracks().forEach(track => track.stop());
          };

          mediaRecorder.start();
          isRecording.value = true;
        } catch (err) {
          console.error("Error accessing microphone:", err);
          alert("Could not access microphone. Please check permissions.");
        }
      }
    };
    </script>
    ```

2.  **Update the Button:**
    Change `@click` to use our new function:

    ```html
    <Button 
      @click="toggleRecording" 
      :label="isRecording ? 'Stop Recording' : 'Start Recording'"
      :icon="isRecording ? 'pi pi-stop-circle' : 'pi pi-circle-fill'"
      :severity="isRecording ? 'danger' : 'success'"
      class="w-full p-4 text-xl" 
    />
    ```

3.  **Add a Playback Tag:**
    Let's add a simple `<audio>` tag to prove it worked. Add this below the button:

    ```html
    <div v-if="recordedAudioUrl" class="mt-4">
      <p class="text-center text-gray-400 mb-2">Your Recording:</p>
      <audio :src="recordedAudioUrl" controls class="w-full"></audio>
    </div>
    ```

**Checkpoint:** Try it\!

1.  Click "Start Recording". Your browser will ask for microphone permission.
2.  Clap your rhythm (e.g., "1 2 3 1 2 1 2 1") into the mic.
3.  Click "Stop Recording".
4.  An audio player should appear. Press play to hear your recording.

You now have a working audio recorder\! This is a major milestone.

-----

## Step 3: Basic Tone.js Playback

Now, let's load this audio into `Tone.js`, which will be our "Clapping Music" engine.

1.  **Import Tone.js:**
    Add these imports to your `<script setup>`:

    ```ts
    import * as Tone from 'tone';

    // We'll use this player to test playback
    const tonePlayer = ref<Tone.Player | null>(null);
    ```

2.  **Load Audio into Tone.Player:**
    We need to update our `mediaRecorder.onstop` handler. Instead of just creating a URL, let's also load it into a `Tone.Player`.

    ```ts
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      recordedAudioUrl.value = URL.createObjectURL(audioBlob);
      
      // NEW: Load into Tone.js
      if (tonePlayer.value) {
        tonePlayer.value.dispose(); // Clean up old player
      }
      tonePlayer.value = new Tone.Player(recordedAudioUrl.value, () => {
        console.log("Tone.Player loaded successfully");
        tonePlayer.value?.toDestination(); // Connect to speakers
      });

      // Clean up the stream tracks
      stream.getTracks().forEach(track => track.stop());
    };
    ```

3.  **Add a "Test Play" Button:**
    Add a new button to test Tone.js playback. Put this below the `<audio>` tag.

    ```html
    <Button
      @click="tonePlayer?.start()"
      label="Test Play (Tone.js)"
      icon="pi pi-play"
      class="w-full mt-2"
      :disabled="!tonePlayer"
    />
    ```

    *Note: The very first time you click this, audio might not play. The browser requires a user interaction to start the `AudioContext`. Clicking the button will "wake it up".*

**Checkpoint:** Record your clap. Then, click the "Test Play (Tone.js)" button. You should hear your recording played back via Tone.js. This confirms our audio engine is ready.

-----

## Step 4: The "Clapping Music" Engine

This is the core logic. We will create two players and use `Tone.Transport` to schedule the phase-shifting.

1.  **Set up Engine Refs:**
    Remove the `tonePlayer` ref. We'll replace it with our proper engine refs.

    ```ts
    import { ref, computed } from 'vue'; // Make sure to import computed
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber'; // Import InputNumber
    import *s Tone from 'tone';

    // ... isRecording, mediaRecorder, audioChunks, recordedAudioUrl ...

    // --- Clapping Music Engine Refs ---
    const player1 = ref<Tone.Player | null>(null); // Left Speaker
    const player2 = ref<Tone.Player | null>(null); // Right Speaker

    const panner1 = new Tone.Panner(-1).toDestination(); // Pan hard left
    const panner2 = new Tone.Panner(1).toDestination();  // Pan hard right

    const isPlayingClappingMusic = ref(false);

    // Configurable state
    const repeatsPerShift = ref(2); // Default: 2 measures per shift

    // Internal state
    const currentShift = ref(0);   // 0 to 11
    const currentRepeat = ref(0);  // 0 to repeatsPerShift.value - 1

    // This will hold our main transport event ID
    let transportEventId: number | null = null;
    ```

2.  **Update the `onstop` Handler:**
    When recording stops, we now load the audio into *both* players and connect them to their panners.

    ```ts
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      recordedAudioUrl.value = URL.createObjectURL(audioBlob);

      // Clean up old players if they exist
      player1.value?.dispose();
      player2.value?.dispose();

      // Create and load new players
      let loadedCount = 0;
      const onPlayerLoaded = () => {
        loadedCount++;
        if (loadedCount === 2) {
          console.log("Both players loaded");
          // Connect players to their respective panners
          player1.value?.connect(panner1);
          player2.value?.connect(panner2);
        }
      };

      player1.value = new Tone.Player(recordedAudioUrl.value, onPlayerLoaded);
      player2.value = new Tone.Player(recordedAudioUrl.value, onPlayerLoaded);
      
      stream.getTracks().forEach(track => track.stop());
    };
    ```

3.  **Create the Core Scheduling Logic:**
    This function will be called by `Tone.Transport` *every measure*.

    ```ts
    const onMeasure = (time: number) => {
      if (!player1.value || !player2.value) return;

      // Get the duration of our loop (the whole recording for now)
      const measureLength = player1.value.buffer.duration;
      const beatLength = measureLength / 12; // The duration of one "beat"

      // 1. Schedule Player 1 (Left)
      // Always plays the original pattern
      player1.value.start(time, 0, measureLength);

      // 2. Schedule Player 2 (Right)
      // Plays the pattern, but starts *offset* by the current shift
      // The offset wraps around the buffer
      const offset = (currentShift.value * beatLength) % measureLength;
      player2.value.start(time, offset, measureLength);

      // 3. Update state for the *next* measure
      currentRepeat.value++;
      if (currentRepeat.value >= repeatsPerShift.value) {
        currentRepeat.value = 0;
        currentShift.value = (currentShift.value + 1) % 12; // Cycle 0-11
      }
    };
    ```

4.  **Create Play/Pause/Stop Controls:**
    These functions will control `Tone.Transport`.

    ```ts
    const playClappingMusic = async () => {
      if (!player1.value || !player2.value) return;
      
      // Must be started by user gesture
      await Tone.start();
      
      // Set the loop length for the transport
      const measureLength = player1.value.buffer.duration;
      Tone.Transport.loop = true;
      Tone.Transport.loopEnd = measureLength;

      // Clear any old event
      if (transportEventId) {
        Tone.Transport.clear(transportEventId);
      }

      // Schedule our 'onMeasure' function to run every measure
      transportEventId = Tone.Transport.scheduleRepeat(onMeasure, measureLength, "0m");
      
      // Start the transport
      Tone.Transport.start();
      isPlayingClappingMusic.value = true;
    };

    const pauseClappingMusic = () => {
      Tone.Transport.pause();
      isPlayingClappingMusic.value = false;
    };

    const stopClappingMusic = () => {
      Tone.Transport.stop();
      if (transportEventId) {
        Tone.Transport.clear(transportEventId);
        transportEventId = null;
      }
      // Reset state
      currentShift.value = 0;
      currentRepeat.value = 0;
      isPlayingClappingMusic.value = false;
    };
    ```

5.  **Add UI for Controls:**
    Let's add the "Play Clapping Music" controls and the `InputNumber` for `repeatsPerShift`. Replace the `<audio>` tag and "Test Play" button with this:

    ```html
    <div v-if="recordedAudioUrl" class="mt-4 border-t border-gray-700 pt-4">
      <p class="text-center text-lg text-gray-300 mb-4">Step 2: Play 'Clapping Music'</p>
      
      <div class="mb-4">
        <label for="repeats" class="block text-sm font-medium text-gray-400 mb-2">Measures per Shift</label>
        <InputNumber 
          v-model="repeatsPerShift" 
          inputId="repeats" 
          :min="1" 
          :max="16" 
          showButtons
          class="w-full"
        />
      </div>

      <div class="flex space-x-2">
        <Button
          v-if="!isPlayingClappingMusic"
          @click="playClappingMusic"
          label="Play"
          icon="pi pi-play"
          class="flex-1"
          :disabled="!player1 || !player2"
        />
        <Button
          v-if="isPlayingClappingMusic"
          @click="pauseClappingMusic"
          label="Pause"
          icon="pi pi-pause"
          severity="secondary"
          class="flex-1"
        />
        <Button
          @click="stopClappingMusic"
          label="Stop"
          icon="pi pi-stop"
          severity="danger"
          class="flex-1"
          :disabled="!player1 || !player2"
        />
      </div>

      <div class="mt-4 text-center p-4 bg-gray-800 rounded">
        <p class="text-sm text-gray-400">Current Shift (Beat)</p>
        <p class="text-6xl font-bold">{{ currentShift }}</p>
      </div>

    </div>
    ```

**Checkpoint:** This is the "Quick & Satisfying" goal\!

1.  Record your clap pattern.
2.  Set "Measures per Shift" (e.g., to 2).
3.  Click "Play".
4.  You will hear your recording in the left ear.
5.  In the right ear, you will hear the *same* recording, but every 2 measures, it will start one "beat" (1/12th of the total loop) later.
6.  You can watch the "Current Shift" number climb from 0 to 11 and then repeat.
7.  Pause and Stop should also work.

You can now *hear* the structure of 'Clapping Music' using your own voice/clap.

-----

## Step 5: Adding Loop Selection with Wavesurfer.js

Now for the "fiddly bit": letting the user select a precise loop from their recording.

1.  **Install Wavesurfer.js & Region Plugin:**

    ```bash
    npm install wavesurfer.js
    ```

2.  **Import Wavesurfer:**
    Add these imports to `<script setup>`:

    ```ts
    import WaveSurfer from 'wavesurfer.js';
    import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
    ```

3.  **Add Wavesurfer Refs:**
    We need refs to hold the wavesurfer instance and the selected loop region.

    ```ts
    // ... other imports ...
    import { ref, computed, onMounted, onBeforeUnmount } from 'vue'; // Add onMounted/onBeforeUnmount

    // ... other refs ...

    // --- Wavesurfer Refs ---
    const waveformContainer = ref<HTMLElement | null>(null); // The div for the waveform
    const wavesurfer = ref<WaveSurfer | null>(null);

    // This will hold the start/end times of our selected loop
    const loopRegion = ref<{ start: number, end: number } | null>(null);

    // This will hold the *full* recording buffer
    const fullAudioBuffer = ref<Tone.Buffer | null>(null);
    ```

4.  **Add Wavesurfer Container to Template:**
    Place this *above* the "Step 2: Play 'Clapping Music'" section (e.g., right after the `<audio>` tag, which you can now remove if you want).

    ```html
    <div v-if="recordedAudioUrl" ref="waveformContainer" class="w-full h-32 bg-gray-800 rounded-lg mt-4"></div>
    ```

5.  **Initialize & Destroy Wavesurfer:**
    We need to initialize Wavesurfer when the component mounts and destroy it when it unmounts.

    ```ts
    onMounted(() => {
      if (waveformContainer.value) {
        wavesurfer.value = WaveSurfer.create({
          container: waveformContainer.value,
          waveColor: '#4f46e5', // Indigo-500
          progressColor: '#818cf8', // Indigo-300
          height: 128,
          barWidth: 3,
          barRadius: 3,
          url: '', // We'll load this later
        });
      }
    });

    onBeforeUnmount(() => {
      wavesurfer.value?.destroy();
      
      // Clean up Tone.js objects
      player1.value?.dispose();
      player2.value?.dispose();
      panner1.dispose();
      panner2.dispose();
      Tone.Transport.stop();
      Tone.Transport.cancel();
    });
    ```

6.  **Load Audio & Create Region:**
    Update the `mediaRecorder.onstop` handler *again*. This time, it will:
    a. Load the audio into `fullAudioBuffer` (for slicing).
    b. Load the audio into `wavesurfer`.
    c. Add the `RegionsPlugin` and create a default region.
    d. Set up listeners for when the region is updated.

    ```ts
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      recordedAudioUrl.value = URL.createObjectURL(audioBlob);

      // --- Stop any previous playback ---
      stopClappingMusic();
      
      // --- Load into Tone.Buffer (for slicing) ---
      fullAudioBuffer.value?.dispose();
      fullAudioBuffer.value = await new Tone.Buffer().load(recordedAudioUrl.value);

      // --- Load into Wavesurfer (for visualizing) ---
      if (wavesurfer.value) {
        // Clear old regions
        wavesurfer.value.clearRegions();
        
        await wavesurfer.value.load(recordedAudioUrl.value);
        
        // Add Regions plugin
        const wsRegions = wavesurfer.value.registerPlugin(RegionsPlugin.create());
        
        // Create a default region (e.g., first 2 seconds or full duration)
        const duration = wavesurfer.value.getDuration();
        const defaultEnd = Math.min(duration, 2.0); // Default 2 sec loop
        
        const region = wsRegions.addRegion({
          start: 0,
          end: defaultEnd,
          color: 'rgba(255, 255, 255, 0.2)',
          drag: true,
          resize: true,
        });
        
        // Store this initial region
        loopRegion.value = { start: region.start, end: region.end };
        
        // Listen for user changes
        wsRegions.on('region-updated', (updatedRegion) => {
          loopRegion.value = { start: updatedRegion.start, end: updatedRegion.end };
        });
      }
      
      stream.getTracks().forEach(track => track.stop());
    };
    ```

**Checkpoint:** Record your clap. A waveform should appear. You should see a default loop region that you can drag and resize. The `loopRegion` ref is now being updated, but our audio engine isn't using it... yet.

-----

## Step 6: Integrating Loop Selection with the Engine

Final step\! We need to make the audio engine use the `loopRegion` instead of the whole file. This involves creating a *new* sliced `Tone.Buffer` every time the user "sets" the loop.

1.  **Add a "Set Loop" Button:**
    Dragging the region is one thing, but we need an explicit button to "commit" this loop to the `Tone.Player`s. This prevents a jumble of updates.

    Add this button below the waveform:

    ```html
    <div v-if="loopRegion" class="mt-2">
      <Button
        @click="setLoopForEngine"
        label="Set This Loop"
        icon="pi pi-check"
        class="w-full"
      />
    </div>
    ```

2.  **Create the `setLoopForEngine` Function:**
    This function will:
    a. Slice the `fullAudioBuffer` using the `loopRegion` times.
    b. Create a *new* `Tone.Buffer` from that slice.
    c. Assign this *new loop buffer* to `player1` and `player2`.

    ```ts
    const setLoopForEngine = () => {
      if (!fullAudioBuffer.value || !loopRegion.value) return;

      // Stop any playback
      stopClappingMusic();

      // Clean up old players
      player1.value?.dispose();
      player2.value?.dispose();

      // --- This is the magic ---
      // 1. Slice the full buffer to get just our loop
      const loopBuffer = fullAudioBuffer.value.slice(
        loopRegion.value.start,
        loopRegion.value.end
      );

      // 2. Create new players and assign the *sliced* buffer
      player1.value = new Tone.Player(loopBuffer).connect(panner1);
      player2.value = new Tone.Player(loopBuffer).connect(panner2);
      
      console.log(`Loop set. New duration: ${loopBuffer.duration}s`);
    };
    ```

3.  **Final Logic Update (Crucial\!):**
    Our `onMeasure` function was using `player1.value.buffer.duration`. This is now correct\! It will automatically refer to the duration of the *sliced loop buffer*. The `start` offset (e.g., `currentShift.value * beatLength`) will also be relative to this new, shorter buffer.

    The logic from Step 4 (`onMeasure`, `playClappingMusic`, etc.) doesn't need to change at all. It will just *work* with the new, shorter buffers.

-----

## Final Check & Polish

You now have a complete, working tool.

1.  **Record** your clap pattern (e.g., "1-2-3, 1-2, 1-2-1").
2.  **Adjust** the waveform region to tightly crop just one repetition of that pattern.
3.  Click **"Set This Loop"**.
4.  Set your desired **"Measures per Shift"** (e.g., 2 or 4).
5.  Click **"Play"**.

You will now hear your precisely-looped pattern in the left ear, and the correctly phase-shifted version in your right ear, advancing through the full 12-beat cycle of 'Clapping Music'.

From here, you can continue to polish the layout, add more visualizers (like highlighting the current beat), or add a visual representation of the two patterns shifting against each other. But the core functional tool is complete. Good luck\!