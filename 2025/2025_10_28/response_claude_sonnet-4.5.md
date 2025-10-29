Great questions about these two browser-based music frameworks! Let me break down their architectural differences and look into the Tone.js issues you mentioned.

## Architectural Differences

**Tone.js** is a comprehensive Web Audio framework that provides:
- A high-level abstraction layer over the Web Audio API
- Object-oriented approach with instruments, effects, and signal routing
- Built-in scheduling system (Transport) for musical timing
- Extensive library of synthesizers, samplers, and effects
- Manages a complex graph of audio nodes with automatic cleanup

**Strudel** is specifically designed for live coding and pattern-based composition:
- Uses a functional pattern language (inspired by Tidal Cycles)
- Originally did use Tone.js as its audio engine
- Now uses a more lightweight approach interfacing directly with Web Audio API
- Focuses on pattern evaluation and scheduling rather than providing a full synthesis library
- More minimal audio node management tailored to its pattern-based paradigm

## The Tone.js Issues

You're right about the history - Strudel's creator (Felix Roos) did move away from Tone.js. The concerns included:
- Memory management issues with long-running sessions
- Overhead from Tone.js's abstractions for Strudel's specific use case
- Timing precision requirements for live coding scenarios

Let me search for information about specific Tone.js issues and their resolution timeline.Let me fetch the actual changelog to get specific version information:Based on my search results, here's what I found about Tone.js issues and versions:

## Documented Issues

Yes, several significant issues have been officially identified in Tone.js's GitHub repository:

### Memory-Related Issues

**Memory leaks from Tone.Player/Tone.Buffer** - A 2020 issue reported that AudioBuffers weren't being properly freed even after calling dispose() on Players and internal Buffers

**CPU leaks causing crackling** - A 2017 issue described CPU usage constantly rising from 1-2% to 13% within a minute when using Transport scheduling, leading to audio crackling

**Mobile-specific memory issues** - iOS devices experienced notes getting cut off after prolonged use, behaving like a memory leak, particularly when using triggerAttackRelease

**Out of memory crashes** - A 2021 report showed pages crashing when loading many audio samples, with RAM usage reaching 4-5GB despite source files only being 100MB (due to decoded audio buffers)

### Performance Issues

**Buffer overrun problems** - Users reported consistent clipping and audio stoppage when triggering multiple samples rapidly, with issues beginning when active buffers exceeded 300

## Version Timeline (Recent Major Releases)

The search results show the following progression:

- **Version 13.x** (circa 2019-2020) - Major architectural change where AudioNode.prototype.connect was no longer overwritten
- **Version 14.x** (2020-2023) - Version 14.8.32 was in use by November 2021, with updates continuing through 14.8.49 in 2023
- **Version 15.x** (2023-present) - Current stable version is 15.1.22 as of 6 months ago (April 2025)

## What's Been Addressed

The major architectural changes in version 13+ and the complete TypeScript rewrite suggest significant refactoring, but the search results don't explicitly document which specific memory leak issues were fixed. The transition to TypeScript and the changes to how native AudioNodes connect with Tone.js nodes in version 13 likely addressed some underlying architectural issues.

However, other frameworks like Glicol.js have positioned themselves as alternatives, specifically claiming "no memory leaking" and "no garbage-collection in audio thread" as advantages over Tone.js, suggesting concerns may persist.

For Strudel's decision to move away from Tone.js, it was likely a combination of these documented memory/performance concerns plus the desire for a more lightweight, purpose-built solution for live coding's specific requirements.