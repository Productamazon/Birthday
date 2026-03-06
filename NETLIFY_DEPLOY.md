# Free Public Launch (Netlify Drag-and-Drop)

## 1) Create production bundle folder

From project root, keep these in one folder:

- `index.html`
- `styles.css`
- `script.js`
- `assets/`
- `netlify.toml`

## 2) Deploy publicly

1. Open `https://app.netlify.com/drop`.
2. Drag the project folder into the drop zone.
3. Wait for deploy to finish.
4. Netlify gives a public URL like `https://<site-name>.netlify.app`.

## 3) Quick verification on live URL

- HTTPS lock is active.
- Loader is visible for around `3.0s`, then clean reveal.
- Hero CTAs animate on tap and execute actions:
  - `Ignite Sequence` opens panel.
  - `Enter Showreel` scrolls to showreel.
  - `Read Manifesto` scrolls to manifesto.
- Mobile dock buttons work and no dead taps on Redmi-like widths.
- Showreel swipe snap is stable on mobile.
- No missing media in `/assets/*`.

## 4) Optional custom domain

- In Netlify site settings, add custom domain later if needed.
