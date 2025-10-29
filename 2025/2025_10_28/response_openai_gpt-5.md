Nice question — these two projects target similar goals (making music in the browser) but sit at different levels and therefore interface with the Web Audio API in very different ways. I’ll split the answer into (1) the **fundamental architecture differences**, (2) the specific history you read about — **Tone.js reliability / leak reports** (evidence + links to issues), and (3) a **concise recent-version timeline / list of fixes** that are relevant to the leak / scheduling / resource problems you asked about.

---

# 1) Fundamental architecture differences (how each talks to Web Audio)

**Strudel**

* Is primarily a *live-coding / pattern language* (a JS port of TidalCycles). Its core job is to *generate musical events (“haps”/events) from patterns* and schedule/trigger them. The system is organized as: pattern → scheduler → event `onTrigger` → audio backend. The REPL and documentation explain this scheduler-driven flow and show simple WebAudio output examples. Strudel’s default browser audio output is the Web Audio API (and it also supports OSC/SuperDirt or MIDI backends). It historically experimented with Tone.js as one playback option but the project also has its own WebAudio engine (now called *superdough*) and its own scheduler implementation to avoid depending on Tone for everything. ([strudel.cc][1])

* In short: **Strudel = pattern/scheduler (logic) + pluggable audio outputs**. When used with browser audio it tends to drive native WebAudio nodes (or a custom engine like superdough) directly via `onTrigger` callbacks — minimal extra abstraction between its scheduler and WebAudio.

**Tone.js**

* Is a *high-level Web Audio framework / toolkit* that implements a signal-graph, instruments, effects, timing primitives and a global `Transport`. It wraps `AudioContext` (Tone.Context), provides many prebuilt synths/effects, and supplies a comprehensive scheduling/timing API (Transport/Clock/Events). Tone builds a lot of convenience and musical abstractions on top of the Web Audio API and tries to hide low-level details (AudioParam unit conversion, wrapping `AudioParam`s as `Tone.Param`, etc.). ([Tone.js][2])

* In short: **Tone.js = audio-engine + scheduler + many high-level primitives**. It’s intended to be the audio backend / toolkit you build instruments and sequencers with.

**Practical consequence:**

* If you want a *pattern engine* that emits musical events and you want tight, minimal control over the WebAudio graph, Strudel’s model (events → direct WebAudio nodes or a lightweight engine) keeps the surface area small and easier to reason about.
* If you want *ready-made synths, effects, and a full DAW-ish API*, Tone.js gives you a lot — but at the cost of complexity and extra bookkeeping inside the library.

(References: Strudel docs / technical manual; Tone.js docs.) ([strudel.cc][3])

---

# 2) The “Tone.js unreliable / memory leak” story — history & evidence

You mentioned reading that the Strudel author once used Tone.js and later steered away citing performance/memory problems. That is accurate: Strudel’s author documented that Strudel initially used Tone.js Transport and Tone instruments (there’s even an optional `@strudel.cycles/tone` integration package), but experienced **performance problems** (growing garbage, crackling/CPU rise, memory not freed) in some scenarios and therefore implemented a simpler scheduler + a dedicated audio engine (superdough) as the “default” path. The Strudel writeup explicitly says Tone.js scheduling worked but the author preferred a simpler scheduler and noted leaks / performance problems with Tone.js in practice. ([Loophole Letters Blog][4])

Concrete historical evidence on the Tone.js side: there are several GitHub issues going back multiple years where users reported memory/CPU problems, audio crackling after minutes of running, or AudioBuffer / Player objects not being freed after `.dispose()` (examples below). These are real bug reports from the Tone.js issue tracker:

* High CPU / crackling (growing CPU over time): issue examples. ([GitHub][5])
* Memory not freed after creating/disposing Tone.Player / Tone.Buffer: issue #620. ([GitHub][6])
* General “notes get cut off after multiple plays” and other symptoms that seemed leak-like: issue #541. ([GitHub][7])
* Old reports of buffer/callback leaks: issue #378 (mentions “severe memory leak involving undisposed callbacks”). ([GitHub][8])

So: **yes**, several users filed issues (2017–2020 and later) describing memory/CPU problems — and those reports likely motivated Strudel’s maintainers to avoid relying on Tone for all outputs in performance-critical live coding.

---

# 3) Have those issues been *officially* identified and addressed? — recent version timeline & fixes

**Short answer:** many of the pain points reported over the years were identified in issues and then explicitly addressed across Tone.js releases. The project’s changelog and commits include fixes that directly relate to causes of leaks and scheduling/resource mismanagement (examples below). That said, whether *every* class of leak disappeared depends on your usage pattern — some user code patterns (creating many short-lived nodes, failing to dispose objects, etc.) can still produce resource pressure; but Tone.js has added a number of targeted fixes.

Key fixes / changes (picked from Tone.js changelog + releases / commits):

* **Garbage-collect nodes used for Transport syncing** — explicit code to free nodes created to sync with Transport. This targets a common cause of nodes being held in memory. ([GitHub][9])
* **Load only a single AudioWorklet** and improved Worklet handling (reduces duplicated heavy worklets which can cause memory/overhead). ([GitHub][9])
* **Added createMediaElementSource** support and improvements to Buffer loading Promises — gives alternative ways to play media (sometimes using media elements is lighter on memory than repeatedly creating AudioBuffers). ([GitHub][9])
* **Clock/Transport improvements:** moving clock implementations away from ScriptProcessorNode (and using Web Worker / better timers) and optimizing Tone.Draw to loop only when events are scheduled — reduces CPU pressure and potential leak sources. ([GitHub][10])
* **Param / API fixes and bug fixes** across many releases (improving Envelope handling, Memory usage, and scheduling correctness). The changelog shows numerous bugfixes and small API changes intended to prevent resource misuse. ([GitHub][10])

**Where to see specifics:** Tone.js releases and the project changelog list the major release notes (r6..r11 and later named versions, and changelog entries for 14.x / 15.x); the raw dev `CHANGELOG.md` captures many fixes (garbage collection, worklet handling, media element support, etc.). ([GitHub][10])

**Bottom line on whether issues were addressed:**

* **Yes — many leak/scheduling/CPU issues were acknowledged and addressed in subsequent releases** (garbage-collecting, better clock implementation, media element options, AudioWorklet improvements). The changelog documents focused fixes that reduce the class of problems Strudel’s author observed. ([GitHub][9])
* **Caveat:** Web audio is complex and leaks can come from multiple sources (browser bugs, user code that retains references, repeatedly creating heavy nodes instead of reusing/dispose). Even though Tone.js fixed many library-side causes, users should still follow best practice (re-use nodes, call `.dispose()` when done, prefer media elements when repeatedly loading long audio, test in target browsers).

---

# 4) Compact timeline of *recent* major Tone.js changes (high-level)

(Selected highlights from the project releases / changelog — these are the kinds of release-level items relevant to stability and memory/scheduling.)

* **r6 → r11 era** (the numbered `rX` releases on GitHub): introduced a large refactor of scheduling (new event classes: `Tone.Event`, `Tone.Loop`, `Tone.Part`, …), moved timing primitives forward, switched some clock code to `requestAnimationFrame` / Web Worker approach, and replaced ScriptProcessorNode usages. These were big structural changes to timing and scheduling. ([GitHub][10])

* **r9 / r10 / r11 notes** — added: `Tone.Context` wrapping of `AudioContext`, `Tone.Offline` improvements, optimizations to `Tone.Draw`, new/improved Buffer/Player handling, and many bug fixes focused on scheduling correctness and resource cleanup. ([GitHub][10])

* **14.x / 15.x (recent dev/changelog entries)** — more incremental fixes and modernizations: garbage collecting transport-sync nodes, adding `createMediaElementSource`, limiting AudioWorklet loading, memoizing some time conversion helpers, ESM/module build updates, more robust handling of the native contexts and offline rendering – all targeted at both API ergonomics and runtime/performance correctness. (See the `CHANGELOG.md` for granular entries.) ([GitHub][9])

(If you want, I can extract the exact release tag names and dates from the GitHub releases page and present a short table. I pulled the changelog and release notes while researching this answer — the changelog is the best single-place summary of which issues were fixed in which commits/releases.) ([GitHub][10])

---

# 5) Practical recommendation / closing advice

* If you’re building a *pattern sequencer / live-coding environment* like Strudel, it often makes sense to keep the scheduling and event→audio boundary lean (patterns → scheduler → small `onTrigger` that reuses minimal WebAudio nodes or a small, specialized engine). That minimizes the number of objects the library must manage and reduces interactions with complicated library internals. Strudel’s movement to a custom/simpler scheduler + superdough reflects that tradeoff. ([Loophole Letters Blog][11])

* If you want to use **Tone.js** (many developers do because it gives synths/effects/transport):

  * Use **up-to-date Tone releases** (the team has fixed many of the common leak/scheduling bugs).
  * Follow best practices: reuse nodes, call `.dispose()` on Tone objects you no longer need, and test long-running sessions in the target browsers to see whether memory or CPU grows.
  * If playing many different audio files in sequence, consider using `<audio>` + `createMediaElementSource()` or reusing a single `AudioBuffer` rather than creating and destroying many `AudioBuffer`s. (Tone added facilities to help with media element playback and buffer handling.) ([GitHub][9])

---

## Sources / pointers (selected)

* Strudel technical manual / REPL and notes about scheduling & Tone.js usage. ([strudel.cc][1])
* Strudel docs: WebAudio default output, superdough, SuperDirt notes. ([strudel.cc][12])
* `@strudel.cycles/tone` (npm) — an integration package (deprecated). ([npm][13])
* Tone.js official site / docs (Transport, Synths, architecture). ([Tone.js][2])
* Tone.js GitHub issues showing user-reported leaks / CPU/crackling problems (examples: #274, #378, #541, #620). ([GitHub][5])
* Tone.js changelog / releases (entries about garbage collection, AudioWorklet & Transport fixes, createMediaElementSource, Clock/Draw optimizations). ([GitHub][10])

---

If you want, I can:

* pull the Tone.js **exact** release tags with dates and produce a tiny table of release → date → most relevant fixes (I'll parse GitHub releases / CHANGELOG entries), **or**
* prepare a short demo showing two small playback backends for Strudel-like events: one that uses pure WebAudio and one that uses Tone.js, so you can compare memory/heap behavior locally.

Which of those would be most useful to you next?

[1]: https://strudel.cc/technical-manual/repl/?utm_source=chatgpt.com "REPL"
[2]: https://tonejs.github.io/?utm_source=chatgpt.com "Tone.js"
[3]: https://strudel.cc/technical-manual/internals/?utm_source=chatgpt.com "Internals 🌀 Strudel"
[4]: https://loophole-letters.vercel.app/strudel?utm_source=chatgpt.com "Introducing Strudel"
[5]: https://github.com/Tonejs/Tone.js/issues/274?utm_source=chatgpt.com "Cracklings due to CPU Leak after 1-2 minutes #274"
[6]: https://github.com/Tonejs/Tone.js/issues/620?utm_source=chatgpt.com "Memory Leak from Tone.Player / Tone.Buffer not correctly ..."
[7]: https://github.com/Tonejs/Tone.js/issues/541?utm_source=chatgpt.com "notes get cut off and play short after multiple plays #541"
[8]: https://github.com/Tonejs/Tone.js/issues/378?utm_source=chatgpt.com "Issue #378 · Tonejs/Tone.js - Buffer overrun"
[9]: https://raw.githubusercontent.com/Tonejs/Tone.js/dev/CHANGELOG.md?utm_source=chatgpt.com "https://raw.githubusercontent.com/Tonejs/Tone.js/d..."
[10]: https://github.com/Tonejs/Tone.js/releases "Releases · Tonejs/Tone.js · GitHub"
[11]: https://loophole-letters.vercel.app/strudel1year?utm_source=chatgpt.com "1 Year of Strudel"
[12]: https://strudel.cc/learn/getting-started/?utm_source=chatgpt.com "strudel DOCS"
[13]: https://www.npmjs.com/package/%40strudel.cycles/tone?activeTab=readme&utm_source=chatgpt.com "@strudel.cycles/tone - npm"
