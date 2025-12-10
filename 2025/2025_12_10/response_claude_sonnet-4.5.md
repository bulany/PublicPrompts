This is a fascinating exploration of personal knowledge management! You're essentially asking about the difference between a **file-based system** (Obsidian) and a **database-driven wiki system** (MediaWiki), and which better serves your vision of a comprehensive personal timeline/archive.

## How They Work Differently

**Obsidian** stores everything as individual `.md` files in folders on your filesystem. When you link `[[Another Note]]`, Obsidian reads all files to build the connection graph. It's essentially a sophisticated text editor with relationship visualization - the "database" is emergent from the files themselves.

**MediaWiki** (Wikipedia's software) uses a proper database (MySQL/MariaDB) to store page content, revision history, user data, and metadata. Pages aren't files - they're database records. The filesystem mainly stores uploaded images and configuration. Every edit creates a new database entry preserving the full revision history.

## Comparing Approaches for Your Use Case

**For your timeline/archive vision, I see significant tradeoffs:**

### MediaWiki Strengths
- **Built-in revision history**: Every change is automatically tracked with timestamps and diffs - exactly what you want for seeing how a poem evolved
- **Date-based organization**: The "On this day" pages you mentioned are actually a feature (Wikipedia calls them "day pages")
- **Powerful search**: Database-backed full-text search across everything
- **Structured metadata**: Templates and categories work well for systematically tagging photos, songs played, etc.
- **Single unified interface**: Everything lives in one system with consistent navigation

### MediaWiki Weaknesses
- **Complexity**: Setting up MediaWiki is non-trivial - you need PHP, a database server, web server configuration
- **Lock-in risk**: Despite your concerns about proprietary formats, MediaWiki stores everything in a database. While you can export to XML, you've basically traded the "files over apps" philosophy for database lock-in
- **Overkill for text editing**: The wiki syntax editing experience is clunkier than a good markdown editor
- **Media handling**: While it can handle images, integrating 30GB of photos with automatic date-based linking would require significant customization

### Obsidian Strengths
- **Files over apps philosophy**: You keep this value you've held for 20 years
- **Pleasant editing**: Much nicer for writing than wiki text boxes
- **Flexible plugins**: Community plugins for calendars, timelines, image galleries, dataview queries
- **Portable**: Works on desktop and mobile, syncs via any file sync service
- **Lightweight**: No server setup required

### Obsidian Weaknesses
- **Limited revision history**: Basic file versioning, not comparable to MediaWiki's detailed diffs
- **Manual structure**: You'd need to create your own daily note system and linking conventions
- **Search limitations**: File-based search is good but not database-level sophisticated

## My Recommendation: A Hybrid Approach

I think trying to shoehorn everything into MediaWiki would be fighting against your instincts. Instead, consider **Obsidian as the core with strategic integrations**:

### The Architecture
1. **Obsidian vault** as your primary interface with daily notes (there are plugins for this - "Daily Notes" or "Periodic Notes")
2. **Git repository** wrapping your vault for full revision history with timestamps and diffs - this gives you MediaWiki-level change tracking while keeping files as files
3. **Photo library** stays as files in dated folders, referenced/embedded in daily notes
4. **Separate databases** for activity logs (music plays, browser history, LLM conversations) that you query and summarize into your daily notes

### Practical Implementation

**Daily Note Template** (automated):
```markdown
# 2014-02-20

## Events
- 

## Photos
![[2014/02/20/morning-coffee.jpg]]
![[2014/02/20/sunset.jpg]]

## Music Listened
- [Generated from last.fm or local scrobbler]

## Web Activity
- [Top searches/sites from history export]

## Conversations
- [[LLM Chat - Writing Advice]]

## Learning
- 

---
Tags: #daily-note #2014 #february
```

**For the data integration**, you'd write simple scripts that:
- Parse your Google Takeout data (search history, YouTube)
- Read photo EXIF dates and create markdown links
- Export music listening data from whatever you use (Spotify, local player logs)
- Save LLM conversations as individual markdown files with metadata

**For revision tracking**, initialize Git in your vault:
```
git commit -am "Daily update"
```

Every commit becomes a timestamped snapshot. Tools like `git log` or GitKraken give you visual history exploration.

### Why This Works Better

1. **Maintains files-over-apps**: Everything is readable `.md` and images
2. **Genuine revision history**: Git is actually better than MediaWiki for this - you get industry-standard version control
3. **Pleasant editing**: You keep Obsidian's excellent writing experience
4. **Flexible integration**: Scripts can pull data from anywhere into your notes
5. **Future-proof**: If Obsidian disappears, you have markdown files in Git - readable by anything forever
6. **Searchable**: Obsidian's search plus potential Dataview queries give you powerful exploration

### The Timeline View

Obsidian plugins like "Timelines" or "Dataview" can create Wikipedia-style "on this day" views by querying your daily notes. You could have a note called "February 20th" that automatically shows all Feb 20th entries across years.

## If You Still Want MediaWiki

If you're committed to trying MediaWiki, yes, it's feasible to run it on a local NAS/mini PC. You'd install:
- Linux (Ubuntu Server is fine)
- Apache/Nginx
- PHP
- MySQL/MariaDB  
- MediaWiki software

But honestly, integrating 30GB of photos, browser history, music logs, and LLM chats into MediaWiki would require extensive custom development (writing MediaWiki extensions), and you'd lose the "files over apps" benefit you value.

**The real question**: Is MediaWiki's wiki-style interface worth abandoning plain text files? For your use case, I don't think so. The hybrid Obsidian+Git approach gives you the best of both worlds - the pleasant editing and file portability you want, with the revision tracking and timeline features you admire in Wikipedia.

What aspects of this resonate with you? Are there specific features of the MediaWiki approach that you feel the hybrid system wouldn't capture?