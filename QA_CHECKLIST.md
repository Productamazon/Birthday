# Chrome QA Checklist (Desktop + Mobile)

## Baseline
- Browser: Chrome (latest stable).
- Viewports: `360x800`, `390x844`, `768x1024`, `1024x768`, `1366x768`, `1920x1080`.
- Redmi profile set: `393x873`, `393x851`, `360x800`.
- Mode: normal motion and `prefers-reduced-motion`.

## Loader / Launch
- Loader appears immediately on first load and remains visible for ~`3.0s`.
- Three phases progress in order: `BATCAVE BOOT`, `SIGNAL SYNC`, `CITY LAUNCH`.
- Launch reveal removes overlay cleanly with no stuck state.

## Countdown Logic
- Before birthday: countdown decrements every second and target date is correct.
- On birthday (`March 07` local timezone): all units stay `00` and zero cinematic opens once.
- Post-zero lock: closing zero cinematic does not repeatedly retrigger it in a loop.

## Navigation / Interaction
- Showreel `Grid/List` toggle updates layout and active state buttons.
- Mobile swipe snaps cleanly card-to-card and active card highlight stays synced.
- `Trigger Pulse`, `Ignite Sequence`, and mobile dock actions work without layout jumps.

## Visual Integrity
- No color bleed/leaks between sections while scrolling and resizing.
- No clipping artifacts, text jitter, or accidental flicker in transitions.
- Typography hierarchy remains consistent across all breakpoints.
- Custom scrollbar remains styled and readable.

## Reduced Motion
- Core content is fully readable and usable when reduced motion is enabled.
- Hero loop does not force autoplay in reduced-motion mode.

## Regression Checks
- Run `node --check script.js`.
- Confirm no runtime audio controls/behavior are present.
- Confirm no direct copyrighted movie assets/logos are present.
- Run automation: `cmd /c npm run test:e2e`.

## Public URL Checks
- Deploy with Netlify drag-drop and verify the generated `*.netlify.app` URL resolves.
- Confirm HTTPS is active and assets load with no 404 errors.
- Re-check loader + CTA + swipe behavior on live URL (not just localhost).
