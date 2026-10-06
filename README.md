# No One's Coming! — pitch page

A one-page site: the pitch video plays first (viewers can skip), then the pilot script appears to read and download.

## Files

| File | What it is |
|---|---|
| `index.html` | The page |
| `script.pdf` | The script, shown inline and offered as the download |
| `logo.png` | Title treatment, taken from the script's title page |
| `video.mp4` | **Add this.** Until it's here, visitors go straight to the script |

## Publish on GitHub Pages

1. Create a new repo and upload everything in this folder to the root.
2. Repo **Settings → Pages → Build and deployment**: Source "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
3. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

## Adding the video later

- Name it `video.mp4` and upload it next to `index.html`. Nothing else to change.
- Use H.264 MP4. GitHub blocks files over 100 MB, so export under that (a 2–4 minute pitch at 1080p, ~6–8 Mbps, fits easily).
- To use a different name or a direct MP4 link hosted elsewhere, change `src="video.mp4"` on the `<video>` tag in `index.html`. YouTube/Vimeo page links won't work here; it needs a direct video file URL.

## How it behaves

- First visit: the video autoplays muted with a "Tap for sound" button (browsers don't allow autoplay with sound). Skip is always available. When the video ends or is skipped, the script opens.
- Return visits in the same browser go straight to the script, with a "Video" button to rewatch.
- Swapping the script: replace `script.pdf` with a new file of the same name. Update the draft date and page count in `index.html` if they change.

## Privacy note

The page is marked `noindex` so search engines skip it, but anyone with the link can open it, and on a free GitHub plan the repo itself must be public, so `script.pdf` is visible there too. The video gate shapes the experience; it doesn't lock the script.
