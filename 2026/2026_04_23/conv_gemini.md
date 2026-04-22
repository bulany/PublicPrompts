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




Here is a complete guide and the scripts you need to set up this exact workflow. 

### 1. The Directory Setup & `.zshrc` Aliases

First, let's create a dedicated folder to store your scripts so everything stays organized:
```bash
mkdir -p ~/scripts
```

Next, open your `~/.zshrc` file in your favorite text editor (e.g., `nano ~/.zshrc`) and add these two aliases at the bottom:
```bash
# Custom Audio Conversion & MLX Whisper Aliases
alias mp3="bash ~/scripts/mp3_converter.sh"
alias stt="bash ~/scripts/stt_converter.sh"
```
Save the file and run `source ~/.zshrc` to activate the aliases.

---

### 2. The `mp3` Script
Create the file `~/scripts/mp3_converter.sh` and paste in the following code:

```bash
#!/bin/bash

# ==============================================================================
# CONFIGURATION
# ==============================================================================
# Easily change the MP3 quality here:
# -q:a 2  -> VBR ~170-210 kbps (High Quality / Recommended)
# -q:a 4  -> VBR ~165 kbps (Medium Quality)
# -b:a 192k -> CBR 192 kbps (Constant Bitrate)
MP3_QUALITY="-q:a 2"

# Supported audio extensions to look for
EXTENSIONS=("m4a" "wav" "flac" "ogg" "aac" "wma")
# ==============================================================================

if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed. Run: brew install ffmpeg"
    exit 1
fi

if [ -z "$1" ]; then
    echo "Usage: mp3 <file-or-directory>"
    exit 1
fi

TARGET="$1"

convert_file() {
    local input_file="$1"
    local output_dir="$2"
    local base_name=$(basename "${input_file%.*}")
    local output_file="${output_dir}/${base_name}.mp3"
    
    echo "Converting: $input_file -> $output_file"
    # -y overwrites existing files, -v error hides spammy output logs
    ffmpeg -y -v error -i "$input_file" -codec:a libmp3lame $MP3_QUALITY "$output_file"
}

if [ -f "$TARGET" ]; then
    # Single file mode (outputs to same directory)
    out_dir=$(dirname "$TARGET")
    convert_file "$TARGET" "$out_dir"
    echo "Done!"
elif [ -d "$TARGET" ]; then
    # Directory mode (creates sibling _mp3 directory)
    TARGET_DIR="${TARGET%/}" # Strip trailing slash if present
    OUT_DIR="${TARGET_DIR}_mp3"
    
    mkdir -p "$OUT_DIR"
    echo "Created directory: $OUT_DIR"
    
    shopt -s nocaseglob nullglob
    found_files=0
    for ext in "${EXTENSIONS[@]}"; do
        for file in "$TARGET_DIR"/*."$ext"; do
            convert_file "$file" "$OUT_DIR"
            found_files=$((found_files + 1))
        done
    done
    
    if [ $found_files -eq 0 ]; then
        echo "No supported audio files found in $TARGET_DIR."
    else
        echo "Successfully converted $found_files files!"
    fi
else
    echo "Error: '$TARGET' is not a valid file or directory."
    exit 1
fi
```

---

### 3. The `stt` Script
Create the file `~/scripts/stt_converter.sh` and paste in the following code. 

*Note: We wrap a tiny Python script inside the bash script to ensure we can strictly output formatted `.md` files without any extra CLI bloat.*

```bash
#!/bin/bash

# ==============================================================================
# CONFIGURATION
# ==============================================================================
# The large-v3-turbo model takes ~3GB RAM (perfect for 8GB Mac)
# It is by far the best model for code-switching (mixed French/English)
MODEL="mlx-community/whisper-large-v3-turbo"

# This forces huggingface to ONLY look at your local disk (Offline Mode)
# It stops the command from hanging while looking for Wi-Fi on a plane.
export HF_HUB_OFFLINE=1
# ==============================================================================

if ! python3 -c "import mlx_whisper" &> /dev/null; then
    echo "Error: mlx-whisper is not installed. Run: pip install mlx-whisper"
    exit 1
fi

if [ -z "$1" ]; then
    echo "Usage: stt <file-or-directory>"
    exit 1
fi

TARGET="$1"

# Embedded Python script for clean markdown outputs
export PYTHON_STT_SCRIPT=$(cat << 'EOF'
import sys
import os
import mlx_whisper

model_repo = sys.argv[1]
input_path = sys.argv[2]
output_path = sys.argv[3]

print(f"Transcribing {os.path.basename(input_path)}...")
try:
    result = mlx_whisper.transcribe(input_path, path_or_hf_repo=model_repo)
    text = result["text"].strip()
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text + "\n")
    print(f"Saved: {output_path}")
except Exception as e:
    print(f"Error processing {input_path}: {e}")
EOF
)

process_file() {
    local input_file="$1"
    local output_dir="$2"
    local base_name=$(basename "${input_file%.*}")
    local output_file="${output_dir}/${base_name}.md"
    
    python3 -c "$PYTHON_STT_SCRIPT" "$MODEL" "$input_file" "$output_file"
}

if [ -f "$TARGET" ]; then
    # Single file mode (outputs to same directory)
    out_dir=$(dirname "$TARGET")
    process_file "$TARGET" "$out_dir"
    echo "Done!"
elif [ -d "$TARGET" ]; then
    # Directory mode (outputs md files alongside the mp3s)
    TARGET_DIR="${TARGET%/}"
    
    shopt -s nocaseglob nullglob
    found_files=0
    for file in "$TARGET_DIR"/*.mp3; do
        process_file "$file" "$TARGET_DIR"
        found_files=$((found_files + 1))
    done
    
    if [ $found_files -eq 0 ]; then
        echo "No mp3 files found in $TARGET_DIR."
    else
        echo "Successfully transcribed $found_files files!"
    fi
else
    echo "Error: '$TARGET' is not a valid file or directory."
    exit 1
fi
```
Don't forget to make both scripts executable!
```bash
chmod +x ~/scripts/mp3_converter.sh
chmod +x ~/scripts/stt_converter.sh
```

---

### 4. Walkthrough: Setup, Installation, and Prepping for the Plane

Because you have an M1 Mac with 8GB RAM, memory management is key. Older "large" whisper models would crash your laptop because they take up to 10GB of RAM. However, **`mlx-community/whisper-large-v3-turbo`** is a newly optimized model that has the intelligence of the large models but **only uses ~3GB of memory**. It will leave plenty of room for macOS to breathe.

**1. Install Prerequisites:**
```bash
# Install ffmpeg if you don't have it yet
brew install ffmpeg

# Install MLX Whisper
pip install mlx-whisper
```

**2. Downloading the Model (Internet connection required just once):**
Because we explicitly configured the bash script to use `export HF_HUB_OFFLINE=1`, it refuses to check the internet. To ensure the model is on your computer *before* you board your flight, you need to trigger a one-time download. 

You can force a download right now by running this command in your terminal:
```bash
python3 -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='mlx-community/whisper-large-v3-turbo')"
```
This will download the ~1.6 GB model into your hidden cache folder (`~/.cache/huggingface/hub`). Once the progress bar hits 100%, you are fully ready to fly. You can safely turn off your Wi-Fi entirely and try the `stt` command to test it!

---

### 5. Will Whisper handle mixed French and English?
Yes, but the specific model you choose dictates *how well* it handles it.
*   **Small/Base Models:** They often get confused by language-switching (called "code-switching"). They might attempt to translate the French parts into English on the fly, or just output phonetic gibberish.
*   **The Turbo Model (used in this script):** OpenAI specifically trained the `large-v3` architecture with massively improved multi-lingual logic. It natively recognizes mid-sentence language switches and will correctly write out the English words in English, and the French words in French. 

This is exactly why relying on the newly-released `whisper-large-v3-turbo` combined with Apple's optimized MLX engine is the absolute best offline workflow you can have right now on an 8GB machine.