That's a frustrating situation! Dropping electronics on a hard floor is a very common way to break them. The "45W GaN" label on your power supply is key to understanding what it is and, unfortunately, why it might be difficult to fix.

Here’s a breakdown of what you've got, how it works, and what your options are.

### ⚡ What a "GaN" Power Supply Is

The "GaN" stands for **Gallium Nitride**. This is the name of a semiconductor material that's a modern alternative to traditional silicon.

In short, GaN transistors can:
* Switch on and off much faster (at higher frequencies) than silicon.
* Run more efficiently, wasting less energy as heat.
* Handle higher voltages and temperatures.

Because they can switch so fast, manufacturers can use much smaller transformers, capacitors, and inductors. This is why your 45W laptop charger is likely very small and compact compared to older, bulkier "bricks."

### ⚙️ How It Works (Simplified)

Your charger is a **Switch-Mode Power Supply (SMPS)**. It takes the high-voltage AC power from your wall and "chops it up" at a very high frequency (using its GaN transistor) before sending it through a tiny transformer. This is then rectified and filtered back into the stable, low-voltage DC your laptop needs.

A dedicated "protocol chip" inside also communicates with your laptop over the USB-C cable to negotiate the correct voltage and current (this is part of the Power Delivery, or "PD," standard).

---

### 💔 Repair vs. Salvage: The Hard Truth

Dropping it on a concrete floor almost certainly caused a **physical, mechanical failure**, not an electrical one.

#### 1. Can It Be Repaired?

**Maybe, but it's difficult.** Because GaN chargers are designed to be as small as possible, their internal components are incredibly compact and densely packed.

* **Most Likely Problem:** The drop probably **cracked the printed circuit board (PCB)** or, more likely, **broke a solder joint** connecting a heavy component. The most common culprits to break loose are the transformer or the larger capacitors.
* **The Challenge:** Opening the case is the first hurdle. They are almost always sealed shut (often with glue) and are not designed to be opened. If you manage to get it open without destroying the plastic, you would need to be very good at electronics diagnostics and soldering to find and fix the broken connection on a crowded, multi-layered board.

> **⚠️ Warning:** Do not attempt to open or repair the power supply unless you are an expert. It contains capacitors that can **store a dangerous, high-voltage charge** even long after it's been unplugged.

#### 2. Are There Valuable Components Inside?

**Yes, but they are very hard to reuse.**

This is the real shame of it. Your little brick is full of advanced technology, but it's not like an old-fashioned radio with big, easy-to-salvage parts.

* **The "Interesting" Parts (Hard to Salvage):**
    * **GaN FETs (Transistors):** These are the "magic" components. However, they are tiny, surface-mount (SMD) parts that are very difficult to remove without specialized hot-air soldering equipment. Even if you got one off, integrating it into a hobby project is extremely complex.
    * **Control & PD Chips:** The "brains" of the charger are highly specialized integrated circuits (ICs) that are also tiny, surface-mount, and difficult to repurpose.

* **The "Maybe Useful" Parts (Easier to Salvage):**
    * **USB-C Port:** If the port itself isn't damaged, it could be desoldered and used for a different project.
    * **Capacitors:** There will be several high-quality (and possibly solid-state) capacitors.
    * **Inductors/Transformer:** The small transformer is custom-wound for this specific design and is unlikely to be useful elsewhere.

### 🗑️ So, Should You Throw It in the Bin?

**Please don't!** It should not go into a regular bin.

Your charger is **e-waste (electronic waste)**. It contains materials that shouldn't end up in a landfill. The best course of action is to take it to a local electronics recycling center or a shop that collects e-waste.

It's a shame to lose such a high-tech piece of equipment to a simple drop, but the reality is that these compact devices are optimized for size, not for repairability.

***

This video shows a teardown of a 180W GaN charger that failed. It will give you a very good idea of just how complex and densely packed these chargers are inside, which helps explain why repair is so difficult.