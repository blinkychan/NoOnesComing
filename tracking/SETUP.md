# Download tracking setup (about 10 minutes, one time)

The site lives on GitHub Pages, which can't record anything by itself. This sends each visitor's activity to a Google Sheet you own. No accounts or paid services needed.

## 1. Make the sheet

1. Create a new Google Sheet (any name, e.g. "NOC pitch tracking").
2. **Extensions → Apps Script**.
3. Delete what's in the editor, paste in all of `Code.gs` from this folder, and click Save.
4. In the function dropdown at the top, choose **setup**, then click **Run**.
   Google will ask you to authorize. Choose your account → **Advanced** → **Go to (project name)** → **Allow**. This only grants the script access to this one sheet.
5. Back in the sheet you'll now see two tabs: **Summary** and **Log**.

## 2. Turn it into a web address

1. In the Apps Script editor: **Deploy → New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**. (Anyone means the pitch page can send to it. Nobody can read your sheet through it.)
4. Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
5. Paste it into the browser once. You should see "Logger is running."

## 3. Connect the page

Open `index.html`, find this line near the bottom:

```js
var LOG_URL = "";
```

Paste the URL between the quotes, then upload `index.html` to GitHub again.

## 4. Send each person their own link

The sheet knows who someone is by the link you sent them. Add `?r=` and a name to the end of your site address:

```
https://yourname.github.io/noc-pitch/?r=jane-smith-netflix
https://yourname.github.io/noc-pitch/?r=mike-lee-a24
```

Use letters, numbers and dashes. Anyone who opens the plain link with no `?r=` shows up as "(no name in link)".

Once someone opens their link, that browser remembers the name, so later visits are still credited to them.

## What you'll see

**Summary tab**, one row per person:

| Recipient | First opened | Video | Downloaded script | Times downloaded | Furthest page read | Last activity |
|---|---|---|---|---|---|---|

**Log tab**, every event as it happens:

- Opened page / Came back
- Started video, Turned sound on
- Finished video (how much they actually watched) or Skipped video (where they bailed)
- Opened script
- Downloaded script (which button)
- Read in browser (furthest page reached before they left)
- Replayed video

Each row also has device (e.g. "iPhone · Safari") and a visit ID, so a forwarded link shows up as the same name on a new device with a new visit ID.

## Limits worth knowing

- **It tracks the link, not the person.** If Jane forwards her link, her colleague's activity shows up under Jane's name, though usually on a different device.
- **"Downloaded" means they clicked the button.** The page can't confirm the file finished saving.
- **Direct downloads aren't logged.** On a free GitHub plan the repo is public, so someone who finds `script.pdf` in the repo itself bypasses the page.
- A small share of people with strict privacy blockers may not get logged.
- If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
