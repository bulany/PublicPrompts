Below is a clear, practical comparison between **Obsidian-style “files over apps” knowledge bases** and **MediaWiki (the actual software behind Wikipedia)**—then a set of **recommended architectures** for building your “personal Wikipedia with timeline + photos + web history + everything in one searchable place.”

---

# 🧠 Part 1 — How Obsidian’s Model Works (Files & Plugins)

### **Architecture**

* Stores everything as **Markdown files** in a folder.
* No server, no database, no PHP. Just text files and optional frontmatter.
* Plugins can add functionality, but the underlying data remains **flat files**.
* Linking uses `[[WikiLinks]]` or standard Markdown links.
* Version history is either **Git**, **Obsidian Sync**, or something like **Syncthing**.

### **Strengths**

* **Ultra portable**: just copy the folder.
* **Zero lock-in**: readable forever.
* Easy integration with:

  * Photos placed in `/attachments`
  * JSON/YAML metadata
  * Datalog-style queries with Dataview
  * Your own scripts (Node.js, Python, etc.)

### **Weaknesses**

* **Not built for structured relations** (people, events, songs, photos all tied together).
* **Not built for giant timeline queries** (e.g., “Show everything about Feb 20, 2014” with photos + browsing history + songs played).
* Media embedding works, but **no automatic ingestion**.
* File history is external (Git) and less elegant than Wikipedia’s diff and history UI.

---

# 🧠 Part 2 — How MediaWiki Works (Wikipedia-style)

### **Architecture**

* Runs on a **server** with:

  * Apache or Nginx
  * PHP
  * MySQL/MariaDB database
* Pages are stored in the database, revisions too.

### **Strengths**

* **Beautiful built-in revision history** (way better than Git for wiki-type diffs).
* Discussion pages.
* Categories, templates, infoboxes, portals.
* Plugins (extensions) for:

  * UploadWizard
  * Semantic MediaWiki (structured data)
  * Timeline visualizers
* Very long-lived: you can run it locally forever.

### **Weaknesses**

* **Heavy**: Requires Linux server environment.
* Not file-based → if the DB corrupts or the machine dies, restoration is more complex.
* Editing on phones is not as smooth as Obsidian.
* MediaWiki’s editor is fine, but not “fun” like Obsidian’s Markdown live preview.

---

# 🤝 How They Differ Philosophically

| Feature                   | Obsidian (Flat Files)     | MediaWiki (Database)                       |
| ------------------------- | ------------------------- | ------------------------------------------ |
| **Data format**           | Markdown files            | SQL database storing wikitext              |
| **Revision history**      | Git or snapshots          | Built-in versioning +                      |
| diffs                     |                           |                                            |
| **Portability**           | Extremely portable        | Portable but requires backup of DB + media |
| **Media handling**        | Mixed folder with images  | Built-in file upload, with metadata        |
| **Structure**             | Tags, links, Dataview     | Categories, templates, semantic properties |
| **Search**                | Local full-text + plugins | SQL + extensions, very strong              |
| **Ease of customization** | JavaScript plugins        | PHP extensions                             |
| **Ideal use**             | Personal notes            | Knowledge bases / encyclopedias            |

---

# 🧩 Part 3 — Your Dream Features Mapped to Technologies

You want your system to automatically or semi-automatically track:

* Photos by date
* Writing
* Music listened to
* Web browsing history
* Google searches
* YouTube history
* AI conversations
* Events
* A “What was I doing with my life on X day?” timeline
* A cross-searchable personal encyclopedia of everything

This is **incredibly achievable**, but not with only Obsidian *or* only MediaWiki.

### **The best version of your vision is a hybrid system**:

---

# ⭐ Recommended Approach:

# **Use MediaWiki as the “Front End Timeline Knowledge Base”**

# **Use Obsidian as your personal creative / editing environment**

And connect them with scripts.

Here's why:

---

# 🏛️ MediaWiki as Your "Personal Wikipedia"

### Pros for your vision:

* It *already* has daily pages, e.g. **"20 February 2014"** structure.
* You get:

  * automatic history logs
  * diff views
  * category systems
  * templates for structured data
  * images displayed beautifully
* You can run it on a **mini PC / NAS** with Docker easily.

### Extension: **Semantic MediaWiki**

This allows you to tag pages with metadata such as:

```
{{#set: took_photo=File:IMG_20140220_1234.jpg }}
{{#set: listened_to_song="Beatles - Yesterday" }}
{{#set: searched_for="guitar chords" }}
```

Then you can query:

```
{{#ask:
  [[Date::2014-02-20]]
  | ?took_photo
  | ?searched_for
  | ?listened_to_song
}}
```

Which produces an automatic table of all related activities.

---

# ✍️ Obsidian as Your “Creative Notebook”

You keep:

* personal thoughts
* longform writing
* poems
* rough notes
* markdown files
* LLM conversations

Obsidian is too good at writing to give up.

But everything important can be **synced into your local wiki** via:

* a small Python script
* your own Obsidian plugin
* the MediaWiki API

For example, your script could scan:

```
/journal/2025/2025-02-20.md
```

and automatically push content into:

```
https://yourwiki.local/wiki/20_February_2025
```

including photos or metadata.

---

# 📸 What About Photos?

The easiest approach is:

1. Mirror your phone photos → NAS (Syncthing or PhotoPrism).
2. Have PhotoPrism or Immich build a **database of photos + dates**.
3. A script automatically:

   * creates a wiki page per day (if missing)
   * inserts galleries of all photos taken on that day

MediaWiki even supports **automatic galleries**:

```
<gallery>
File:IMG_001.jpg
File:IMG_002.jpg
</gallery>
```

---

# 🌐 What About Web Browsing History?

Browser history can be exported to JSON.
You can write an automated script that:

1. Reads Chrome/Firefox history daily.
2. Appends entries to wiki pages using the MediaWiki API.

---

# 🎶 Music History

If you store music locally:

* A script can read **play history** from your player (e.g., mpv, VLC, iTunes XML).
* Or you can pipe listen events to the wiki using shell hooks.

---

# 🔍 Google Searches & YouTube History

Google Takeout → JSON.
You can process this regularly and push updates into the wiki.

---

# 💬 LLM Conversations

You can:

* Save conversations from ChatGPT or other LLMs into Markdown.
* Then upload them to your wiki as transcripts.

---

# 🧱 Architecture Summary: The “Personal Wikipedia System”

```
                       +---------------------------+
Photos --> Immich ---> |                           |
                       |   MediaWiki (Local NAS)   |
Browser History ------>|  "Personal Wikipedia"     |
Search History ------->|      (database)           |
Music History -------->|                           |
LLM transcripts -----> |                           |
                       +------------^--------------+
                                    |
                                    | API
                                    |
                         +----------+-------------+
                         |                        |
                         |    Obsidian Vault      |
                         | (Local file-based KB)  |
                         +------------------------+
```

* **Obsidian** = Writing, note-taking, creative work.
* **Wiki** = Timeline, history, structured catalog of your life.

Scripts glue them together.

---

# 🧭 Practical Setup Path (Step-by-step)

### **Step 1: Get MediaWiki running locally**

I recommend Docker:

```
docker run -d -p 8080:80 --name mywiki mediawiki
```

Or use a pre-built stack like:

* **WikiSuite**
* **Bitnami MediaWiki**

### **Step 2: Add extensions**

* UploadWizard (for images)
* Semantic MediaWiki (for metadata)
* VisualEditor (for nicer writing)
* Lingo (glossaries)

### **Step 3: Organize pages by date**

Just like Wikipedia:

```
2025-02-20
2025-02-19
2025-02-18
...
```

### **Step 4: Set up your photo ingestion**

Use PhotoPrism or Immich → export metadata → script to:

* Upload images to MediaWiki
* Embed them in the corresponding date page

### **Step 5: Build simple import scripts**

Python or Node.js:

* Import Google searches
* Import browsing history
* Import saved notes
* Import LLM chats
* Import playlists

### **Step 6: Optional — Use Obsidian as a source**

A script can look at `YYYY-MM-DD.md` in your Obsidian journal and append that text to the wiki’s daily page.

---

# ⚡ Final Thoughts: Is this “Feasible”?

**Absolutely yes.**
Many people run personal MediaWikis at home.
The biggest challenge is **automation glue**, but that is totally solvable.

You end up with:

* **A permanent, structured, searchable, timeline-based view of your life.**
* **A personal archive better than Google History or iPhone Photos.**
* **A system that will last 20+ years** because it’s built from open standards and local files.
* **A Wiki and a file-based Markdown system working together** rather than competing.

---

If you'd like, I can also design:

* A detailed architecture diagram
* A file/folder layout for the wiki + Obsidian
* A Python script template for automatic daily imports
* A recommended mini-PC / NAS hardware setup
* Example wiki templates for daily pages (with photo galleries + events)

Would you like that?
