This is a fantastic "fork in the road" moment. You have identified two very different paths to the same destination: the **Database approach** (MediaWiki/Wikipedia) and the **Flat File approach** (Obsidian).

Given your "files over apps" philosophy and your desire for a "timeline of your life," **Obsidian is technically and practically superior** for this specific use case.

Here is the technological comparison and a concrete roadmap to building your "Personal Wikipedia."

### 1\. Technological Comparison

You asked how they differ "under the hood." This distinction is critical for your long-term ownership of the data.

| Feature | **MediaWiki (Wikipedia Software)** | **Obsidian (Flat File System)** |
| :--- | :--- | :--- |
| **Data Storage** | **SQL Database.** Your text lives inside a hidden database file (MariaDB/MySQL). You cannot just "open" a page in a text editor; the software *constructs* the page every time you visit it. | **Plain Text Files (.md).** Your text lives in folders on your hard drive. You can open them with Notepad, VS Code, or any future computer 50 years from now. |
| **Images/Media** | **Upload-based.** You must "upload" every image to the Wiki server. It renames and hashes them (e.g., `Image:2014_Feb_Photo.jpg`). Hard to manage 30GB of existing photos. | **Reference-based.** You can keep your 30GB photo folder where it is and just *link* to them. Obsidian reads the file path; it doesn't need to "own" the file. |
| **Timeline** | **Manual.** You have to manually create a page called "September 7, 2011" and manually type links into it. | **Automated.** The "Daily Notes" core plugin automatically generates today's file (e.g., `2025-09-07.md`). Plugins can then *auto-fill* this page with that day's data. |
| **Maintenance** | **High Friction.** You become a SysAdmin. You must maintain a Web Server (Apache), PHP, and a Database. If the database corrupts, you lose everything. | **Zero Friction.** It is just a folder. You can back it up by copying the folder to a USB drive or syncing it with Dropbox/iCloud/Syncthing. |

**The Verdict:**
Running MediaWiki on a Mini PC NAS is feasible, but **it will feel like a job.** You will spend more time maintaining the server than writing your history. Obsidian fits your "20-year text file" habit naturally.

-----

### 2\. Workflow: Building the "Personal Wikipedia" in Obsidian

Here is how you achieve the "Timeline" and "Searchable Life" features you described using Obsidian.

#### The Spine: "Daily Notes"

In Wikipedia, the "Event" is the main unit. In your life, the "Day" is the main unit.

  * **The Setup:** Enable the **Daily Notes** plugin.
  * **The Workflow:** Every day, you click one button, and it opens `YYYY-MM-DD.md`.
  * **The Magic:** You use a plugin called **Dataview** to dynamically generate those "Compilation Pages" you like.

For example, on your "February 20, 2014" page, instead of manually typing what you did, you paste a small code block that says *"Show me every photo I took on this day"*:

```dataview
LIST 
FROM "Photos"
WHERE file.day = date(2014-02-20)
```

*Obsidian instantly searches your vault and lists every photo from that date.*

#### Handling 30GB of Photos (Crucial\!)

**Do not** drag 30GB of photos into your Obsidian "Vault" folder. It will make the software sluggish and syncing difficult.

  * **Ideally:** Keep your photos in a standard folder structure on your hard drive (e.g., `/Photos/2014/02/...`).
  * **The Trick:** Use a community plugin called **"Binary File Manager"** or **"Custom Frames"** to "index" these files without moving them. Or, simply create a "Log" text file for that folder using a script that generates links like `[My Photo](file:///C:/Photos/2014/image01.jpg)`.

#### Importing Your "Digital Exhaust" (Google History & Music)

This is where the "Personal Search Engine" comes alive.

1.  **Google History:** You can export your history via **Google Takeout** (it comes as JSON files). You can use a Python script (I can provide one) to convert "SearchHistory.json" into markdown lists appended to the correct Daily Note date.
      * *Result:* When you open `2015-06-12.md`, you see a section called `## Google Searches` with a list of what you Googled that day.
2.  **Music/Spotify:** If you use Last.fm or Spotify, you can export your history. Tools like "Obsidian Scrobble" or simple CSV-to-Markdown scripts can create a log entry on the specific date you listened to a song.

#### The "Change Log" & History

You mentioned loving the "History" tab on Wikipedia.

  * **The Solution:** Install the **Obsidian Git** plugin.
  * It saves a snapshot of your vault every X minutes.
  * You can view a "History" of any file to see exactly what you changed and when, just like Wikipedia's "View History" tab.

-----

### 3\. Achieving the "Ideal Scenario"

> *"I want to type in '20th Feb 2014' and see what I was doing."*

**The "Almanac" Workflow:**

1.  **Create a Daily Note Template.** When you create a past date (like Feb 20, 2014), Obsidian applies a template.
2.  **The Template** automatically includes "Queries" for your life data:
      * *Query 1:* "Show me any journal entries from this day."
      * *Query 2:* "Show me photos with creation date = 2014-02-20."
      * *Query 3:* "Show me files modified on this day."
3.  **Result:** You don't have to manually "write" the Wikipedia page for that day. Obsidian assembles it for you dynamically based on the files and data you have stored.

### Summary

Stick to the **Files over Apps** philosophy. MediaWiki violates this by trapping your data in a database. Obsidian honors it by treating your 20-year-old text files as first-class citizens.

**Would you like me to write a simple Python script for you that takes a Google Takeout "Search History" JSON file and converts it into daily Markdown files (e.g., `2014-02-20.md`)?** This would be the first step in populating your Personal Wikipedia.