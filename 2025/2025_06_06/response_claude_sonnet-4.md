The Amiga and BeOS were both remarkable for their time because they prioritized multimedia capabilities and low-latency audio processing when most other systems treated these as afterthoughts.

## What Made Them Special

The **Amiga** (mid-1980s) had custom chipsets designed specifically for multimedia - Paula handled 4-channel 8-bit audio with hardware mixing, while Agnus managed memory and timing. This hardware-accelerated approach meant audio could be processed with minimal CPU overhead and predictable timing. The operating system was designed around cooperative multitasking optimized for real-time media work.

**BeOS** (1990s) took a different but equally forward-thinking approach - it was built from scratch with pervasive multithreading, a modular microkernel architecture, and what they called the "Media Kit" - a unified framework for handling audio, video, and MIDI with consistent low-latency performance. Every part of the system was designed to handle multiple real-time media streams simultaneously.

Both systems contrasted sharply with DOS/Windows and early Mac systems, which were primarily designed for office work and treated multimedia as an add-on. Unix systems were powerful but generally not optimized for low-latency audio either.

## Real-Time Operating Systems

A "real-time OS" guarantees that critical tasks will complete within specific time bounds - there are "hard" real-time systems (missing a deadline is catastrophic, like in aircraft control) and "soft" real-time systems (missing occasional deadlines degrades performance but isn't catastrophic).

Neither Amiga OS nor BeOS were true real-time operating systems in the technical sense. However, both were designed with "real-time friendly" characteristics - predictable scheduling, low interrupt latency, and priority handling that made them much better for audio work than general-purpose operating systems of their era.

## Modern Successors

There isn't really a direct successor that captures the same "designed for music from the ground up" philosophy. However, **Linux with real-time kernels** (like the RT-PREEMPT patch) comes closest - it can achieve very low latencies suitable for professional audio work. Systems like **Ubuntu Studio** or **AVLinux** package this with pro audio software.

**macOS** deserves mention for Core Audio, which provides excellent low-latency audio performance, though it's not as accessible for tinkering as the Amiga was.

## Modern Platforms for Music Development

For accessible music experimentation:

**Raspberry Pi** running Linux with RT kernel is incredibly affordable and capable. You can run Pure Data, SuperCollider, or Chuck for experimental music programming. The GPIO pins let you interface with hardware sensors and controllers.

**Teensy** microcontrollers (especially Teensy 4.x) with the Audio Library provide an Arduino-like development environment but with serious DSP capabilities - you can build synthesizers, effects, and samplers with surprisingly low latency.

**VCV Rack** (free, cross-platform) provides a modular synthesizer environment that's excellent for experimentation and can host custom modules you develop.

**Web Audio API** in browsers has become surprisingly capable for music applications, though with limitations I'll address below.

## DSP Chips

Dedicated DSP chips haven't disappeared - they've largely been absorbed into other processors. Modern CPUs have extensive SIMD instructions (SSE, AVX, NEON) that handle many DSP tasks efficiently. Graphics processors (GPUs) excel at parallel DSP operations. Many microcontrollers now include DSP-optimized cores.

However, you still find dedicated DSP chips in specialized audio hardware - professional mixing consoles, guitar effects processors, and high-end audio interfaces often use chips from companies like Analog Devices (SHARC processors) or Texas Instruments.

## Web/Browser Limitations

Web Audio API has made browser-based music applications surprisingly viable, but there are still significant constraints:

**Latency**: Even with best practices, you're typically looking at 20-50ms total latency on desktop browsers, which is acceptable for many applications but not for real-time performance where you want under 10ms.

**Audio Context Restrictions**: Browsers require user interaction to start audio contexts (to prevent auto-playing ads), which complicates some application designs.

**Limited Hardware Access**: You can't directly access MIDI hardware, specialized audio interfaces, or low-level audio drivers - everything goes through the browser's audio subsystem.

**Processing Power**: While JavaScript engines are fast, they're still interpreted/JIT-compiled, so CPU-intensive DSP algorithms may struggle compared to native code.

That said, Web Audio API is excellent for educational tools, experimental interfaces, and even some production applications where the convenience of cross-platform deployment outweighs the latency concerns.

The closest thing to the Amiga's "affordable computer designed for music" today might be a Raspberry Pi 4 with a decent USB audio interface, running Linux with RT kernel and your choice of music programming environments. It won't have the Amiga's elegant hardware integration, but it offers similar accessibility and experimental potential.