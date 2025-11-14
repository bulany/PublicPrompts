This is a great set of questions, and you've correctly identified that the *type* of data you want (precise timestamps for inhale/exhale) is much more specific than what most consumer apps provide.

Here’s a breakdown of the most reliable methods, the low-cost options, and how you could build the "breathing pedometer" you're imagining.

### Most Common vs. Most Reliable Solutions

There's a big difference between what's *common* (consumer-friendly) and what's *reliable* (medically accurate).

* **Heart Rate:**
    * **Most Common (Consumer):** Smartwatches and fitness trackers (like Apple Watch, Fitbit). They use **photoplethysmography (PPG)**, which is the green light that shines into your skin. It's very accurate at rest but can be less reliable during intense exercise.
    * **Most Reliable (Medical):** **Electrocardiogram (ECG)**. This measures the actual electrical signals from your heart. Consumer-grade chest straps (like the Polar H10) use this method and are considered the gold standard for accuracy.

* **Breathing (Respiration):**
    * **Most Common (Consumer):** This is where your guess about sleep apps comes in. They are the most common tool, but they *estimate* breathing. They don't track it precisely.
    * **Most Reliable (Medical):** Medical-grade solutions use **Respiratory Inductance Plethysmography (RIP)**, which involves one or two elastic bands around the chest and abdomen to measure their expansion and contraction.

---

### How Smartphone Sleep Apps *Actually* Work

You're right to be skeptical. Smartphone apps **do not** reliably give you `inhale_start` and `exhale_start` timestamps. They typically use two or three methods:

1.  **Microphone:** Listens for acoustic signals like snoring, coughing, or specific breathing-related sounds. This is very prone to background noise and can't distinguish a quiet inhale from silence.
2.  **Accelerometer:** Uses the phone's motion sensor to detect your movement in bed (actigraphy). It assumes that if you're not moving, you're asleep.
3.  **Active Sonar (Advanced Apps):** Some apps (like ApneaApp) use the phone's speaker to emit an inaudible, high-frequency sound and use the microphone to listen for the reflections. By analyzing the changes in these reflections, they can detect the tiny movements of your chest rising and falling.

While clever, these methods are for *estimation* of sleep quality, not for creating a precise, timestamped log of every breath.

---

### Best Low-Cost, Open-Source & DIY Solutions

This is the best path for your specific goal, especially for breathing.

#### 1. Breathing: The Arduino Stretch Sensor

Your idea of using just a microphone is unfortunately not reliable for this. The best low-cost, open-source solution is to build a device that directly mimics the medical-grade **RIP belts**.

* **How it works:** You build a simple belt with a **stretch sensor** (often a piece of conductive rubber cord or fabric).
* **The Build:** This sensor is connected to an Arduino. As you inhale, your chest/belly expands, stretching the sensor. This changes its electrical resistance. The Arduino reads this change as a continuous analog value.
* **The Data:** You get a continuous data stream that looks like a wave. The **peaks** of this wave are your maximum inhale, and the **troughs** are your maximum exhale. You can easily write code to find the "start" of the rise (inhale start) and the "start" of the fall (exhale start). This is *exactly* the data you want.

This method is far more reliable than a microphone as it's a direct physical measurement of breathing.

#### 2. Heart Rate: Two Great Options

* **The "Buy" Open-Source Option:** The **Polar H10** chest strap. It's widely recommended in the open-source community because it's ECG-accurate, and you can access the raw data (including beat-to-beat timestamps) via Bluetooth using open-source libraries and SDKs.
* **The "Build" DIY Option:** Use an **Arduino with a pulse sensor**.
    * **PPG Sensor:** A "Pulse Oximeter" sensor (like the **MAX30102**) is a great, cheap module. It uses light (like a smartwatch) to detect blood flow in your finger or earlobe.
    * **ECG Sensor:** A module like the **AD8232** acts as a single-lead ECG. It's more complex (you need to attach electrode pads to your body) but gives you the true electrical-signal "R-peak" of each heartbeat.

---

### Your 24-Hour "Pedometer" Idea

This is absolutely possible and a great concept. Here's how to achieve it based on the solutions above.

* **The Device:** An Arduino (or similar microcontroller) connected to:
    1.  A **DIY stretch-sensor belt** for breathing.
    2.  A **pulse sensor (like MAX30102)** for heart rate.
    3.  A **Micro SD card module** to log the data.
    4.  A **portable battery pack** to power it for 24 hours.

* **The Data Formats:**
    * The most common and simplest format for this is a **CSV (Comma Separated Values)** file, which you can open in any spreadsheet program.
    * **Breathing Data:** You would log the raw, continuous wave:
        `timestamp,breathing_sensor_value`
        (e.g., `1678886400.01,512`, `1678886400.02,514`, ...)
        You would then analyze this file later to extract the inhale/exhale events.
    * **Heartbeat Data:** The "pedometer" data for heart rate is the **Inter-Beat Interval (IBI)**, or the time between each beat. The best way to log this is simply a timestamp for every beat detected:
        `timestamp,event_type`
        (e.g., `1678886400.50,beat_detected`, `1678886401.35,beat_detected`, ...)

* **Getting Your Totals:** Once you have your 24-hour CSV log, you can easily write a simple script (or use a spreadsheet) to:
    1.  Count the total number of "beat_detected" lines to get your **total heartbeats**.
    2.  Analyze the breathing wave to count the number of peaks to get your **total breaths**.

This gives you exactly the "breathing and heartbeat pedometer" you described.

This [DIY Heart Rate and Blood Oxygen Monitor video](https://www.youtube.com/watch?v=xq2DGbxZ9es) shows how to build the heart rate monitoring part of your "pedometer" using an Arduino and a common sensor, which is a great starting point for your project.

Would you like me to find some specific Arduino project guides for the breathing stretch sensor?
http://googleusercontent.com/youtube_content/0