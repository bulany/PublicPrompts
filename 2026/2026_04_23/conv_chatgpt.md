# Prompt 1
Can you give me a bash script that I can somehow add as an alias to my .zshrc on my m1 macbook (8GB 256GB HDD)... actually I want a separate .sh file that has some kind of easy alias in the .zshrc file so I can type something like
```
mp3 mydir
# Converts all the m4a or other audio files to mp3 files of a medium to decent quality using ffmpeg
# have this quality clearly specified and easily changeable as a variable in the .sh file
```
The output mp3s are stored in a directory `mydir_mp3` which is created if it doesn't exist in the parent of `mydir` so after the call, both these dirs will exist at the same level. I guess it would be great if `mydir` could also be just one file like `test.m4a`, in which case just that one file is converted and the output is put in the same directory as `test.mp3`

I then want to have another command setup in a similar fashion that works like this:
```
stt mydir_mp3
# Converts all the mp3 files in the directory (or the individual mp3) to text using the mlx version of the whisper model
```
I have some mlx stuff already installed on my machine (e.g. mlx_lm etc and I think mlx_audio), but I think I need to download and install the whisper model. Can you walk me through this and can you make it so the bash command uses the mlx library in 'offline mode', like it doesn't try and do any downloads first... once this is all set up I want to be able to do these kinds of tasks while flying on a plane etc
If it makes sense then maybe the `stt` output files should be .md format but otherwise just make them text files so `file1.mp3` is converted to `file1.txt` etc
Sometimes the audio files have mixed french and english in the same file... is whisper going to be able to handle that and switch between languages OK, or should I be using a different system / model / workflow?

# Response 1
You’re on exactly the right track—this is a clean workflow to automate. I’ll give you:

1. A reusable `mp3.sh` script
2. A reusable `stt.sh` script (MLX Whisper, fully offline)
3. `.zshrc` aliases
4. One-time setup steps for Whisper (offline-ready)
5. Notes about multilingual audio (French + English)

---

# 1) `mp3.sh` — batch convert to MP3

Create a file somewhere like `~/scripts/mp3.sh`:

```bash
#!/bin/bash

# ===== CONFIG =====
BITRATE="192k"   # <-- change this easily (128k, 192k, 256k, etc)
# ==================

set -e

INPUT="$1"

if [ -z "$INPUT" ]; then
  echo "Usage: mp3 <file-or-directory>"
  exit 1
fi

# Convert single file
convert_file () {
  local infile="$1"
  local outfile="$2"

  echo "Converting: $infile -> $outfile"
  ffmpeg -y -i "$infile" -vn -ab "$BITRATE" "$outfile"
}

if [ -f "$INPUT" ]; then
  # Single file case
  DIR=$(dirname "$INPUT")
  BASE=$(basename "$INPUT")
  NAME="${BASE%.*}"

  OUTPUT="$DIR/$NAME.mp3"
  convert_file "$INPUT" "$OUTPUT"

elif [ -d "$INPUT" ]; then
  # Directory case
  PARENT=$(dirname "$INPUT")
  DIRNAME=$(basename "$INPUT")
  OUTDIR="$PARENT/${DIRNAME}_mp3"

  mkdir -p "$OUTDIR"

  find "$INPUT" -type f \( \
    -iname "*.m4a" -o \
    -iname "*.wav" -o \
    -iname "*.aac" -o \
    -iname "*.flac" -o \
    -iname "*.mp3" \
  \) | while read -r file; do
    BASE=$(basename "$file")
    NAME="${BASE%.*}"
    OUTPUT="$OUTDIR/$NAME.mp3"

    convert_file "$file" "$OUTPUT"
  done

else
  echo "Invalid input: $INPUT"
  exit 1
fi
```

Make it executable:

```bash
chmod +x ~/scripts/mp3.sh
```

---

# 2) `stt.sh` — offline Whisper (MLX)

This assumes you're using the Apple Silicon optimized MLX Whisper.

Create `~/scripts/stt.sh`:

```bash
#!/bin/bash

# ===== CONFIG =====
MODEL_DIR="$HOME/models/whisper-mlx"   # where model lives
OUTPUT_EXT="txt"                       # change to md if you want
# ==================

set -e

INPUT="$1"

if [ -z "$INPUT" ]; then
  echo "Usage: stt <file-or-directory>"
  exit 1
fi

transcribe () {
  local infile="$1"
  local outfile="$2"

  echo "Transcribing: $infile -> $outfile"

  python3 -m mlx_whisper.transcribe \
    --model-path "$MODEL_DIR" \
    --audio "$infile" \
    --output "$outfile" \
    --language auto \
    --task transcribe
}

if [ -f "$INPUT" ]; then
  BASE=$(basename "$INPUT")
  NAME="${BASE%.*}"
  DIR=$(dirname "$INPUT")

  OUTPUT="$DIR/$NAME.$OUTPUT_EXT"
  transcribe "$INPUT" "$OUTPUT"

elif [ -d "$INPUT" ]; then
  find "$INPUT" -type f -iname "*.mp3" | while read -r file; do
    BASE=$(basename "$file")
    NAME="${BASE%.*}"
    DIR=$(dirname "$file")

    OUTPUT="$DIR/$NAME.$OUTPUT_EXT"
    transcribe "$file" "$OUTPUT"
  done

else
  echo "Invalid input: $INPUT"
  exit 1
fi
```

Make executable:

```bash
chmod +x ~/scripts/stt.sh
```

---

# 3) Add aliases to `.zshrc`

Edit your `.zshrc`:

```bash
alias mp3="~/scripts/mp3.sh"
alias stt="~/scripts/stt.sh"
```

Reload:

```bash
source ~/.zshrc
```

Now you can do:

```bash
mp3 mydir
stt mydir_mp3
```

---

# 4) Install + prepare MLX Whisper (OFFLINE READY)

## Step 1 — install MLX + whisper

```bash
pip3 install mlx mlx-whisper
```

---

## Step 2 — download model ONCE (important)

You must do this **before going offline**.

Example (recommended model):

```bash
python3 -m mlx_whisper.download_model medium ~/models/whisper-mlx
```

Other options:

* `base` → fast, less accurate
* `small` → good balance
* `medium` ✅ best sweet spot
* `large` → slow but best

---

## Step 3 — verify offline mode

Turn off WiFi and test:

```bash
stt somefile.mp3
```

If it works → you're fully offline ready ✈️

---

# 5) Notes on quality + speed (M1, 8GB RAM)

* `medium` works well on M1 but may be a bit slow
* `small` might be nicer for batch jobs
* MLX is *much faster* than PyTorch Whisper on Apple Silicon

---

# 6) French + English mixed audio

Short answer: **Whisper handles this surprisingly well.**

### What it does:

* Auto-detects language per segment
* Can switch mid-sentence (often correctly)

### Caveats:

* Sometimes biases toward dominant language
* Punctuation can get weird across languages
* Proper nouns may drift

### Best settings (you already have them):

```bash
--language auto
--task transcribe
```

### If you want better bilingual handling:

* Use `medium` or `large`
* Avoid forcing `--language en` or `fr`

---

# Optional upgrades (worth it)

### 1. Output Markdown with timestamps

Change your script:

```bash
--output-format srt
```

Then convert to `.md` later if needed.

---

### 2. Skip already processed files

Add before transcribing:

```bash
[ -f "$outfile" ] && continue
```

---

### 3. Parallel processing (big speedup)

You can later add `xargs -P` for parallelism—happy to help when you get there.

---

# Final result

You now have:

```bash
mp3 recordings/
# -> recordings_mp3/

stt recordings_mp3/
# -> .txt transcripts beside each file
```

Fully offline. Plane-friendly. Clean.

---

If you want next step upgrades, I can help you:

* add timestamps + speaker detection
* build a single pipeline (`mp3 | stt`)
* integrate with your Obsidian setup (this would actually fit *perfectly* with your workflow)
