# Prompt 1
So I have important dates that come up in my life that I don't want to forget. Things like birthdays, anniversaries and travel dates etc. A lot of these I want to share with my wife and she probably has dates she wants to share with me. I'm sure we could use google calendar or something similar to help us with this but the main thing I don't like about that is the following: I like the Obsidian "files over apps" philosophy. I'm starting to experiment a bit with Obsidian and I have been fairly successful in keeping some text files with important notes going for over 20 years. I think probably my first experience with this was I had a list of addresses stored on a pocket Symbian device and I was able to export these to a text file. I have kept this "contacts.txt" going ever since. I don't really want to put this on the cloud though... I'm imagining for the dates and calendar project I might be able to have a really convenient notes file in Obsidian where I can with very low friction jot down important dates and then by some magic, certain dates are 'shared' with google calendar so both I and my wife can see them and maybe get reminders. I was also really inspired by the astronomical clock in Olomouc... I would love to have my own "clock view" of my dates data to have my own version of the "saints wheel" so I can see the year at a glance and see the dial turning and see my friends and families birthdays approaching the 'today needle'. 
As soon as I start thinking about such a system I start getting bogged down in details like - should I just have one 'birthdays.txt' file that is read to populate the saints wheel... or should I have an obsidian note for each of my contacts so I can store other information. Or maybe there is a 'dates.md' file or 'travel.md' file... honestly I don't know. Probably for trips its better to have each trip as a seperate file '2026_03_Paris.md', and have these all in a folder and that folder gets scanned.
Inside that paris file it might be fairly free form notes but any dates I want to make appear in a calendar or share, maybe there is some kind of markdown shorthand or way I can get this so my or someone else's calendar plugin can share them.
One cool thing would be in 5 years time if I ever want to see when it was we went to Paris I can just scan through my Notes/Travel/ folder and quickly find that trip and bring up all the details about it.
Can you suggest any workflows or ways to help me?

# Response 1
Your 20-year journey from a Symbian device to a persistent `contacts.txt` is the ultimate proof that the **"files over apps"** philosophy works. Calendar apps and sync services come and go, change their pricing, or shut down, but plain text Markdown files will be readable decades from now. 

Your vision of an Obsidian-based system that feeds a shared Google Calendar—and features an Olomouc-style "Astronomical Clock" visualization—is entirely possible. Here is a recommended workflow to keep your system frictionless, future-proof, and beautiful.

### 1. The Architecture: Entity-per-File
To answer your core question: **Do not use a single `birthdays.md` or `dates.md` file.** Instead, use an "entity-per-file" approach. 

In 5 years, if you want to look back at your Paris trip or check a friend's ring size, you want a dedicated space for that. Create folders like `Contacts/` and `Travel/`. Use YAML "Frontmatter" (metadata at the top of the file) to store the dates seamlessly.

**Example: `Contacts/John Doe.md`**
```yaml
---
type: contact
birthday: 1985-10-14
---
# John Doe
- Partner: Jane
- Gift Ideas: Loves vintage watches, coffee beans.
```

**Example: `Travel/2026_03_Paris.md`**
```yaml
---
type: trip
start_date: 2026-03-10
end_date: 2026-03-15
---
# Paris Anniversary Trip
- Flight details...
- Places we want to eat...
```

### 2. The Bridge to Google Calendar
You want low friction, but you only want *specific* dates synced to the cloud for you and your wife. The best way to do this is by leveraging **Obsidian Tasks** syntax paired with a sync plugin.

Somewhere in your `John Doe.md` or `2026_03_Paris.md` file, you simply drop a checkbox with a calendar emoji and a specific tag (like `#gcal`):

* `- [ ] John's Birthday 🔁 every year on Oct 14 📅 2026-10-14 #gcal`
* `- [ ] ✈️ Paris Trip 🛫 2026-03-10 📅 2026-03-15 #gcal`

To magically push these to Google Calendar, you have two excellent community plugin options:
* **Obsidian Google Calendar Sync**: This is a recently developed plugin that runs a direct, one-way sync from your Obsidian vault to Google Calendar. It looks for your tasks, supports start/end times, and can even map reminders (like an automatic push notification for your wife). 
* **Obsidian-to-iCal**: If you prefer keeping your vault entirely divorced from Google's APIs, this plugin searches your vault for dates and generates a local, standard `.ics` calendar file. You can put this single `.ics` file in a cloud folder (like Google Drive) and have Google Calendar "subscribe" to it.

### 3. The "Astronomical Clock" (Saints Wheel)
This is where Obsidian truly outshines standard apps. You were inspired by the *Orloj* in Olomouc, where a dial turns through the year, pointing to the current day and upcoming saints/holidays.

You can build this dynamically in Obsidian using the **Dataview** plugin. Dataview has a feature called `DataviewJS` that lets you run JavaScript to visualize your vault data. 

Create a note called `My Clock.md`. Make sure you have the Dataview plugin installed and "Enable JavaScript Queries" turned on in its settings. Then, paste this exact code block into your note:

````javascript
```dataviewjs
// 1. SETUP THE CLOCK CANVAS
const size = 500;
const cx = size / 2;
const cy = size / 2;
const r = 180;
let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;

// Draw the main clock dial
svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--text-muted)" stroke-width="2"/>`;

// 2. CALCULATE THE "TODAY" NEEDLE
const today = moment();
const daysInYear = today.isLeapYear() ? 366 : 365;
// Map the current day of the year to a 360-degree circle (starting at the top)
const todayAngle = (today.dayOfYear() / daysInYear) * (Math.PI * 2) - (Math.PI / 2);

// Draw the Today needle
const nx = cx + (r - 10) * Math.cos(todayAngle);
const ny = cy + (r - 10) * Math.sin(todayAngle);
svg += `<line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="var(--color-red)" stroke-width="4" stroke-linecap="round"/>`;
svg += `<circle cx="${cx}" cy="${cy}" r="6" fill="var(--color-red)"/>`;

// 3. FETCH DATES & PLOT THEM ON THE WHEEL
// This looks in your Contacts and Travel folders for frontmatter dates
const pages = dv.pages('"Contacts" or "Travel"').where(p => p.birthday || p.start_date);

for (let page of pages) {
    let dateStr = page.birthday ? page.birthday : page.start_date;
    let eventDate = moment(dateStr.toString());
    if (!eventDate.isValid()) continue;
    
    // Map the event date to the dial
    let dayOfYear = eventDate.dayOfYear();
    let angle = (dayOfYear / daysInYear) * (Math.PI * 2) - (Math.PI / 2);
    
    // Plot the dot
    let px = cx + r * Math.cos(angle);
    let py = cy + r * Math.sin(angle);
    
    // Position the text slightly outside the dial
    let tx = cx + (r + 15) * Math.cos(angle);
    let ty = cy + (r + 15) * Math.sin(angle);
    
    // Flip text alignment based on which side of the clock it lands on
    let anchor = (Math.cos(angle) > 0) ? "start" : "end";
    
    // Make Birthdays blue, Trips green
    let color = page.birthday ? "var(--color-blue)" : "var(--color-green)"; 
    
    svg += `<circle cx="${px}" cy="${py}" r="5" fill="${color}"/>`;
    svg += `<text x="${tx}" y="${ty}" fill="var(--text-normal)" font-size="12" text-anchor="${anchor}" alignment-baseline="middle">${page.file.name}</text>`;
}

svg += `</svg>`;
dv.container.innerHTML = svg;
```
````

**What this script does:**
1. It automatically scans your `Contacts` folder for anyone with a `birthday` in their YAML metadata, and your `Travel` folder for `start_date`.
2. It draws a circular year dial.
3. It draws a bold red needle representing "Today" that ticks around the circle throughout the year.
4. It plots Birthdays (in blue) and Trips (in green) chronologically around the edge of the circle.

Because it reads your notes automatically, it requires **zero maintenance**. Whenever you create a new contact or trip and add a date to the top of the file, it will instantly appear on your clock. 

With this system, your data remains safely in text files on your local hard drive, your wife gets the notifications she needs on Google Calendar, and you get a beautiful, personalized interface to view the approaching milestones in your life.