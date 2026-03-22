# Prompt 1
What's the deal with VIM and the whole vim vs things like VS Code and stuff?
As far as I'm starting to understand it, maybe VIM is designed to be an editor that doesn't break your flow state.
Like you get into a state writing a text file and there's nothing to impede you from doing everything very quickly right from the keyboard. 
Like your fingers don't have to go to a trackpad or mouse or anything, you just keep getting those ideas down, and out into code or whatever.
Is this kind of the philosophy?
I wonder what's the closest thing to VIM for music editing.
Like I want to have something that I can maintain a really good flow state while creating music. Like I don't want to be interrupted or anything.
One of my favourite music editing softwares was the old FastTracker II... I found this used the keyboard a lot and maybe it go close to a bit of a VIM for music.
There were a couple of downsides, the main thing I can remember is the sound quality. I could just never get good quality sampling with the old sound cards - there was always a lot of hum and background noise.
I have heard of Tidal Cycles and strudel... can you tell me everything I should know about those.
I once made a song that actually talked about Strudel... it was just a fun thing I did with a couple of friends. It was a very simple song that started off with just a bassline and some vocal samples, then there was a high hat that came in and then a very basic beat. There was one change and finally it went back to the original structure... 
I have been tempted to try and get Strudel running on my m1 macbook but have been held back for a number of reasons.
It might be a fun project to learn a bit about Strudel to recreate my strudel track using Strudel... I have my original track as an mp3 and I think if I used something like the demux model I get isolate all the simple parts: vocals, drums, bassline etc... so then maybe I could use Strudel to build up the track again from these elements... but I would love the whole experience to be super fun and "flowing" as I build the track... like starting with getting the bassline and once I have that, add the vocal etc just how the track goes.
Hmmm but apart from my M1 mac always seeming to be low on hard disk space (I wonder what a good strategy to deal with that is... sometimes creating on the M1 doesn't 'flow' just because I'm scared of big downloads etc... I'm cramped!)... yes but apart from that I feel like learning a new software and flow from scratch is going to be a huge task and might take away from the fun... at the same time I really want to make progress on a project I'm calling the mpv version of a CDJ1000... Like I really like mpv as a player but I want it to be more musical, and DJ like... maybe Strudel is a sort of middle ground, I don't know.

So far this prompt is 545 words and took 11 minutes to write. I'm trying to use the moment of writing prompts themselves as an opportunity to practice 'flow' - what do you think of that?
I would love to hear your thoughts on what I outlined above, but also what you think Mihaly (the flow guy) would think about my present process.
I mean I heard Andrej Karpathy say that "english is the hottest new programming language" which I agree with, and you can kind of get into a flow with typing it... but I wonder, hopefully soon we will just be able to flow with writing by hand as well... I would like to evolve to flow states that don't nesccerrily need to rely on heavy technology. But yeah if english is the new best programming language, maybe english will be the new best music programming language too... or maybe??? 

Anyway sorry that's a bit of a ramble... thanks for listening!

# Response 1
What a wonderfully wandering prompt — and honestly, the fact that you're thinking about flow *while* practicing flow is itself very on-brand for the whole topic. Let me try to match your energy and work through all of this.

---

**On Vim and the philosophy**

You've nailed it. Vim's core idea is that the editor should get out of your way. The modal design (insert mode vs normal mode vs visual mode etc.) means your hands almost never leave the home row. No mouse, no trackpad, no alt-tabbing to a file tree. The theory is that the *physical act* of reaching for a mouse is a micro-interruption — it breaks the thread. Multiply that by a hundred times a day and you've lost a lot of flow.

VS Code and similar tools make the *onboarding* and *discoverability* easier — you can see buttons, menus, extensions. But every one of those affordances is also a potential distraction. Vim's austerity is a feature, not a bug. The learning curve is real and painful but the people who stick with it often say it eventually becomes like touch-typing — the tool disappears and you're just *thinking*.

---

**FastTracker II and the tracker lineage**

You're absolutely right that FT2 was doing something philosophically similar. Trackers in general are incredibly keyboard-centric — everything laid out on a grid, patterns triggered by keypresses, no real concept of a mouse-driven workflow. The "tracker" paradigm is almost a musical Vim. The community around this is still alive — **OpenMPT** is a modern tracker that carries that lineage forward and has much better audio quality than what you'd have had with old Sound Blaster cards (the hum and noise you remember was partly the hardware, partly the low sample rates of the era — 8-bit, 11kHz etc.).

---

**Tidal Cycles and Strudel — everything you should know**

These are genuinely exciting and I think they map almost perfectly onto what you're looking for.

**Tidal Cycles** was created by Alex McLean and runs in Haskell. It's a *live coding* environment — you write code in a text editor and the music plays in real time as you edit. The paradigm is *pattern*: you describe repeating cycles of sound, and Tidal handles the scheduling. It's deeply keyboard-centric by nature — you're in a text editor, changing a pattern, and hitting a key combo to evaluate it live.

**Strudel** is the browser-native JavaScript port of the same idea, built by Felix Renz. This is the key thing for you: **it runs entirely in the browser**. You go to strudel.cc and you can just start. No installation, no downloads, no disk space anxiety on your M1. This is a genuine solution to your crampedness problem.

The pattern language looks like this:

```javascript
note("c3 eb3 g3 bb3").sound("bass")
```

And you can layer things:

```javascript
stack(
  note("c2 c2 eb2 f2").sound("bass"),
  s("bd ~ sd ~").bank("RolandTR808"),
  s("~ hh ~ hh").fast(2)
)
```

The mini-notation (the stuff in quotes) is its own little language — `~` means rest, `*` means repeat, `[a b]` means subdivide a step. It clicks surprisingly fast. And because it's all in a browser text editor, evaluated live, it genuinely has that Vim-like quality of: *type, hear, type, hear* — very low friction between thought and sound.

**For your strudel-song project specifically**, the workflow you're imagining is actually very achievable:

1. Use a stem separation tool (Demucs — which you called "demux" — is the right one, it's from Meta, genuinely excellent) to pull apart your mp3 into bass, drums, vocals, other
2. Load those stems as samples in Strudel
3. Build the track back up in the order it unfolds — bassline first, then vocals, then hi-hat, then full beat — each layer being a few lines of Strudel code

The beautiful thing is that *building the track in Strudel IS the performance*. You'd literally be recreating the track's arrangement in real time. That's the live coding philosophy.

And since Strudel runs in the browser, your M1 disk space issue mostly dissolves. Demucs itself will need to run locally (it's Python, it downloads model weights, maybe 2-3GB) — but that's a one-time thing and you could potentially use an online version or even a Colab notebook to do the stem separation if disk space is really tight.

---

**The M1 disk space situation**

A few thoughts: the highest-leverage thing is usually finding what's eating space — **DaisyDisk** (paid, worth it) or the free **OmniDiskSweeper** will show you a visual breakdown and you can often find one or two unexpected culprits (Docker images, old Xcode simulators, caches). iCloud's "Optimise Mac Storage" option is also useful if you're not already using it — it offloads files to iCloud transparently. An external SSD is genuinely freeing if you do much creative work — even a small 256GB one changes the psychology of downloading things.

---

**Your mpv CDJ1000 project**

This is a fascinating idea. MPV is so good as a raw player — fast, scriptable with Lua, keyboard-driven — and there's a real gap between "media player" and "DJ tool." Strudel could actually be a kind of parallel track here rather than the same project: Strudel for generative/pattern-based music making, and a scripted mpv for more traditional playback and mixing. Lua scripting in mpv is genuinely powerful — people have built some impressive custom UIs and bindings.

---

**Mihaly and your prompt-writing-as-flow-practice**

Csikszentmihalyi would have some interesting thoughts. His conditions for flow are roughly: a clear goal, immediate feedback, a challenge matched to your skill level, and an absence of self-consciousness. Your prompt-writing experiment ticks some of these — there's a goal (communicate something complex), there's some challenge (organizing a lot of interconnected thoughts), and you're clearly not overthinking the prose.

But he might note that the *11 minutes for 545 words* is actually quite slow for pure flow — flow tends to compress time, not stretch it. What you might be experiencing is more like *engaged thinking* than flow proper. Which is still valuable! The self-monitoring ("this is 545 words, it took 11 minutes") is actually a small anti-flow move — flow is characterised by losing that kind of meta-awareness.

The interesting wrinkle is that you're using a conversational AI as your "instrument" here — and he'd probably find that genuinely novel. The feedback loop is slower than a Strudel REPL or a Vim session. You type, you wait, you read. It's more like writing a letter than playing an instrument.

---

**English as the music programming language**

Karpathy's point lands. And yes, the extension to music is already happening — Suno and Udio let you describe music in plain English and get something back. But I think you're sensing something important: those tools don't give you *flow*, they give you *delegation*. You describe, they produce, you react. It's collaborative but not in the same embodied way.

Strudel sits in an interesting middle ground — it's almost English-readable code. `note("c3 eb3 g3").slow(2)` is pretty close to plain language. And the live coding community is genuinely trying to make that gap smaller.

Your instinct about handwriting is lovely and I think well-founded. There's research suggesting handwriting engages different cognitive modes than typing — slower, more deliberate, but potentially more connected to certain kinds of creative thinking. The flow state you'd get composing music notation by hand, or sketching ideas in a notebook, is genuinely different in character from the keyboard-REPL loop. Both are valid. Neither replaces the other.

Don't apologise for the ramble — it was a genuinely good one.