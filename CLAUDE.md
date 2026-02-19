# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Content Generator for ronaldzwart.nl — a single-page web app that generates presentations using the Claude API. Primary use case: Belastingdienst (Dutch Tax Authority) corporate presentations in Rijkshuisstijl. UI is entirely in Dutch.

**Stack**: Vanilla HTML/CSS/JS (no frameworks, no build step, no bundler). PHP proxy for API calls. Deployed as static files via FTP.

**URL**: https://www.ronaldzwart.nl/test/

## Architecture

```
index.html  →  app.js  →  proxy.php  →  Claude API (claude-sonnet-4-5-20250929)
                  ↕
             styles.css
```

### 4-step wizard flow (in app.js):
1. **Templates** — User picks a presentation template (Presentaties/Rapportages/Infographics)
2. **Bronnen** — User uploads source files (PDF, DOCX, TXT, CSV, images) or pastes text
3. **Preview** — AI generates slides; user can edit content-editable fields
4. **Export** — Download as PDF, DOCX, HTML, PPTX, PNG, or SVG

### Key files:
- `index.html` — Layout, sections, dialog elements
- `app.js` — All application logic: state, navigation, file handling, API calls, slide rendering
- `styles.css` — Full styling incl. dark mode, responsive, CSS variables for theming
- `proxy.php` — PHP cURL proxy that forwards requests to Anthropic API (CORS workaround)
- `standalone.html` — All-in-one version with embedded CSS/JS
- `.claude/skills/belastingdienst-huisstijl/` — Skill with BD corporate design templates and logo

### Data model:
- **Sources**: Array of `{id, name, size, type, label, previewUrl, content}` objects in memory
- **Slides**: Array of slide objects with `type` (cover/content/text/quote-right/quote-left) and content fields
- **API key**: Stored in `localStorage` under key `cg_api_key`
- **No persistence**: Generated presentations are lost on page refresh

### Slide rendering:
- Standard templates use `renderSlideHTML()` — simple cover/content/quote structure
- Belastingdienst "Projectupdate" template uses `renderBDSlideHTML()` — specialized with section labels, official styling, and illustration placeholders

## Deployment

- **Hosting**: Hetzner Shared Hosting (konsoleH) — GEEN VPS, geen SSH
- **Server**: `www601.your-server.de` (IP: `162.55.254.99`)
- **FTP user**: `ronaldzwart@gmail.com`
- **Deploy target**: `www.ronaldzwart.nl/test/`

### Automatisch deployen

Push naar `main` triggert GitHub Actions → FTP upload (zie `.github/workflows/deploy.yml`).

GitHub Secrets benodigd:
- `FTP_SERVER` = `www601.your-server.de`
- `FTP_USERNAME` = `ronaldzwart@gmail.com`
- `FTP_PASSWORD` = *(FTP wachtwoord)*

Excluded from deploy: `.git*`, `.github/`, `README*`, `CLAUDE.md`, `standalone.html`, `test/`, `.claude/`

### Handmatig deployen

Upload via FTP-client (bijv. FileZilla):
- Server: `www601.your-server.de`
- Gebruiker: `ronaldzwart@gmail.com`
- Bestanden: `index.html`, `styles.css`, `app.js`, `proxy.php`

## Belangrijk

- Dit is shared hosting — er is geen SSH beschikbaar
- Deploy gaat via FTP (niet rsync)
- SSH is NIET beschikbaar vanuit de Claude Code omgeving (geen ssh binary)
- Geef de gebruiker daarom altijd een kant-en-klaar commando om in zijn Mac terminal te plakken
- Er is geen build stap, test framework, of linter — bestanden worden direct geserveerd
- De API proxy (`proxy.php`) is stateless; de API key wordt client-side opgeslagen
- Source file content is gecapped op 8000 chars per bestand bij API calls
- Max 4096 tokens per API response
