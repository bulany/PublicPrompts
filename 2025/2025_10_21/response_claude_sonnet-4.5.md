This is a fantastic problem to think through! Let me start with your USB capacity question, then explore solutions.

## How many songs on 20GB?

A high-quality MP3 (320kbps) is roughly **8-10MB per song** (for a ~4 minute track).

So 20GB ÷ 8MB = **~2,500 songs**

That's roughly 170 hours of music, or about **150-200 albums**. Definitely a substantial collection, though perhaps not quite a "lifetime" for a serious collector. But if you went with slightly lower quality (192kbps, still very good), you could get closer to **4,000 songs**.

## Your Interface Problem is Real

You've identified the core issue perfectly: the physical browsing experience of vinyl is irreplaceable with traditional digital interfaces. A 7-year-old navigating nested folder structures is a non-starter.

## Existing Solutions Worth Checking Out

1. **NFC/RFID systems** - This is closest to what you're imagining:
   - Products like **Yoto Player** (kid-focused, uses physical cards)
   - **Crosley Voyager Vinyl Bluetooth** uses RFID stickers
   - DIY: Raspberry Pi + **MFRC522 RFID reader** (~$5) + cheap RFID tags/cards (~$0.20 each)

2. **Old iPod + grid of buttons** - Some people have modded iPod Classics with modern storage. Not quite the physical browsing though.

## Your Best DIY Approach: RFID/NFC Cards

I think you're on the right track, but **skip QR codes** (requires camera, alignment, lighting) and **use RFID/NFC tags instead**:

### The Setup:
- **Raspberry Pi Zero 2 W** (~$15) + MFRC522 RFID reader (~$5)
- Small speaker or 3.5mm to existing speakers
- Print "album sleeves" (postcard-sized cards) with artwork
- Stick an **RFID tag** on each card (~$0.20 per tag)
- Kid taps card on reader → music plays instantly

### Why This Works:
- **Visual browsing**: Cards spread on table or in a box
- **Physical interaction**: Pick, tap, done
- **Memory palace**: Visual artwork aids memory
- **7-year-old proof**: One action (tap)
- **Scalable**: Order more tags/cards as collection grows

### The Phone Idea
Your telephone concept is actually brilliant for a different reason - **rotary dials are inherently satisfying** and could work as a volume control or track skip mechanism. But for selection? Too cumbersome compared to physical cards.

## Platform Choice

**Raspberry Pi** is perfect for this because:
- Native audio support
- Easy Python libraries for RFID (SPI protocol)
- Can run MPD (Music Player Daemon) or VLC
- WiFi built-in for updates/management
- Enough power for eventual audio processing

**Arduino** would be too limited - harder to handle MP3 decoding, file systems, and audio output.

## The Mechanical Playback Dream

For eventual **vinyl-like physical control** (wow/flutter, pitch control, scratching):
- **Raspberry Pi + Rotary encoder** for pitch/speed control
- **Serato-style control**: This is complex but doable
  - You'd need a real turntable with control vinyl
  - USB audio interface to read the control signal
  - Software (like **xwax** on Linux) to interpret it
  - This turns your Pi into a DVS (Digital Vinyl System)

This is definitely achievable on Pi, though it's an advanced project.

## My Recommendation

Start simple:
1. **Phase 1**: Pi + RFID reader + printed cards (weekend project, ~$50 total)
2. **Phase 2**: Add physical controls (volume knob, skip buttons, LED feedback)
3. **Phase 3**: Housing/enclosure that looks appealing
4. **Phase 4**: DVS integration if you want true vinyl control

The RFID card system gives you 90% of what you want immediately - that tactile, visual, browsable interface that a kid can master in 30 seconds.

Want me to sketch out the basic Python code structure for Phase 1, or help you design what the card system might look like?