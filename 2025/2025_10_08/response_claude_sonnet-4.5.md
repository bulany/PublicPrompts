This is a great project! Here's an efficient workflow that minimizes tedium:

## Recommended Approach

**1. Capture Phase (5-10 minutes)**
- Take photos of all 30 pages in one session
- Don't worry about perfect alignment - just keep the notebook flat and well-lit
- Use consistent lighting (avoid shadows)
- Maintain roughly the same distance/angle

**2. Alignment & Processing (the key part)**

Use **Hugin** (open source, available via Homebrew) to auto-align based on your grid points. However, for a smoother command-line workflow, I'd actually recommend:

**ImageMagick + FFmpeg approach:**

```bash
# Install tools
brew install imagemagick ffmpeg

# 1. Batch crop/trim images to roughly the same area
for img in *.jpg; do
  convert "$img" -trim +repage "trimmed_$img"
done

# 2. Auto-align using feature detection (this is the magic part)
# ImageMagick can use SIFT-like features, but for grid-based alignment:
# Use the grid points as registration markers

# 3. Create video from aligned images
ffmpeg -framerate 12 -pattern_type glob -i 'aligned_*.jpg' \
  -vf "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 output.mp4
```

## Even Better: Use `hugin-tools` for alignment

```bash
brew install hugin

# Create control points automatically based on your visible grid points
# Then use hugin's command-line tools to align all images
```

## My Actual Recommendation: **`potrace` + manual alignment helper**

For hand-drawn animation, the most efficient workflow is:

1. **Quick manual alignment**: Since you have visible grid points, write a simple script that shows you each image with an overlay grid, and you just click the 4 corners once per image (takes 2 seconds per image = 1 minute total)

2. **Auto-process the rest**: Apply transformations and generate video

Would you like me to create a Python script (uses open-source tools) that:
- Shows each image one by one
- Lets you click the 4 grid corners
- Auto-aligns all 30 images based on those clicks
- Generates the final video with FFmpeg

This would take you about 2-3 minutes total for marking + processing time. The script would be ~50 lines and handle everything automatically.

Which approach interests you most?