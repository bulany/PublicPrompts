# Prompt 1
I've always loved and been impressed by computer "demos". And I'm especially impressed by the so called "4K demos" although I have never written or ran one myself. Are people still making demos and "4k demos"? 
One thing I've noticed is that in early demos sometimes there would be a waiting sequence where some kind of "world" was built in memory, like vectors or something and then a complex scene might be rendered to screen... I thought I even saw this captioned once as "please wait... building the universe..." and after a long delay the demo finally started.
Now I see the emergence of so called "neural rendering" where an AI model is somehow used to render a scene as opposed to a traditional geometrical model. These neural models can be similarly large depending on the complexity of the scene. But the basic mechanism seems to be the same: have a fairly large amount of data that constitutes the world or universe and then render views of that world or universe.
I'm wondering has anyone attempted to use some kind of neural rendering in a demo yet? I remember the impressive thing in demos was to see how many triangles one could render in real time on the available hardware. Now with neural rendering, triangles might be irrelevant and there might be a way to have a photorealistic scene rendered in real time? Has anyone attempted a 4k neural rendered demo? Or would there be a way to somehow use the current impressive techniques of machine learning to make a visually impressive demo that fits into a very small executable size? What would be some of your ideas?

# Response 1
Short answer: **yes, people are absolutely still making demos and 4k demos**, and **neural rendering has been discussed and lightly experimented with**, but it hasn’t (yet) displaced classic techniques in the demoscene—largely because of **size, determinism, and hardware constraints** rather than lack of interest.

Let me unpack this in a way that connects old demos, modern neural rendering, and what *could* realistically happen.

---

## 1. Is the demoscene (and 4k demos) still alive?

Very much so.

* The **demoscene is active**, especially in Europe (Assembly, Revision, Evoke, etc.).
* **4k intros** are still a flagship category.
* The focus is still:

  * extreme size constraints,
  * real-time execution,
  * deterministic output,
  * clever abuse of GPUs, shaders, math, and compression.

What has changed is *where* the cleverness lives:

* Early demos → CPU tricks, lookup tables, precalc.
* Mid-era → polygon counts, fixed-function pipelines.
* Modern demos → **procedural content**, **signed distance fields**, **ray marching**, **GPU shaders**, and **audio synthesis from code**.

The spirit is identical to the “building the universe…” era—just with different tools.

---

## 2. About “building the universe…” and precalc

You’re remembering something very real.

Older demos often:

* Generated huge procedural datasets (heightfields, splines, vector scenes)
* Precomputed tables (noise, transforms, textures)
* Took seconds or minutes to initialize

The caption “**building the universe**” (or variants) became a kind of *in-joke* in the scene.

This is conceptually **very similar** to modern neural pipelines:

> Build a representation of the world → render views from it.

So your intuition is spot on.

---

## 3. Neural rendering vs classic demoscene techniques

Here’s the key comparison:

| Classic demoscene | Neural rendering   |
| ----------------- | ------------------ |
| Procedural math   | Learned parameters |
| Deterministic     | Often stochastic   |
| Tiny code         | Large weight blobs |
| GPU-friendly      | Often memory-heavy |
| No training       | Requires training  |

Modern demos already use things that are *philosophically adjacent* to neural rendering:

* **Implicit surfaces** (SDFs)
* **Ray-marched volumes**
* **Procedural textures**
* **Fractal worlds**
* **Noise-based geometry**

These are effectively **hand-designed neural networks**:

* Inputs → math → outputs
* No meshes
* No explicit triangles
* Infinite detail

So triangles have already been “irrelevant” in many top-tier demos for years.

---

## 4. Has anyone actually used neural rendering in a demo?

### Short answer

* **Not in mainstream 4k demos**
* **Some experimental / research-adjacent attempts exist**
* **Mostly offline or hybrid**

### Why not (yet)?

#### 1. **Model size**

Even a *tiny* neural renderer:

* tens or hundreds of KB at best
* often megabytes

That’s already game over for **4k**.

#### 2. **Runtime requirements**

* FP16 / tensor cores
* Large GPU memory
* Non-deterministic execution paths

The demoscene strongly prefers:

* predictable timing
* minimal dependencies
* running on “normal” hardware

#### 3. **Training breaks the illusion**

A big part of demoscene magic is:

> “This *program* creates everything.”

Neural rendering usually implies:

> “This model was trained elsewhere.”

That’s philosophically controversial in the scene (though opinions vary).

---

## 5. But could neural techniques be used *indirectly*?

Yes—and this is where things get interesting.

### ML-assisted, but not ML-dependent demos

Some ideas that *do* fit demoscene values:

#### 1. **Neural compression**

* Train a tiny network offline to approximate:

  * noise
  * BRDFs
  * sky models
  * procedural textures
* Embed only the *weights* and a tiny inference loop

Think:

> Neural net as a compressed lookup table

This is plausible in **64k**, maybe even **8k**, but **4k is brutal**.

#### 2. **Evolved math**

Use ML to:

* discover compact formulas
* simplify shader graphs
* find weird SDF combinations

The *result* is still pure math, no ML runtime.

#### 3. **Tiny implicit neural fields**

Research exists on:

* micro-NeRFs
* sinusoidal representation networks (SIREN)

But even the smallest practical ones today are still too large for 4k *unless* someone pulls off a serious breakthrough.

If that happens, the demoscene will jump on it immediately.

---

## 6. Could there ever be a “4k neural rendered demo”?

**Technically possible?** Maybe.
**Currently realistic?** Not really.

For it to work, you’d need:

* A neural representation that:

  * fits in ~1–2 KB of parameters
  * runs in a few hundred lines of shader code
* Deterministic output
* No heavyweight math libraries

At that point, though, it would start looking less like modern ML and more like:

> A clever analytic function with learned coefficients

Which… brings us full circle back to procedural graphics 😄

---

## 7. If *you* were to explore this today, interesting directions

Given your curiosity, here are ideas that feel very “demoscene-correct”:

### 1. Neural *illusion*, not neural runtime

* Procedural SDF world
* Ray marching
* Materials that *look* neural / photoreal
* Tiny executable

This is where most modern 4k intros already live.

### 2. Hybrid demo

* Small neural net used only for:

  * texture synthesis
  * lighting approximation
* Everything else procedural

### 3. “Fake NeRF”

* Analytic volume
* Learned-looking camera interpolation
* No actual ML

A meta-commentary demo that *appears* neural but isn’t.

### 4. ML as the *composer*

* Train ML to generate:

  * demo scripts
  * shader parameters
  * transitions
* Final output is still classic demoscene code

---

## 8. Big picture

You’ve identified a real conceptual parallel:

> **Old demos:** “build the universe, then render it”
> **Neural rendering:** “learn the universe, then render it”

The demoscene hasn’t embraced neural rendering *yet*, not because it’s unimpressive—but because **procedural math is still unbeatable in size-to-wow ratio**.

That said:
If someone cracks **ultra-tiny neural fields**, it will absolutely become a demoscene milestone.

And when that happens, the scrolltext will probably say something like:

> *“Please wait… training the universe…”*

If you want, I can:

* point you to modern 4k demos worth watching,
* sketch what a “neural-inspired” 4k demo architecture might look like,
* or help you prototype a tiny ray-marched world that already feels like neural rendering.
