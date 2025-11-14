Short answer: **yes — there are many reliable ways** to monitor breathing and heart rate. Which is “best” depends on your constraints (accuracy needed, comfort for 24-hour wear, budget, openness of the stack). Below I summarize practical options, tradeoffs, open-source choices and file/annotation formats — plus a tiny, copy-pasteable example of the exact timestamp output you requested.

---

# How people reliably measure these signals (overview & tradeoffs)

* **Clinical / most reliable (gold standard):** ECG (electrical) for heartbeat and nasal/thermistor/airflow or a chest-belt (respiratory inductance plethysmography — RIP) for respiration. High accuracy but usually somewhat obtrusive. Useful if you need beat-by-beat timestamps and respiratory phase. ([MDPI][1])
* **Consumer wearables:** wrist PPG (Apple Watch, Fitbit), chest-strap ECG (Polar H10), ring sensors (Oura) — these are comfortable for long periods and give continuous HR and *often* estimate respiratory rate, but accuracy for fine events (exact inhale onset) is limited compared to chest/airflow sensors. ([MDPI][1])
* **Contactless / phone based:** camera-PPG (face color changes), microphone (acoustic breathing), radar/Doppler, thermal imaging and ballistocardiography (BCG) under mattress. These can be very convenient (no wearable) and are actively researched — some smartphone contactless systems can detect breathing and sleep apnea — but they’re sensitive to placement, motion and noisy environments. Good for sleep or short monitoring; harder to guarantee 24-hour reliability. ([apnea.cs.washington.edu][2])
* **DIY / hobbyist:** PPG modules (MAX3010x family, PulseSensor) for heartbeat + a chest-belt/stretch sensor/piezo for respiration. Low cost and works well if you accept tradeoffs (need to fight motion artifacts, comfortable mounting, logging). Lots of Arduino libraries / examples exist. ([Last Minute Engineers][3])

---

# Is “just a microphone” enough?

* **Possible, but limited.** Microphone-based breathing detection (breath sounds and chest/airflow acoustics) can detect inhale/exhale events and respiratory rate in quiet conditions and with good signal processing; there are academic systems demonstrating it. In real-world, continuous day-long monitoring with a phone mic will struggle with ambient noise, speech, eating, and positional changes. So microphone alone is **feasible** for controlled or night-time monitoring, **not** the most robust for 24-hour continuous tracking. ([ScienceDirect][4])

---

# Best low-cost / open-source solutions (practical)

1. **OpenBCI** — open hardware & software biosensing platform. Can record ECG and other biosignals and is widely used in open research projects; flexible but pricier than tiny hobby sensors. Good if you want an open stack and clinical-like signals. ([openbci.com][5])
2. **MAX30102 / MAX30105 / PulseSensor (PPG modules)** — cheap, easy to use with Arduino/ESP32. Many libraries and tutorials exist; good for heart rate (and with extra processing you can extract beat timestamps). Combine with a small **stretch sensor / resistive belt / piezo** or **MPU-type accelerometer** on the chest to get breathing phase. ([Arduino Project Hub][6])
3. **DIY chest belt (RIP style)** — simplest reliable way to get inhale/exhale onsets: a band that changes resistance/voltage when it expands (commercial RIP belts exist, or DIY with conductive thread/stretch sensor). Combine with a small datalogger (ESP32 + SD card) for 24-hour logging. See hobby guides / instructables. ([Science Buddies][7])
4. **Contactless smartphone methods** — useful for sleep or periodic checks. University of Washington work shows phone-based contactless sleep apnea detection using chest motion; many papers show microphone/camera methods for sleep respiration. Good if you don’t want to wear anything but expect limitations. ([apnea.cs.washington.edu][2])

---

# Practical recommended setup for **single-person, all-day** monitoring with good reliability (DIY / low cost)

* **Heartbeat:** MAX30102 on finger/ear or a small ECG front-end (OpenBCI or low-cost 1–lead ECG module). Use PPG for convenience (finger/ear clip) or ECG for best beat timing. Sample at ≥100 Hz (PPG) or 250–500 Hz (ECG) for precise beat timing. ([Last Minute Engineers][3])
* **Breathing:** elastic chest belt with a stretch sensor / force-sensitive resistor or small accelerometer (IMU) glued to chest. Sample at 10–50 Hz. Detect inhale onset when belt expansion crosses threshold / phase of envelope. (RIP belts are the clinical analogy.) ([PMC][8])
* **Logger & stack:** ESP32 / Arduino with SD card or Bluetooth to a phone + store timestamps locally. Use existing open libraries for PPG and for IMU / FSR. If you want a fully open research stack, use OpenBCI which will give richer signals. ([openbci.com][5])

Rough cost (typical): PPG sensor $10–40, stretch belt components $5–20, microcontroller $5–15, total inexpensive for a prototype (< $100), more if you go OpenBCI or clinical sensors.

---

# Common data formats and how to store the events you asked for

* **Simple and practical:** CSV / JSON time series with ISO-8601 timestamps. Very portable. Example (CSV) — this is exactly the format you asked for:

```
# events.csv
ts_iso,event,source,extra
2025-11-14T00:00:02.124Z,inhale_start,breath_belt,amplitude=0.12
2025-11-14T00:00:03.762Z,exhale_start,breath_belt,amplitude=-0.09
2025-11-14T00:00:04.010Z,heartbeat,ppg_peak,bpm=72
...
```

* **Research / clinical standards:**

  * **EDF / EDF+** — widely used for polysomnography and long multichannel physiological recordings, supports annotations (events) and is an interoperable clinical format. Good if you plan to share data with sleep researchers. ([Wikipedia][9])
  * **WFDB / PhysioNet formats** — common in ECG/physiological signal research (MIT-BIH etc.). Provides waveform + annotation files for beats and events. Good if you want to use PhysioNet tools. ([WFDB][10])

If your needs are just “breaths per 24h” + exact inhale/exhale timestamps, CSV/JSON is simplest. If you later want to publish or use sleep scoring tools, export to EDF+ or WFDB.

---

# Algorithms / signal processing notes (practical tips)

* **Heartbeat from PPG:** bandpass → peak detection on the pulse waveform → output peak timestamps (PPG peaks) or inter-beat intervals. Watch for motion artifacts and poor contact.
* **Respiration from chest belt/stretch:** filter low-pass, compute envelope, detect rising edge (inhale_start) and falling edge (exhale_start). If using microphone, detect low-frequency energy bands and use the envelope to find inhalation/exhalation.
* **Synchronisation:** use a single clock (ESP32 with NTP or store monotonic ms along with UTC offsets) so heartbeat and breathing timestamps align.
* **Motion handling:** add an IMU (accelerometer) and ignore epochs with large motion or flag them as low-confidence.

---

# Example project path (fastest working prototype)

1. Buy a **MAX30102** breakout + a **stretch sensor or piezo belt** + ESP32 + SD card. (Code and Arduino libraries are abundant.) ([Arduino Project Hub][6])
2. Implement two threads: read PPG and read belt → do simple filters → detect peaks/edges → write timestamped events to CSV on SD.
3. Test in quiet conditions, validate by manual counting or comparing to a reference (chest strap or phone app). Iterate thresholds and filtering.

---

# Are there ready “breath/heartbeat pedometers”?

* Consumer devices provide counts/derived respiratory metrics (some smartwatches, Oura ring, sleep apps) but there isn’t a dominant open hardware “breath pedometer” box everyone uses — the hobbyist route is to combine open sensors (PPG + chest belt) or use OpenBCI if you want a polished open platform. If you just want daily breath counts and a simple UI, a cheap PPG + belt + ESP32 logger is the usual DIY approach. ([openbci.com][5])

---

# Key limitations & caveats

* **Motion artifacts** are the biggest problem for continuous all-day monitoring (especially for PPG and microphone).
* **Sensor placement & comfort** matter for 24-hour use — chest belts can be uncomfortable for day use; rings/wrist sensors are more comfortable but less precise for respiration phase.
* **Regulatory / medical claims:** DIY solutions are fine for personal quantification, but don’t use them to make medical decisions unless validated clinically.

---

If you want, I can **(choose one and I’ll produce it now)**:
• a parts list + wiring diagram + Arduino/ESP32 sketch that outputs the CSV timestamps above (PPG + chest belt), or
• a short Python script to convert PPG/ECG waveform + belt waveform into inhale/exhale + heartbeat timestamps (gives edge/peak detection code), or
• a minimal OpenBCI setup showing how to record ECG + belt and export EDF/WFDB.

Which one should I build for you right now?

[1]: https://www.mdpi.com/1424-8220/23/10/4805?utm_source=chatgpt.com "Electrocardiogram Monitoring Wearable Devices and ..."
[2]: https://apnea.cs.washington.edu/apneaapp.pdf?utm_source=chatgpt.com "Contactless Sleep Apnea Detection on Smartphones"
[3]: https://lastminuteengineers.com/max30102-pulse-oximeter-heart-rate-sensor-arduino-tutorial/?utm_source=chatgpt.com "Interfacing MAX30102 Pulse Oximeter and Heart Rate ..."
[4]: https://www.sciencedirect.com/science/article/abs/pii/S1746809422007728?utm_source=chatgpt.com "Estimation of respiratory rate and exhale duration using ..."
[5]: https://openbci.com/?utm_source=chatgpt.com "OpenBCI | Home"
[6]: https://projecthub.arduino.cc/SurtrTech/measure-heart-rate-and-spo2-with-max30102-eb4f74?utm_source=chatgpt.com "Measure Heart Rate and SpO2 with MAX30102"
[7]: https://www.sciencebuddies.org/science-fair-projects/project-ideas/HumBio_p055/human-biology-health/train-belly-breathing?utm_source=chatgpt.com "Build an Arduino Breathing Monitor | Science Project"
[8]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10886711/?utm_source=chatgpt.com "Advances in Respiratory Monitoring - PubMed Central - NIH"
[9]: https://en.wikipedia.org/wiki/European_Data_Format?utm_source=chatgpt.com "European Data Format"
[10]: https://wfdb.io/?utm_source=chatgpt.com "WFDB: Home"
