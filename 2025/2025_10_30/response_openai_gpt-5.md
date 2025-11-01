That’s a great (and challenging!) project — converting a **scanned choral score PDF** into **MusicXML** is absolutely possible today, but it usually requires a few smart steps and the right combination of tools. Here’s a clear, realistic workflow that people use successfully for this kind of task (Bohemian Rhapsody for SATTBB + piano is a perfect example).

---

## ⚙️ Overall Challenge

Because your PDF is **scanned**, it’s not a digital score (i.e., it doesn’t contain musical objects like notes or rests). It’s a set of images — so the process involves **Optical Music Recognition (OMR)**, similar to OCR for text.

The job can be broken into three major stages:

1. **Preprocessing the PDF (image cleanup and deskewing)**
2. **Optical Music Recognition (turning staff images into notation)**
3. **Verification and correction in a notation editor (MuseScore, Dorico, etc.)**

---

## 🪄 Stage 1: Preprocessing the Scanned PDF

If the staves are slightly tilted or curved (very common in scans), you’ll get *much* better OMR results by cleaning it up first.

### Tools for cleanup

* **Audiveris preprocess** (see below — has built-in deskewing)
* **ScanTailor Advanced** (open source): deskews, crops, and normalizes contrast beautifully.
* **GIMP** or **ImageMagick** (if you’re comfortable with CLI tools):

  ```
  convert page1.pdf -deskew 40% -contrast -sharpen 0x1 cleaned-page1.png
  ```

> Goal: Each page should be a clean, high-contrast image where the staff lines are as horizontal as possible.

---

## 🎼 Stage 2: Optical Music Recognition (OMR)

### 🔸 Option 1: **Audiveris** (Free, Open Source)

**✅ Recommended starting point**

* Website: [https://audiveris.github.io/](https://audiveris.github.io/)
* Input: PDF or image files
* Output: MusicXML, MIDI, or its own `.omr` format

**Workflow:**

1. Convert your PDF to images (if needed):

   ```bash
   pdfimages -png BohemianRhapsody.pdf page
   ```

   (This gives you page-01.png, page-02.png, etc.)
2. Open them in Audiveris (GUI or command line).
3. Let it analyze and recognize the music.
4. Manually correct errors in the visual editor (especially with lyrics, dynamics, and overlapping voices).
5. Export to **MusicXML**.

**Pros:**

* Free and scriptable
* Handles multi-staff vocal scores fairly well
* Exports clean MusicXML for MuseScore or Dorico

**Cons:**

* Can require quite a bit of correction
* Struggles with slanted scans, complex formatting, and lyrics alignment

---

### 🔸 Option 2: **PhotoScore & NotateMe Ultimate** (Commercial, ~$250, often bundled with Sibelius)

* Very mature and accurate OMR engine
* Recognizes printed and *handwritten* music
* Handles complex layouts, lyrics, and dynamics well

**Workflow:**

1. Open the scanned PDF directly in PhotoScore.
2. Correct recognition errors in its editor.
3. Export to **MusicXML** (then open in MuseScore, Sibelius, Dorico, etc.)

**Pros:**

* Highest accuracy for choral + piano scores
* Excellent lyric and multiple-staff recognition
* Easy manual correction

**Cons:**

* Expensive
* Proprietary (no batch automation)

---

### 🔸 Option 3: **SmartScore 64 Pro** (Musitek, ~$399)

* Similar tier to PhotoScore; good at complex scores.
* Often used by professional arrangers.
* Exports clean MusicXML.

---

### 🔸 Option 4: **PlayScore 2 (iOS/Android app)**

* Surprisingly effective if your scan is clean.
* Exports MusicXML or MIDI.
* Great if you just need a playback or starting point.

---

## 🖋️ Stage 3: Verification & Cleanup

Once you have your **MusicXML**:

1. Open it in **MuseScore** (free and excellent for editing MusicXML).
2. Check:

   * Note durations, ties, and slurs
   * Staff assignments (S, A, T, T, B, B, Piano RH/LH)
   * Lyrics alignment
   * Tempo markings, rehearsal marks, dynamics, etc.
3. Re-export as corrected MusicXML or MuseScore file.

---

## 🧭 Recommended Workflow for Your Case

Since you’re starting with a *scanned* SATTBB + piano score:

| Step         | Tool                    | Purpose                                    |
| ------------ | ----------------------- | ------------------------------------------ |
| 1            | `ScanTailor Advanced`   | Deskew and clean all pages                 |
| 2            | `Audiveris`             | Free OMR pass to extract MusicXML          |
| 3            | `MuseScore`             | Review, correct, and export clean MusicXML |
| *(optional)* | `PhotoScore & NotateMe` | Use if Audiveris results are poor          |

If you just want **the best result, fast**, and don’t mind paying → **PhotoScore & NotateMe**.
If you want **a solid free and open-source workflow** → **ScanTailor → Audiveris → MuseScore**.

---

## ⚡ Pro Tip

You can run Audiveris headless in batch mode:

```bash
audiveris -batch -export -output ./musicxml ./cleaned-pages/
```

That way, you can iterate quickly after improving preprocessing or recognition settings.

---

Would you like me to outline a *concrete command-line workflow* using open-source tools (ScanTailor + Audiveris + MuseScore), assuming you’re on macOS? That’s a neat, reproducible pipeline for projects like this.
