This is a fascinating area with several approaches at different price points and accuracy levels. Let me break down the options:

## Most Reliable Clinical-Grade Solutions

**Dedicated wearables** are the gold standard:
- **Chest straps** (like Polar H10) - excellent for heart rate, can detect breathing via respiratory sinus arrhythmia
- **Medical-grade pulse oximeters** - continuous SpO2 and heart rate monitoring
- **Respiratory effort bands** (like the ones used in sleep studies) - stretch sensors around chest/abdomen

These give you the timestamp-level precision you're describing, but aren't usually cheap or open-source.

## Smartphone "Sleep Monitoring" Reality

Here's the truth: **most sleep apps use accelerometer/microphone data and make educated guesses**. They're detecting movement patterns and sound, not actually measuring breathing cycles directly. Apps like Sleep Cycle are useful for trends but won't give you the breath-by-breath timestamps you want. The accuracy is... debatable.

## Open Source / DIY Solutions

**Arduino-based options that actually work:**

1. **MAX30102 sensor** (~$5-10)
   - Measures heart rate and SpO2 via photoplethysmography (PPG)
   - Can derive respiratory rate from the PPG signal
   - Open source libraries available
   - Limitation: needs good contact with skin (usually finger or earlobe)

2. **Respiratory effort belt with stretch sensor**
   - Use a conductive rubber cord or flex sensor
   - Detects chest expansion/contraction
   - Very DIY-friendly and inexpensive (~$10-20)
   - Gives you actual inhale/exhale timestamps

3. **Microphone approach** - you mentioned this, and yes, it can work BUT:
   - Only reliable during sleep or when stationary
   - Requires good noise filtering algorithms
   - Won't work for all-day monitoring (too much ambient noise)
   - Breathing is often too quiet to reliably detect while moving

## Data Formats

The common standards for this type of data:

- **EDF/EDF+** (European Data Format) - used in sleep studies
- **WFDB** (WaveForm DataBase) - PhysioNet standard
- **Simple CSV** with columns like: `timestamp, event_type, value`
  - Example: `2024-11-14 10:23:45.123, inhale_start, NULL`

For heart rate, you'd typically log R-R intervals (time between heartbeats) or just HR in BPM with timestamps.

## The "Pedometer for Breathing" Problem

This is actually **harder than a pedometer** because:
- Steps have clear acceleration signatures
- Breathing cycles are subtle and continuous
- Heart rate varies constantly with activity

**Closest existing solutions:**
- **Fitbit/Apple Watch** - track respiratory rate during sleep, daily HRV
- **Oura Ring** - excellent for overnight breathing/HR monitoring
- **Whoop strap** - continuous HR and HRV, infers respiratory rate

None of these give you a simple "12,847 breaths today" readout, because the medical utility of raw breath counts is questionable compared to patterns, rate variability, and irregularities.

## My Recommendation for Your Use Case

For **all-day, timestamp-accurate monitoring** on a budget:

1. **Best DIY**: ESP32 + MAX30102 sensor worn on ear/finger
   - Continuous HR with millisecond timestamps
   - Derived respiratory rate from PPG signal
   - Can log to SD card or transmit via BLE
   - Total cost: ~$20-30

2. **During sleep**: Add a piezo film or stretch sensor chest band
   - Direct breathing cycle detection
   - Combined with MAX30102 for complete data

3. **Data logging**: Simple CSV with Unix timestamps at microsecond resolution

The hardest part isn't the hardware—it's wearing sensors comfortably for 24 hours and managing the data. Battery life, skin irritation, and data processing become the real challenges.

Would you want me to point you toward specific Arduino/ESP32 projects that do this, or help you design a data format for your specific needs?