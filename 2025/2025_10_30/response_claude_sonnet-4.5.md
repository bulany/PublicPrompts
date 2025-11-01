Converting a scanned PDF score to MusicXML is definitely challenging, especially for a complex SATTBB arrangement. Here are the most reliable workflows:

## Recommended Approaches

### 1. **Audiveris (Best Free Option)**
- Open-source OMR (Optical Music Recognition) software specifically designed for this
- Works well with scanned scores, even those with slight skew
- Outputs directly to MusicXML
- **Process**: Import PDF → Auto-detect staves → Review/correct → Export to MusicXML
- Handles multiple staves well, though you may need to manually define the 6-staff system
- Free and actively maintained

### 2. **PhotoScore Ultimate (Most Accurate Commercial)**
- Part of Avid's Sibelius ecosystem (also standalone)
- Industry standard for professional OMR
- Better at handling imperfect scans than most alternatives
- Direct MusicXML export
- Can handle complex vocal arrangements well
- Around $250, but there's a less capable "Lite" version

### 3. **SmartScore (Professional Alternative)**
- Similar accuracy to PhotoScore
- Good with choral music
- Exports to MusicXML
- Around $400 for the Pro version

### 4. **MuseScore with Audiveris Integration**
- MuseScore (free) can import from Audiveris
- Allows you to refine the score in a full notation editor
- Good workflow: Audiveris → MusicXML → MuseScore for cleanup

## Realistic Workflow Expectations

For a 23-page SATTBB score with imperfect scanning:

1. **Initial OCR**: 30-60 minutes (mostly automated)
2. **Review and correction**: 2-4 hours minimum
   - Pitch errors (especially in inner voices)
   - Rhythm misreads
   - Articulations and dynamics
   - Text/lyrics alignment
   - Slurs and ties

3. **Common issues to watch for**:
   - Piano reduction might confuse the OMR (consider removing those staves first)
   - Lyrics under notes often need significant cleanup
   - Dynamic markings may be missed or misplaced
   - Page boundaries sometimes cause issues

## My Recommendation

Start with **Audiveris** since it's free and quite capable. The workflow would be:

1. Pre-process the PDF if possible (straighten, increase contrast)
2. Import to Audiveris
3. Let it analyze and segment the pages
4. Manually review and correct (this is unavoidable)
5. Export to MusicXML
6. Import into MuseScore or Sibelius for final refinement

If Audiveris struggles too much, then PhotoScore Ultimate would be worth the investment for a 23-page project.

**Reality check**: No OMR software will give you a perfect result from a scanned score. Budget significant time for manual corrections. Some professionals find it faster to just re-enter complex scores by hand in notation software, especially for intricate choral works.

Would you like specific tips on any of these tools, or guidance on pre-processing your PDF for better OCR results?