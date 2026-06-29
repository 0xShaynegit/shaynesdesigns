# Shayne's Designs — Project Rules

**READ THIS BEFORE TOUCHING ANYTHING. NO EXCEPTIONS.**

---

## Session Start Protocol

1. Read this file (`rules.md`) completely
2. Read `handover.md` for current position
3. Do not touch any file until both are read

---

## Project Overview

- **Site**: shaynesdesigns.com — Shayne's personal web design agency portfolio
- **Stack**: Pure static HTML/CSS/JS. No frameworks. No build tools.
- **Deployment**: Cloudflare Pages. Never suggest Vercel.
- **Location**: `C:\ZZZWebsites\shaynesdesigns\`
- **Repo**: GitHub via `git push`

---

## File Structure

```
portfolio-v2.html     — new showcase portfolio page (IN PROGRESS)
portfolio.html        — original portfolio — NEVER TOUCH THIS FILE
index.html            — homepage
blog/                 — blog posts
images/               — all images (WebP + JPG)
fonts/                — self-hosted WOFF2 fonts
_archive/             — archived files (never delete, always archive)
```

---

## Fonts

- Syne (display/headings) — self-hosted WOFF2
- Cormorant Garamond 300 italic (editorial accent) — self-hosted WOFF2
- Nunito Sans variable (body) — self-hosted WOFF2

---

## portfolio-v2.html — Layout System

Every project section uses pure `position:absolute` within `project-inner`:

- `.project` — section container, height driven by content + padding
- `.project-inner` — `position:relative`, full width and height, positioning context for everything inside
- `.project-layout` — text column: `left:32px; top:32px; width:25vw; padding-top:40px`
- `.shot-above` — top photo: `left:calc(25vw + 64px); top:32px; width:30vw; height:30vh`
- `.shot-below` — bottom photo: `left:calc(25vw + 64px); top:calc(32px + 15vh); width:30vw; height:30vh`
- `.panel-top` — full-page top half: `left:calc(55vw + 80px); top:32px; width:calc((45vw - 120px) / 2); height:75vh`
- `.panel-bottom` — full-page bottom half: `left:calc(55vw + 80px + (45vw - 120px) / 2 + 8px); top:32px; width:calc((45vw - 120px) / 2); height:75vh`

**Section height formula**: `calc(75vh + 64px)` — bottom of tallest element (75vh) + 32px top padding + 32px bottom padding.

**Right space starts at**: `calc(55vw + 80px)` — after 25vw text column + 64px gap + 30vw photos + 16px gap.

---

## CMA Section (01 — Chiang Mai Ambassador)

- Brand colours: `#0F172A` to `#1a2a4a` gradient, `#EAB308` gold accent
- Images:
  - `images/portfolio-cma-shot-hero.jpg` — 1440x900 hero viewport screenshot
  - `images/portfolio-cma-shot-content.jpg` — 1440x900 content viewport screenshot
  - `images/portfolio-cma-fullpage.jpg` — 1440x7147 full-page screenshot (ORIGINAL, keep intact)
  - `images/portfolio-cma-fullpage-top.jpg` — 1440x3574 top half
  - `images/portfolio-cma-fullpage-bottom.jpg` — 1440x3574 bottom half
- Lightboxes: `lightbox-cma-hero`, `lightbox-cma-content`, `lightbox-cma-full`
- Visit Site URL: `https://chiangmaiambassador.com` (never www)

---

## Absolute Rules — Behaviour

**These violations cost hours of rework. They have happened repeatedly.**

### 1. Touch only what is named
If a property is not mentioned, do not touch it. If an element is not named, do not touch it. "Change the border" does not mean change the padding. "Move the photo" does not mean resize it.

### 2. "Lock it" means everything is frozen
When Shayne says "lock it", "don't touch anything", or confirms a visual state — nothing on the page changes until explicitly told to. Every element. No exceptions.

### 3. Understand the space before writing code
Before placing anything in the layout, describe in plain language where it goes and what dimensions it will have. Confirm with Shayne before writing a line of CSS.

### 4. Ask one question when confused — then execute
If the brief is ambiguous, ask ONE specific question. Not multiple. Not alternatives. One question. Then execute immediately on the answer.

### 5. Flag visual risks before implementing
If the maths suggest something will look bad (e.g. a 1440px-wide image in a 200px panel), say so before touching the file. "This will probably look like X — try anyway?"

### 6. "commit and push" means do it now
No asking. No confirming. Run `git add`, `git commit`, `git push` immediately.

### 7. Never use www URLs
All client site links use the bare domain. `chiangmaiambassador.com` not `www.chiangmaiambassador.com`.

### 8. Never delete files
Move to `_archive/` in project root. Add `_archive/` to `.gitignore` if not present.

### 9. State exactly what changed
Not "fixed it." Say "changed X to Y in file Z at line N."

### 10. "Did I mention X?" means revert X immediately
If Shayne asks "did I say to do X?" — that is a callout. Revert X without argument, apologise once in one sentence, move on.

---

## Images — Naming Convention

All images prefixed: `shaynesdesigns-shaynes-designs-[descriptor]`
Portfolio client images: `portfolio-[client]-[type].jpg`

---

## No Localhost

Never run `npm run dev`, `yarn dev`, or any dev server unless explicitly asked.

---

**Last Updated**: 29/06/2026
