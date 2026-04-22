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
Happy to walk you through the whole setup. I'll create two scripts and give you clear install steps. Let me address your mixed-language question upfront too: **Whisper handles mixed French/English well** — it detects the language per ~30-second chunk automatically, and the `large-v3` model is the best available for this. Leave language as auto-detect and it'll switch between the two naturally. It's not perfect mid-sentence code-switching, but for real-world mixed audio it's about as good as it gets locally.

---

Here are the two scripts and the `.zshrc` additions:Here's everything you need. **SETUP.sh** is the full walkthrough — the short version is:

**One-time setup (needs internet):**
```bash
# 1. Place scripts
mkdir -p ~/scripts && cp mp3.sh stt.sh ~/scripts/ && chmod +x ~/scripts/*.sh

# 2. Add to ~/.zshrc
echo 'alias mp3="~/scripts/mp3.sh"' >> ~/.zshrc
echo 'alias stt="~/scripts/stt.sh"' >> ~/.zshrc
source ~/.zshrc

# 3. Dependencies
brew install ffmpeg
pip install mlx-whisper

# 4. Pre-download the model (~3GB, do this before your flight)
python3 -c "from huggingface_hub import snapshot_download; snapshot_download('mlx-community/whisper-large-v3-mlx')"
```

After that, both commands work fully offline — `stt.sh` sets `HF_HUB_OFFLINE=1` automatically so it never tries to phone home.

**A few things worth knowing:**

- **Quality**: The default VBR quality 3 (~175kbps) is great for music. For voice recordings going to Whisper, you could push it to 5 or even 6 and save space — Whisper doesn't benefit from high bitrates on speech.
- **Model choice**: `large-v3` (~3GB) is the default and the best for your mixed-language use case. If it feels slow on 8GB, swap in `whisper-large-v3-turbo` at the top of `stt.sh` — about 40% faster, nearly identical quality.
- **Mixed French/English**: Whisper does this well at the sentence/paragraph level since it detects language independently per ~30-second chunk. Mid-sentence code-switching ("*Je veux le meeting à 3pm*") is the weak spot — it may pick one language and fumble the other. For real-world mixed conversations though, large-v3 with auto-detect is the right tool.
- **Output is `.txt`**: I went with `.txt` since Whisper outputs plain prose with no structure to warrant Markdown. Easy enough to change `OUTPUT_FORMAT="md"` in `stt.sh` if you want `.md` for Obsidian or similar.