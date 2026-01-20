# Prompt 1
What is the state of the art in AI video generation? 
Like how long can clips be generated for, how much do they cost (e.g. in compute or dollars) per second?
Can character consistency be maintained between successively genrated clips?
Can you make a prediction as to when it will be possible to generate a feature length movie from say the text of a novel... and that the movie is a decent watch?
Will the compute of this kind of generation always be fixed or will it descend in line with the price?
Can you make a kind of prediction or chart of this: say right now a user even without an account might be able to trial a certain video generation model to generate a 2 second clip and they get 1 2 second clip per week or something. Can you make a chart of time it would take a free tier user to generate a feature length film and see that track down over the next say 20 years... like today it might take 6 years of generating everyday on a free tier to get to a full length movie but in twenty years they might be able to generate a full length movie in 10 minutes?
Can you give a bit of an explanation for the basis of any of your assumptions for these predictions?

# Response 1
This is a great question, and you’re basically asking for a **technical + economic + cultural forecast**, not just a product comparison. I’ll break this into clear sections and be explicit about **what’s known vs what’s inferred**.

---

## 1. State of the art *today* (early 2026-ish, roughly)

### Clip length & quality

**Typical capabilities (publicly known / semi-public):**

* **Single-shot clips**: ~2–10 seconds at high quality
* **Extended clips**: up to ~30–60 seconds, but:

  * Motion coherence degrades
  * Scene logic drifts
  * Characters subtly change
* **Resolutions**: 720p–1080p is common; higher exists but is expensive

**Important distinction**

* *Generating a 60s clip* ≠ *generating 60 seconds of story*
* Models still struggle with:

  * Long-term causality
  * Spatial memory
  * Narrative intent

---

### Cost (very rough order of magnitude)

This varies wildly by provider, but estimates are useful:

| Metric                      | Rough 2025–2026 Estimate         |
| --------------------------- | -------------------------------- |
| Compute per second          | ~1–10 GPU-seconds                |
| Dollar cost (provider-side) | ~$0.01–$0.20 per second of video |
| Retail user price           | ~$0.10–$1.00 per second          |

> **Rule of thumb**: Video is currently **~100–1000× more expensive than text** and **~10–50× more expensive than image generation per output unit**.

---

## 2. Character & world consistency (current reality)

### What *can* be done today

* **Short-term consistency**:

  * A character can remain consistent over ~5–20 seconds
  * Especially if:

    * Same prompt
    * Same seed
    * Reference image(s)
* **Manual pipelines**:

  * Generate → select → regenerate → stitch
  * Heavy human curation
* **LoRA / identity embeddings**:

  * Helps with faces, clothing, style
  * Still brittle for motion + emotion

### What is *not* solved yet

* Persistent identity across:

  * Different scenes
  * Different lighting
  * Emotional states
* Character memory:

  * “This character is injured”
  * “This character knows X”
* Multi-character interaction continuity

**Bottom line**

> Character consistency is *manageable for shots*, not *automatic for stories*.

---

## 3. Could you generate a feature-length movie today?

### Technically?

Yes, in the same way you could build a cathedral with tweezers.

### Practically?

No — unless:

* You accept:

  * Repetition
  * Narrative incoherence
  * Visual drift
* Or you have:

  * A large team
  * Massive compute
  * Heavy manual intervention

### Why it fails today

* Models generate **frames**, not **films**
* There is no true:

  * Story planner
  * Scene-level memory
  * Character arc tracker
* Current pipelines resemble:

  > “Procedural hallucination” rather than filmmaking

---

## 4. Prediction: When will AI-generated feature films be *decent*?

I’ll define *decent* as:

* Coherent plot
* Consistent characters
* Watchable pacing
* Comparable to a mid-budget indie film (not Pixar)

### My estimate (with confidence bands)

| Year          | Capability                                                  |
| ------------- | ----------------------------------------------------------- |
| **2026–2027** | Short films (5–15 min) are viable with light editing        |
| **2028–2029** | 60–90 min films possible but require heavy human direction  |
| **2030–2032** | “Press a button” feature films that are genuinely watchable |
| **2035+**     | AI-native cinema becomes a dominant category                |

**Key assumption**
The breakthrough is **not** better video diffusion alone, but:

* Hierarchical planning:

  * Script → scenes → shots → frames
* Persistent world models
* Cheap inference at scale

---

## 5. Will compute cost always be fixed?

No — and this is crucial.

### Why cost will drop

1. **Hardware**

   * Better GPUs / NPUs
   * Video-specific accelerators
2. **Algorithms**

   * Fewer diffusion steps
   * Better latent compression
   * Caching & reuse of motion
3. **Economies of scale**

   * Inference is cheaper than training
4. **Competition**

   * Commoditization forces prices down

### Historical analogy

| Technology       | Cost trend                 |
| ---------------- | -------------------------- |
| Rendering (CGI)  | ↓ 1000× over 25 years      |
| Image generation | ↓ ~50× in 5 years          |
| LLM inference    | ↓ ~10× every ~18–24 months |

**Video will follow a similar curve**, just delayed.

---

## 6. A speculative “free tier → feature film” timeline

Let’s define:

* Feature film = **90 minutes = 5400 seconds**

### Assumptions

* Free tier grants a *fixed weekly generation allowance*
* Quality improves over time
* Clip length increases over time

---

### Today (~2026)

* Free tier:

  * 1 × 2-second clip per week
* Weekly output: 2s
* Time to 5400s:

> **~52 years**

(And it wouldn’t stitch coherently.)

---

### 5 years out (~2031)

* Free tier:

  * 10 × 10-second clips per week
* Weekly output: 100s

> **~1 year**

With light editing, possibly coherent.

---

### 10 years out (~2036)

* Free tier:

  * 5 minutes per day
* Daily output: 300s

> **~18 days**

At this point, the limiting factor is **human attention**, not compute.

---

### 20 years out (~2046)

* Free tier:

  * Real-time or faster-than-real-time generation
* Time to full movie:

> **Minutes**

Generation becomes more like *rendering a thought* than producing content.

---

### Summary chart (conceptual)

```
Years →        0      5      10      20
-----------------------------------------
Clip length   2s     10s     5min    1+ hr
Free output   tiny   small   large   huge
Time to film  50y    1y      weeks   minutes
Quality       poor   ok      good    excellent
```

---

## 7. Why these assumptions are reasonable

### Anchors

* Image generation improved **dramatically** in ~4 years
* Video is harder, but:

  * Uses same scaling laws
  * Benefits more from reuse (motion, characters)
* Hollywood already:

  * Breaks films into shots
  * Reuses assets aggressively

### Structural reasons progress accelerates

* Once:

  * Identity embeddings
  * World memory
  * Shot planning
    are solved, scaling becomes trivial

---

## 8. A key insight (important)

> The hardest part of AI filmmaking is **not realism** —
> it’s **intentionality**.

Once models can:

* Understand *why* a scene exists
* Track character goals
* Respect narrative constraints

Then feature films become *cheap by default*.

---

If you want, next we could:

* Compare **AI filmmaking vs traditional CGI pipelines**
* Talk about **what human roles survive** (director, editor, actor?)
* Or speculate on **new art forms** that emerge once movies cost ~$0 to make
