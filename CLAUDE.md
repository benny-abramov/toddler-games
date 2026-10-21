# Toddler Games

Static site of tap-and-listen games for toddlers. Plain HTML/CSS/JS, no build step, no dependencies.

- Live: https://benny-abramov.github.io/toddler-games/ (GitHub Pages, deploys from `main` root ~1 min after push)
- Repo: https://github.com/benny-abramov/toddler-games (public)

## Requirements

- Must work on PC, Android and iPhone. Keep it touch-first: big tap targets, no hover-only UI, `touch-action: manipulation`.
- Audio must start inside the tap handler (iOS rule). Use **MP3** for sounds (Ogg doesn't play everywhere).
- Speech uses the browser's `speechSynthesis` (English voice picked in `pickVoice()`).

## Structure

- `index.html`: one `<section class="screen">` per screen. Hash routing: `#` = home, `#animals`, `#colors`.
- `app.js`: game data (`ANIMALS`, `COLORS`) plus the shared `makeTile()`. Odd taps call `first()`, even taps call `second()`; tapping a different tile resets the count.
- `style.css`: shared `.tile` / `.tile-grid` styles, plus per-game sections.
- `images/`: Twemoji v15.1.0 SVGs from `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/<codepoint>.svg`.
- `sounds/`: `<animal>.mp3`, short clips (≤5 s) from Wikimedia Commons, trimmed, peak-normalized to -1 dB, mono 96 kbps.
- `CREDITS.md`: attribution for every picture and sound. **Update it whenever you add an asset.**

## Adding a game

1. Add a home card (`<a class="game-card" href="#name">`) and a `<section id="name" class="screen">` with a `.bar` header and a `.tile-grid` container in `index.html`.
2. In `app.js`, call `makeTile()` for each item with `first` and `second` handlers.

## Tooling notes (Windows machine)

- ffmpeg is installed (used to trim and convert sounds). Node is not.
- Local test: `python -m http.server 8765`. For phone-width screenshots, use headless Edge on a page with 390px iframes, because Edge enforces a minimum window width.
- The network to GitHub is sometimes flaky. If `git push` hangs, retry with `git -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=30 push`.
