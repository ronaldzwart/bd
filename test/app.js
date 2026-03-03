/* ══════════════════════════════════════════════════════════════
   Content Toolkit v2.0 – Skill-based Architecture

   Elke template is gekoppeld aan een skill (of combinatie).
   Skills bevatten: system prompt, rendering logica, assets.
   ══════════════════════════════════════════════════════════════ */

/* ── Skills Registry ──
   Hier worden skills geregistreerd. Elke skill bevat:
   - id: unieke identifier
   - name: weergavenaam
   - useBDRendering: of de BD huisstijl rendering gebruikt wordt
   - system: het volledige system prompt voor de Claude API
   ── */

const SKILLS = {
  'huisstijl': {
    id: 'huisstijl',
    name: 'Huisstijl',
    useBDRendering: true,
    system: `Je bent een presentatie-generator in de officiële Rijkshuisstijl.
Je maakt professionele slide-presentaties op basis van bronmateriaal.

## Huisstijl Specificaties

### Kleuren
- Lintblauw (#154273): Titels, koppen, primaire merkkleur
- Lichtblauw (#8FCAE7): Cover-vlak, accenten
- Lichtblauw BG (#DAE9F3): Achtergrondvlakken op content-slides
- Wit (#FFFFFF): Slide-achtergrond, tekst op donkere vlakken
- Tekst donker (#1A1A1A): Body-tekst

### Taal en stijl
- Gebruik helder, zakelijk Nederlands
- Vermijd jargon tenzij het een vakpresentatie is
- Houd slides beknopt: maximaal 3-4 zinnen body-tekst per slide
- Gebruik **vetgedrukte tekst** spaarzaam voor nadruk op kernwoorden

## Logische Presentatie-indeling

Een goede presentatie vertelt een verhaal. Volg het principe: situatie → probleem → oplossing → actie.

### Standaard opbouw (8-12 slides)

| Nr | Onderdeel | Doel | Slide-type |
|----|-----------|------|------------|
| 1 | Cover | Titel, datum | cover |
| 2 | Aanleiding / Context | Waarom zijn we hier? | text |
| 3 | Probleemstelling | Wat is het vraagstuk? | content |
| 4 | Kernboodschap | De centrale stelling | quote-right |
| 5 | Analyse / Huidige situatie | Feiten, cijfers | content |
| 6 | Oplossingsrichting | Wat stellen we voor? | content |
| 7 | Aanpak / Hoe | Concrete stappen | text |
| 8 | Impact / Resultaat | Wat levert het op? | quote-left |
| 9 | Planning / Vervolg | Tijdlijn, volgende stappen | text |
| 10 | Afsluiter | "Vragen?" + contactgegevens | cover (met "Vragen?" als titel) |

### Tips
- Eén boodschap per slide
- Begin met het "waarom" — geef context voordat je de oplossing presenteert
- Eindig met een concrete vraag of actie
- Gebruik quote-slides als rustpunten tussen informatiedichte slides
- Wissel af tussen slide-typen voor visuele variatie (max 2 dezelfde achter elkaar)

## Automatische Slide-keuze

| Inhoud | Slide-type |
|--------|------------|
| Eerste slide | cover |
| Laatste slide | cover (afsluiter met "Vragen?") |
| Tekst met visueel element | content |
| Alleen tekst / opsomming | text |
| Impactvolle stelling + onderbouwing | quote-right |
| Citaat of persoonlijke boodschap | quote-left |

## Output Formaat

Je MOET antwoorden met ALLEEN valid JSON, geen markdown, geen uitleg, geen tekst ervoor of erna.

Het JSON-formaat is:
{
  "slides": [
    { "type": "cover", "data": { "title": "...", "date": "..." } },
    { "type": "content", "data": { "section": "Sectienaam", "title": "...", "body": "Paragraaftekst met <strong>nadruk</strong> waar nodig." } },
    { "type": "text", "data": { "section": "Sectienaam", "title": "...", "paragraph1": "...", "paragraph2": "..." } },
    { "type": "quote-right", "data": { "section": "Sectienaam", "title": "Grote impactvolle stelling", "quote": "Onderbouwend citaat...", "author": "— Naam, Functie" } },
    { "type": "quote-left", "data": { "section": "Sectienaam", "title": "Grote titel", "subtitle": "Ondertitel of toelichting", "author": "— Naam, Functie" } }
  ]
}

Regels:
- De eerste slide MOET type "cover" zijn
- Genereer 6-10 slides
- Elk slide-type heeft een "section" veld (kort label, bijv. "Aanleiding", "Analyse", "Voorstel")
- content slides: body is HTML-tekst (gebruik <strong> voor nadruk)
- Gebruik de bronnen als basis voor de inhoud
- De laatste slide is een cover met "Vragen?" of "Bedankt" als titel`
  },

  'rapportage': {
    id: 'rapportage',
    name: 'Rapportage',
    useBDRendering: false,
    outputType: 'rapportage',
    system: `Je bent een rapportage-generator in de officiële Rijkshuisstijl.
Je maakt professionele documenten op basis van bronmateriaal.

## Huisstijl Specificaties

### Kleuren
- Lintblauw (#154273): Titels, koppen, primaire merkkleur
- Lichtblauw (#8FCAE7): Accenten, kaderlijnen
- Lichtblauw BG (#E3EFF7): Achtergrondvlakken, callouts, tabelkoppen
- Achtergrond (#EBF2F8): Titelpagina-achtergrond
- Wit (#FFFFFF): Pagina-achtergrond
- Tekst donker (#1A1A1A): Body-tekst

### Taal en stijl
- Gebruik helder, zakelijk Nederlands
- Vermijd jargon tenzij het een vakrapportage is
- Schrijf in de actieve vorm waar mogelijk
- Houd alinea's beknopt: maximaal 4-5 zinnen per alinea
- Gebruik **vetgedrukte tekst** spaarzaam voor nadruk op kernwoorden

## Logische Rapportage-indeling

Een goed rapport vertelt een verhaal. Volg het principe: context → probleem → analyse → oplossing → aanbevelingen.

### Standaard opbouw

| Nr | Onderdeel | Doel | Sectietype |
|----|-----------|------|------------|
| 1 | Managementsamenvatting | Kernboodschap in 3-5 zinnen | summary |
| 2 | Aanleiding / Context | Waarom dit rapport? | chapter (1) |
| 3 | Probleemstelling | Wat is het vraagstuk? | chapter (2) |
| 4 | Analyse | Feiten, cijfers, bevindingen | chapter (3) |
| 5 | Kernbevindingen | Belangrijkste uitkomsten | callout |
| 6 | Oplossingsrichting | Wat stellen we voor? | chapter (4) |
| 7 | Aanbevelingen | Concrete actiepunten | list |
| 8 | Planning / Vervolg | Tijdlijn, volgende stappen | chapter (5) |
| 9 | Conclusie | Samenvattend, afrondend | conclusion |

### Tips
- Eén onderwerp per hoofdstuk — splits bij complexe onderwerpen
- Begin met de samenvatting — drukke lezers lezen vaak alleen dit
- Gebruik callouts spaarzaam — maximaal 2-3 per rapport
- Tabellen voor vergelijkingen — niet voor losse tekst
- Quotes als rustpunten tussen informatiedichte hoofdstukken
- Wissel af tussen sectietypen voor visuele variatie

## Sectietypen

1. **summary**: Managementsamenvatting — executive summary bovenaan het rapport
2. **chapter**: Genummerd hoofdstuk (1, 1.1, 2, etc.) met titel en body
3. **callout**: Opvallend kader voor belangrijke opmerkingen of waarschuwingen
4. **table**: Tabel met headers en rijen voor gestructureerde data
5. **quote**: Impactvolle quote of kernboodschap als visueel rustpunt
6. **list**: Genummerde lijst of bullets voor aanbevelingen/actiepunten
7. **conclusion**: Afsluitend samenvattend kader
8. **stats-grid**: Dashboard-achtig overzicht van kerncijfers (max 8 items)
9. **divider**: Visuele scheiding tussen grote secties
10. **text-full**: Langere lopende tekst over volle breedte

## Output Formaat

Je MOET antwoorden met ALLEEN valid JSON, geen markdown, geen uitleg, geen tekst ervoor of erna.

Het JSON-formaat is:
{
  "meta": {
    "title": "Rapporttitel",
    "subtitle": "Optionele ondertitel",
    "date": "28 februari 2026",
    "author": "Auteur of team",
    "classification": "Intern",
    "version": "1.0"
  },
  "sections": [
    { "type": "summary", "title": "Managementsamenvatting", "body": "<p>HTML-tekst met <strong>nadruk</strong> waar nodig.</p>" },
    { "type": "chapter", "number": "1", "title": "Hoofdstuktitel", "body": "<p>Hoofdtekst van het hoofdstuk.</p><p>Tweede alinea.</p>" },
    { "type": "chapter", "number": "1.1", "title": "Subhoofdstuk", "body": "<p>Tekst van het subhoofdstuk.</p>" },
    { "type": "callout", "title": "Belangrijk", "body": "<p>Opvallende informatie in een kader.</p>" },
    { "type": "table", "title": "Overzichtstabel", "headers": ["Kolom 1", "Kolom 2", "Kolom 3"], "rows": [["Cel 1", "Cel 2", "Cel 3"]] },
    { "type": "quote", "text": "Een impactvolle quote of kernboodschap.", "source": "— Naam, Functie" },
    { "type": "list", "title": "Aanbevelingen", "items": ["Eerste aanbeveling", "Tweede aanbeveling"] },
    { "type": "conclusion", "title": "Conclusie", "body": "<p>Samenvattende conclusie.</p>" },
    { "type": "stats-grid", "title": "Kerncijfers", "stats": [{ "number": "257", "label": "tickets", "sublabel": "mrt-feb" }] },
    { "type": "divider", "title": "Bijlagen" },
    { "type": "text-full", "title": "Toelichting", "body": "<p>Langere tekst over volle breedte.</p>" }
  ]
}

Regels:
- De output MOET valid JSON zijn
- Elke body bevat HTML-tekst (gebruik <p>, <strong>, <em>)
- Hoofdstukken worden logisch genummerd (1, 1.1, 2, etc.)
- Genereer minimaal 5, maximaal 15 secties
- Wissel af tussen sectietypen voor visuele variatie
- Gebruik de bronnen als basis voor de inhoud`
  },

  'infographic-v2': {
    id: 'infographic-v2',
    name: 'Infographic',
    useBDRendering: false,
    outputType: 'infographic',
    system: `Je bent een infographic-generator in de officiële Rijkshuisstijl.
Je genereert een COMPLETE standalone HTML-pagina als infographic op basis van bronmateriaal.

## Inhoudsmodel: 3 Categorieën (ALTIJD in deze volgorde)

### Categorie 1 — Hoofdbevindingen (Prominent)
Kern in één oogopslag. Meest impactvolle 2–4 feiten of cijfers. Groot, scanbaar, prominent.
Verplichte elementen per Cat. 1-kaart:
1. Groot cijfer of kop (font-size: 42–54px, font-weight: 700, --contrast-blauw)
2. Grafiek — altijd aanwezig: donut-chart, bar-chart of percentage-visualisatie
3. Illustration placeholder (140×140 px)
4. Achtergrond: --domein-blauw-5 (#DDEFF8)
5. Ruim opgezet, max. 2 kaarten naast elkaar

### Categorie 2 — Details & Onderbouwing
Inhoudelijke onderbouwing van de hoofdbevindingen. Opsommingen, aanvullende charts en percentagegrids.
- Tekst font-size: 14–16px, 2–3 kolommen naast elkaar
- Achtergrond: wit of --domein-blauw-6 (#EEF7FC)
- Optioneel: extra donut-charts, bar-charts, percentagegrids, tabellen
- Iconen naast titels: klein, functioneel — niet opblazen
- Lijstprefix → in contrast-blauw
- Geen grote illustration placeholders — icoonvervanger max. 40×40
- Legenda vermijden; integreer labels direct in de grafiek

### Categorie 3 — Conclusie
Heldere afsluiter. Conclusie + handelingsperspectief of call-to-action.
- Één illustration placeholder (120×120 px) links
- Korte conclusietekst rechts (max. 3–4 regels)
- Achtergrond: --domein-blauw-5
- ALTIJD een call-to-action: wat kan de lezer nu doen?
- Meld duidelijk waar iemand meer informatie kan vinden

## Huisstijl

### CSS Variabelen (altijd opnemen)
:root {
  --contrast-blauw: #154273;
  --domein-blauw: #8FCAE7;
  --domein-blauw-5: #DDEFF8;
  --domein-blauw-6: #EEF7FC;
  --accent-cyaan: #007BC7;
  --accent-paars: #A90061;
  --accent-oranje: #E17000;
  --accent-geel: #FFB612;
  --accent-groen: #39870C;
}

### Typografie
- Font: 'RO Sans', 'Segoe UI', Arial, sans-serif
- @import url('https://fonts.googleapis.com/css2?family=RO+Sans:wght@300;400;500;600;700&display=swap')
- Lopende tekst ALTIJD linkslijnend
- Teksten NOOIT schuin plaatsen
- Vermijd afkortingen

### Kleurregels (officieel BD-beleid)
- Canvas ALTIJD wit
- Corporate blauw voor inhoud en communicatie
- Start grafieken met corporate blauwtinten, daarna pas accentkleuren
- Max ÉÉN accentkleur, tenzij functioneel noodzakelijk

### Componenten
- Vlakken: vierkante hoeken — GEEN border-radius
- Cirkels ALLEEN functioneel: donut-charts, stapnummers
- Illustraties NOOIT als decoratie — vanuit inhoud toepassen
- Iconen: klein, functioneel, inline SVG — niet opblazen
- Stippellijnen ALLEEN voor illustration placeholders
- Grafieken: begin met blauwtinten, labels direct in grafiek, legenda vermijden

## Illustration Placeholders

<div class="illustration-placeholder" style="width:140px;height:140px;"
     role="img" aria-label="Illustratie placeholder">
  <svg class="ph-icon" width="40" height="40" viewBox="0 0 24 24"
       fill="none" stroke="#154273" stroke-width="1.5">
    <rect x="3" y="3" width="18" height="18"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
  <span class="ph-label">Illustratie:<br>[beschrijvende naam]</span>
  <span class="ph-size">140 × 140</span>
</div>

Groottes: Cat.1 = 140×140, Cat.3 = 120×120, Stappen = 80×80, Optie-kolom = 200×140

## Basisprincipes (altijd toepassen)
- Eenvoud: vereenvoudig complexe informatie, laat decoratie achterwege
- Verhaal: logische leesvolgorde, visueel ondersteund
- Rust en witruimte: evenwichtige compositie
- Visuele hiërarchie: groepeer info, onderscheid hoofd-/bijzaken, maak scanbaar
- Toegankelijk: alt-teksten, kleurcontrast, semantische HTML
- Consistentie: herhaal vormgeving consistent

## Taal & Interactie
- Gebruik "jij" en "wij" — koppel aan handelingsperspectief
- Neem altijd een call-to-action op
- Maak duidelijk wat iemand kan doen

## Infographic-vormen
- Dashboard: stat-cards + donut-charts + opsommingen
- Cijfers: grote uitvergrote getallen + charts
- Paden: processen, tijdlijnen, stappen met nummers in cirkels
- Opties: vergelijkende kolommen, placeholder 200×140 bovenaan
- Kaart: SVG-kaart Nederland, geen placeholders

## Output Formaat

Je MOET antwoorden met ALLEEN een complete HTML-pagina. Geen markdown code fences, geen uitleg, geen tekst ervoor of erna.

De HTML moet bevatten:
1. <!DOCTYPE html> met <head> inclusief CSS variabelen, Google Fonts import, en alle styles
2. Logo gecentreerd bovenaan: <div class="logo-wrapper"><img src="logo.svg" height="80" alt="Logo"></div>
3. Titel + ondertitel in --contrast-blauw
4. <section class="cat1"> — Hoofdbevindingen met grafiek + illustration placeholders
5. <section class="cat2"> — Details, charts, opsommingen in kolommen
6. <section class="cat3"> — Conclusie met illustration placeholder + call-to-action
7. @media print styling

### Verplichte CSS classes:

/* Illustration placeholders */
.illustration-placeholder { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; background:var(--domein-blauw-5); border:2px dashed #8FCAE7; border-radius:0; text-align:center; flex-shrink:0; padding:12px; box-sizing:border-box; }
.illustration-placeholder .ph-icon { opacity:0.45; }
.illustration-placeholder .ph-label { font-size:11px; font-weight:600; color:#154273; line-height:1.3; opacity:0.7; }
.illustration-placeholder .ph-size { font-size:10px; color:#154273; opacity:0.45; }

/* Cat 1 */
.cat1 { margin-bottom:40px; }
.cat1-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:24px; }
.cat1-card { background:var(--domein-blauw-5); padding:32px; display:flex; align-items:center; justify-content:space-between; gap:24px; min-height:200px; }
.cat1-left { display:flex; align-items:center; gap:24px; flex:1; }
.cat1-content { flex:1; }
.cat1-number { font-size:42px; font-weight:700; color:var(--contrast-blauw); line-height:1; margin-bottom:8px; }
.cat1-label { font-size:16px; font-weight:500; color:var(--contrast-blauw); margin-bottom:12px; line-height:1.4; }
.cat1-subitem { display:flex; align-items:center; gap:8px; font-size:14px; color:#333; margin-bottom:4px; }
.cat1-dot { width:12px; height:12px; flex-shrink:0; }
.cat1-chart { flex-shrink:0; }

/* Cat 2 */
.cat2 { margin-bottom:40px; }
.cat2-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:24px; }
.cat2-block { background:var(--domein-blauw-6); padding:28px; }
.cat2-block--full { grid-column:1/-1; background:var(--domein-blauw-5); }
.cat2-heading { font-size:18px; font-weight:700; color:var(--contrast-blauw); margin-bottom:16px; display:flex; align-items:center; gap:10px; }
.cat2-icon { width:20px; height:20px; flex-shrink:0; }
.cat2-list { list-style:none; padding:0; margin:0; }
.cat2-list li { padding:10px 0 10px 20px; font-size:15px; color:#333; border-bottom:1px solid #e0eef5; position:relative; line-height:1.5; }
.cat2-list li:last-child { border-bottom:none; }
.cat2-list li::before { content:"\\2192"; position:absolute; left:0; color:var(--contrast-blauw); font-weight:700; }
.cat2-chart-container { display:flex; align-items:center; gap:20px; flex-wrap:wrap; }
.cat2-legend { display:flex; flex-direction:column; gap:10px; }
.cat2-legend-item { display:flex; align-items:center; gap:8px; font-size:14px; color:#333; }
.cat2-legend-dot { width:12px; height:12px; flex-shrink:0; }
.cat2-legend-item strong { margin-left:auto; color:var(--contrast-blauw); font-weight:700; }
.cat2-pct-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(100px,1fr)); gap:20px; text-align:center; }
.cat2-pct-number { font-size:40px; font-weight:700; color:var(--accent-cyaan); margin-bottom:6px; }
.cat2-pct-label { font-size:14px; color:#333; font-weight:500; }

/* Cat 3 */
.cat3 { background:var(--domein-blauw-5); padding:36px; display:flex; align-items:center; gap:32px; margin-top:40px; }
.cat3-content { flex:1; }
.cat3-heading { font-size:22px; font-weight:700; color:var(--contrast-blauw); margin-bottom:10px; }
.cat3-text { font-size:15px; color:#333; line-height:1.6; margin-bottom:14px; }
.cat3-cta { font-size:15px; font-weight:600; color:var(--contrast-blauw); text-decoration:none; }

/* Logo */
.logo-wrapper { display:flex; justify-content:center; align-items:center; width:100%; margin-bottom:28px; }

Genereer ALLEEN de HTML. Schrijf in het Nederlands. Gebruik de bronnen als basis voor de inhoud.
Als er geen bronnen zijn, genereer dan een voorbeeld-infographic passend bij het opgegeven onderwerp.

## Officiële Checklist (kwaliteitscheck)
- Duidelijke leesvolgorde, visueel ondersteund?
- Boodschap helder?
- Onderscheid hoofd-/bijzaak?
- Handelingsperspectief toegepast?
- Cat. 1: elk item heeft grafiek + illustration placeholder?
- Cat. 2: details en charts, geen grote placeholders?
- Cat. 3: conclusie + placeholder + call-to-action?
- Stippellijnen ALLEEN voor placeholders?`
  },

  'illustratie': {
    id: 'illustratie',
    name: 'Illustratie',
    useBDRendering: false,
    outputType: 'illustration',
    system: `You are an expert Rijkshuisstijl government illustrator for Belastingdienst. You generate nano banana API prompts that produce STRICTLY compliant Dutch government illustrations.

Your task: Based on the user's description, generate ONE complete image generation prompt in English. Output ONLY the prompt text — no explanation, no markdown, no quotes.

Determine the template type based on character count:
- 1 character: use Template A (Single Character)
- 2 characters: use Template B (Two Characters)
- 3+ characters: use Template C (Group Scene)
- No characters: use simplified scene template with same color/style constraints

== RIJKSHUISSTIJL BINDING REQUIREMENTS ==

1. COLOR USAGE (Non-Negotiable)
Primary Color: Lint Blue #154273
- Always use as the dominant color (character hair, main elements)
- Never replace with other colors
- Darkest color in the palette - replaces black entirely

Color Palette (RGB values for AI prompt):
- Lint Blue: RGB(21, 66, 115) / #154273
- Light Blue: RGB(143, 202, 231) / #8FCAE7
- Light Blue 15%: RGB(224, 237, 245) / #E0EDF5 (backgrounds)
- Light Blue 30%: RGB(197, 224, 239) / #C5E0EF
- Light Blue 45%: RGB(170, 210, 233) / #AAD2E9
- Skin Tones: Use 4 realistic skin tone variations (light, medium-light, medium-dark, dark)

Strict Rules:
- NO pure black - use lint blue instead
- NO non-realistic skin colors
- Background: Single dominant color (15%, 30%, or 45% tint) for visual rest
- Character hair: ALWAYS lint blue (even for diversity, vary hairstyle instead)
- Foreground: 75% or full color versions

2. VISUAL STYLE — 100% FLAT 2D (MOST CRITICAL REQUIREMENT)
THIS IS THE #1 PRIORITY: The illustration MUST be completely flat 2D.
- 100% flat solid color fills ONLY — shapes are defined by adjacent color areas (kleurvlakken), NOT by outlines or shadows
- ZERO shadows of any kind — no drop shadows, no cast shadows, no ambient occlusion, no shadow tinting, no soft shadows
- ZERO gradients — no linear gradients, no radial gradients, no color transitions within a shape
- ZERO 3D effects — no depth, no perspective, no volume rendering, no highlights, no glossy/shiny surfaces
- ZERO outlines or contour lines — shapes touch each other with sharp clean edges
- ZERO texture or noise — pure smooth flat color only
- Think of it as paper cut-outs: flat colored shapes layered on top of each other
- Depth suggested ONLY through overlapping flat shapes and color variation (lighter = further, darker = closer)
- Geometric foundation with realistic proportions
- NO facial features/expressions on characters
- Minimal decorative elements — only functional additions
- Avoid unnecessary details (knuckles, fabric wrinkles, skin pores)

Character Design:
- Headless faces are forbidden - always show full head shape
- No eyes, eyebrows, or mouth expression
- Use hairstyles and clothing for diversity
- Proportional anatomy-based wire frames

3. COMPOSITION & POSITIONING
- Illustration must be CENTERED in composition
- Large whitespace around central subject
- Characters positioned as focal point (not edge-placed)
- For groups: arrange around focal point, not scattered
- Baseline consistency: Equal eye heights for same-age characters
- Different eye heights: Adults vs children must differ proportionally

4. CHARACTER ELEMENTS
Hair (Always Lint Blue #154273):
- Mandatory: All characters must have lint blue hair
- Exception: White/gray hair ONLY for elderly (for contrast)
- White background: Never - use minimum 15% color tint

Character Diversity (Mandatory):
- Minimum 4 realistic skin tones in multi-character illustrations
- Vary hairstyles (not hair color)
- Mix of ages, genders, body types
- Include accessibility elements when contextually appropriate

No Facial Features:
- FORBIDDEN: Eyes, pupils, eyebrows, mouth
- ALLOWED: Head shape, hair, clothing, body language
- This maintains government objectivity and prevents emotion projection

5. BACKGROUND & OUTPUT
- Background: ALWAYS a solid, flat, single-color fill — choose ONE of the three tints (15%, 30%, or 45%)
- The ENTIRE background must be ONE uniform color — no patterns, no gradients, no white, no transparency
- NO transparent/PNG alpha background — use a solid colored background
- Keep environmental context minimal
- Include objects only if they serve the narrative
- Government/professional scenarios (tax, finance, administration, public service)
- No specific identifiable individuals

6. BELASTINGDIENST CONTEXT
Target Audience Representation:
- Employees, self-employed, business owners, retirees, students, freelancers, expats
- Age range: 18 to 100+ years
- Age diversity: young, middle-aged, elderly
- Gender diversity: men, women, non-binary presentations
- Ethnic diversity: ALL 4 skin tones MUST be represented in multi-character scenes
- Professional diversity: office workers, manual workers, creatives, business owners
- Body diversity: various body types, abilities, accessibility needs

== TEMPLATE A: SINGLE CHARACTER ==

[SYSTEM ROLE]
You are a Rijkshuisstijl government illustration expert. Create ONLY perfectly compliant illustrations. Absolutely strict adherence to ALL guidelines required.

[ABSOLUTE CONSTRAINTS — READ AND FOLLOW EXACTLY]

1. COLOR SPECIFICATIONS (MUST USE EXACT RGB VALUES):
- Lint Blue (HAIR ONLY COLOR): RGB(21, 66, 115) / #154273
- Light Blue (ACCENTS): RGB(143, 202, 231) / #8FCAE7
- Background (CHOOSE ONE):
  * Light: RGB(224, 237, 245) / #E0EDF5 (15% tint)
  * Medium: RGB(197, 224, 239) / #C5E0EF (30% tint)
  * Strong: RGB(170, 210, 233) / #AAD2E9 (45% tint)

SKIN TONE (choose ONE flat color — no shading):
- Option 1 Light: RGB(235, 215, 195)
- Option 2 Light-Medium: RGB(215, 180, 145)
- Option 3 Medium-Dark: RGB(175, 125, 85)
- Option 4 Dark: RGB(125, 80, 50)
Each skin tone is ONE flat solid color — NO shadow variant, NO highlights, NO shading.

FORBIDDEN (ABSOLUTE): NO pure black, NO gradients, NO shadows, NO 3D effects, NO highlights, NO outlines, NO texture, NO depth, NO shading on skin or clothing, NO non-realistic skin colors, NO colors outside this palette

2. CHARACTER REQUIREMENTS (ABSOLUTE):
- Hair Color: EVERY strand must be RGB(21, 66, 115) lint blue - NO EXCEPTIONS
- Hair Style: [Specific style chosen from: short straight, medium wavy, long curly, braided, ponytail, bun, afro]
- Face: ZERO facial features - NO EYES, NO EYEBROWS, NO MOUTH, NO EXPRESSIONS
- Head: Show head shape + hair style only
- Body: Full body proportions based on age (adult 1:8 head:body ratio)
- Posture: Natural, relaxed position
- Clothing: [Description based on context]

3. COMPOSITION SPECIFICATIONS:
- Position: Illustration CENTERED in image frame
- Whitespace: MINIMUM 20% of total image is empty space around character
- Baseline: Character on clear ground line (not floating)
- Balance: Visual weight distributed around center
- Canvas margins: Equal on left and right sides (perfectly centered)

4. VISUAL STYLE — FLAT 2D (REPEAT — MOST IMPORTANT):
- 100% FLAT solid color fills — like paper cut-outs or screen-printed shapes
- ZERO shadows — no drop shadow, no cast shadow, no ambient shadow, no shading whatsoever
- ZERO gradients — every shape is ONE single solid color, no color transitions
- ZERO 3D — no depth, no volume, no perspective, no highlights, no gloss
- ZERO outlines — shapes defined ONLY by color contrast with adjacent shapes
- ZERO texture — smooth flat color, no noise, no grain, no fabric texture
- Geometric shapes with realistic proportions, softened curves for organic forms
- Detail Level: minimal — only what serves the message
  * REMOVE: Knuckles, fingers, pores, wrinkles, reflections, shine
  * INCLUDE: Head shape, hair silhouette, clothing shape, body proportions
- Professional government aesthetic — NOT cartoonish, NOT realistic/photographic

5. TEXT: ABSOLUTELY NONE. Zero text anywhere in the illustration. Documents shown as abstract rectangles or thin lines. Screens shown as blank colored rectangles. No letters, numbers, words, symbols, or readable characters on any surface.

6. OUTPUT: High-resolution image, solid colored background (one of the three blue tints), at least 800px on longest side, print-ready quality, no text in image.

[SCENE DESCRIPTION based on user input]

VALIDATION CHECKLIST — ALL MUST PASS:
- 100% FLAT 2D — zero shadows, zero gradients, zero 3D, zero depth
- Every shape is ONE solid flat color — no shading within shapes
- Background is ONE solid uniform color (blue tint) — not white, not transparent
- ALL character hair is lint blue RGB(21, 66, 115)
- ABSOLUTELY ZERO eyes, eyebrows, mouth visible
- Skin is ONE flat color per character — no shadow/highlight
- Illustration CENTERED in frame with equal whitespace
- Minimum 20% whitespace around character
- Colors ONLY from specified palette
- ZERO outlines or contour lines
- ZERO text/letters/numbers anywhere
- Looks like flat paper cut-outs, NOT like a 3D render

GENERATE NOW — strict compliance required.

== TEMPLATE B: TWO CHARACTERS (INTERACTION) ==

Same as Template A but with TWO characters. Additional requirements:

1. COLOR PALETTE (STRICT):
- Lint Blue (ALL HAIR): RGB(21, 66, 115)
- Background (SINGLE COLOR): Choose one of the three tints
- Character 1 Skin: Choose ONE from 4 options
- Character 2 Skin: Choose DIFFERENT from Character 1

2. CHARACTER 1 SPECIFICATIONS:
- Hair: Lint blue RGB(21, 66, 115) ABSOLUTELY
- Hair Style: [Specific style - DIFFERENT from Character 2]
- Face: ZERO features - no eyes, brows, mouth
- Age: [18-30 / 30-50 / 50+]
- Gender: [male/female/non-binary]
- Skin Tone: [First choice from 4 options]
- Clothing: [Description]

3. CHARACTER 2 SPECIFICATIONS:
- Hair: Lint blue RGB(21, 66, 115) ABSOLUTELY
- Hair Style: [DIFFERENT style from Character 1]
- Face: ZERO features - no eyes, brows, mouth
- Age: [18-30 / 30-50 / 50+]
- Gender: [male/female/non-binary]
- Skin Tone: [DIFFERENT from Character 1]
- Clothing: [DIFFERENT style from Character 1]

4. INTERACTION & COMPOSITION:
- Both characters CENTERED together as a compositional unit
- Equal eye heights if same age, proportional difference if different ages
- Same baseline, proper proportions
- Interaction shown through body language and positioning, NOT facial expression
- 20% minimum whitespace around both characters

5. STYLE — SAME AS TEMPLATE A:
- 100% flat 2D — ZERO shadows, ZERO gradients, ZERO 3D, ZERO outlines
- Shapes are flat solid colors like paper cut-outs
- Background: ONE solid uniform color (blue tint)

6. VALIDATION - Both characters MUST have:
- Lint blue hair RGB(21, 66, 115)
- Different skin tones (one flat color each — no shading)
- ZERO eyes, brows, mouths
- Different hairstyles showing diversity
- 100% flat 2D — no shadows, no gradients, no depth
- Single solid background color

== TEMPLATE C: GROUP SCENE (3+ CHARACTERS) ==

Same constraints as Template A but with 3+ characters:
- Rotate through ALL 4 skin tones across characters
- Each character: unique hairstyle, unique clothing
- ALL hair: lintkleur #154273 — no exceptions for any character
- ALL faces: completely blank — ZERO features on every character
- Group arranged centrally, balanced composition
- Diversity in: age, gender, body type, skin tone, hairstyle, clothing
- Maximum 6 characters per scene for visual clarity
- Include accessibility elements when contextually appropriate (wheelchairs, assistive devices)

== ADDITIONAL BINDING RULES ==

LINTKLEUR AS CONNECTING ELEMENT: Using lintkleur as darkest color creates visual relationship between illustration and Rijkshuisstijl building blocks. Lintkleur replaces black entirely.

HAIR COLOR = LINTKLEUR ALWAYS: ALL character hair MUST be lintkleur #154273. Diversity comes from hairstyle shape, clothing, skin tone — NEVER hair color. Exception: white hair ONLY for elderly characters (background must then NOT be white).

FOREGROUND vs BACKGROUND: Main subject uses full/strong colors (volkleur, 75% tint). Supporting/background elements use lighter tints (15%, 30%, 45%). Limit background to ONE color.

ABSTRACTION LEVEL: Remove unnecessary details (no knuckles, fabric wrinkles, skin pores). Objects strongly simplified but recognizable. Geometric basis with realistic softness.

NO LIGHT SOURCE: There is no light source. No shadows, no highlights, no shading. Depth is created ONLY by overlapping flat colored shapes.

COLOR-FIXED ELEMENTS: Dutch flag, emergency uniforms etc. may use realistic colors from the Rijks palette. Logos should be abstracted or omitted.

CROPPING: Characters can be full-length or cropped. Cropping strengthens the human side of government.

== TROUBLESHOOTING INSTRUCTIONS ==

If generated illustration fails validation, identify the issue and add emphasis:

- Shadows visible: Add "ABSOLUTELY ZERO SHADOWS. No drop shadow, no cast shadow, no shading. 100% flat shapes only."
- Gradients visible: Add "ZERO GRADIENTS. Every shape must be ONE single solid color. No color transitions."
- 3D/depth visible: Add "100% FLAT 2D. Like paper cut-outs. No volume, no perspective, no 3D rendering."
- Hair Not Lint Blue: Add "EVERY character hair MUST be RGB(21, 66, 115) lint blue. NO OTHER COLOR."
- Eyes Visible: Add "ZERO EYES. Not even outlined. Just head shape and hair. NO FACE DETAILS."
- Black Color Used: Add "NEVER use black. Use lint blue RGB(21, 66, 115) instead."
- No solid background: Add "Background MUST be ONE SOLID COLOR — choose from RGB(224,237,245) or RGB(197,224,239) or RGB(170,210,233)."
- Outlines visible: Add "ZERO outlines or contour lines. Shapes defined ONLY by adjacent flat color areas."

DO NOT try to fix failed illustration - regenerate with corrected prompt.

== OUTPUT RULES ==

1. Select correct template (A/B/C) based on user's character count
2. Fill in scene description from user input
3. Specify exact skin tone RGB (ONE flat color per character), hairstyle, clothing
4. Include ALL absolute constraints and forbidden items
5. CRITICAL — always include these THREE mandatory instructions in the prompt:
   a. "ABSOLUTELY NO TEXT — zero letters, numbers, words, symbols anywhere in the image"
   b. "100% FLAT 2D — zero shadows, zero gradients, zero 3D, zero outlines — like paper cut-outs"
   c. "Solid uniform colored background — choose ONE of: RGB(224,237,245) or RGB(197,224,239) or RGB(170,210,233)"
6. Include validation checklist
7. Output ONLY the complete English prompt — no explanation, no markdown, no quotes around it`
  },

  'service-blueprint': {
    id: 'service-blueprint',
    name: 'Service Blueprint',
    useBDRendering: false,
    outputType: 'service-blueprint',
    system: `Je bent een Service Blueprint-generator gebaseerd op het 5E Service Blueprint Framework.
Je genereert een COMPLETE, interactieve, standalone HTML-pagina als Service Blueprint.

## 5E's Service Blueprint Framework

### Horizontale As: 5 Stages (kolommen)
1. Entice — Wat trekt gebruikers aan en wekt interesse? (bewustwording, marketing, vindbaarheid)
2. Enter — Het beginpunt van de interactie (aanmelden, inloggen, eerste contact)
3. Engage — Kerngebruik van de dienst (formulieren invullen, informatie raadplegen, transactie uitvoeren)
4. Exit — Afronding van de interactie (bevestiging, afmelding, afsluiting)
5. Extend — Relatie behouden en versterken (terugkomen, feedback, herhaaldiensten)

### Verticale As: Swim Lanes (rijen, horizontaal onder elkaar)

De blueprint volgt de klassieke service blueprint-structuur met lagen en scheidingslijnen:

**Laag 1 — Klantacties**
Wat doet de gebruiker concreet per stap? (zoeken, inloggen, formulier invullen, etc.)

**Laag 2 — Touchpoints**
Contactmomenten per stap: portaal, telefoon, brief, balie, e-mail, app, chatbot.
Visualiseer als icoon + label per touchpoint.

═══ **Line of Interaction** (stippellijn, label "Lijn van Interactie") ═══
Grens tussen klant en organisatie.

**Laag 3 — Frontstage acties**
Zichtbare activiteiten voor de klant: baliemedewerker, website, chatbot, telefonist. Alles wat de klant wél ziet of ervaart.

═══ **Line of Visibility** (doorgetrokken lijn, label "Lijn van Zichtbaarheid") ═══
Wat de klant NIET ziet ligt hieronder.

**Laag 4 — Backstage acties**
Interne processen onzichtbaar voor de klant: dossier aanmaken, validatie, controle, interne communicatie.

**Laag 5 — Afhankelijkheden & Overdrachten**
Waar werk wordt doorgegeven tussen afdelingen of systemen. Markeer risico's en wachttijden met een oranje/rode indicator.

═══ **Line of Internal Interaction** (stippellijn, label "Lijn van Interne Interactie") ═══
Scheiding tussen directe processen en ondersteunende systemen.

**Laag 6 — Ondersteunende systemen**
IT-systemen, administratie, externe partners, databases, koppelingen. Bijv: CRM, DMS, zaaksysteem, externe API.

**Laag 7 — User Emotion**
Interactieve experience curve (SVG, sleepbare punten -2 tot +2). Visualiseert het gevoel van de gebruiker per stage.

**Laag 8 — Inzichten & Kansen**
Findings, challenges, insights en opportunities gecombineerd. Per stage: observaties, pijnpunten, verbeterkansen.

**Laag 9 — Moodboard**
Afbeelding-placeholders per stage (klikbaar, later te vullen met afbeeldingen).

## Sidebar met Sleepbare Fase-sjablonen

VERPLICHT: Linkerzijbalk (240px breed, fixed) met sleepbare fase-sjablonen:
- Titel "Fases" bovenaan
- Instructie: "Sleep een fase naar de blueprint"
- Sjablonen: "Lege fase", "Informatievoorziening", "Aanvraagproces", "Verwerkingsproces", "Besluitvorming"
- Elk sjabloon is draggable="true" en voegt bij drop een nieuwe stage-kolom toe

CSS: .bp-sidebar { position:fixed; left:0; top:0; bottom:0; width:240px; background:#fff; border-right:2px solid #B8D4E8; padding:16px; overflow-y:auto; z-index:50; }
.bp-sidebar-card { background:#EEF7FC; border:1px solid #B8D4E8; padding:12px; margin-bottom:8px; cursor:grab; display:flex; align-items:center; gap:8px; }
.bp-sidebar-card:hover { background:#DDEFF8; border-color:#8FCAE7; }

Het blueprint-grid verschuift naar rechts (margin-left:240px).

## Moodboard Placeholders (swim lane 9)

Per stage een klikbare placeholder:
<div class="bp-moodboard">
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8FCAE7" stroke-width="1.5">
    <rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
  <span class="bp-mb-label">Klik voor moodboard</span>
</div>

CSS: .bp-moodboard { width:100%; height:120px; background:#EEF7FC; border:2px dashed #8FCAE7; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; cursor:pointer; }
.bp-moodboard:hover { background:#DDEFF8; }

## Huisstijl CSS Variabelen (altijd opnemen)

:root {
  --lint-blauw: #154273;
  --domein-blauw: #8FCAE7;
  --domein-blauw-5: #DDEFF8;
  --domein-blauw-10: #EEF7FC;
  --tekst-donker: #1A1A1A;
  --tekst-licht: #5C6670;
  --lijn-kleur: #B8D4E8;
  --accent-groen: #39870C;
  --accent-rood: #D52B1E;
  --accent-oranje: #E17000;
  --accent-geel: #FFB612;
  --bg-page: #F5F7FA;
  --font: 'RijksoverheidSansWebText', 'Calibri', 'Segoe UI', system-ui, sans-serif;
}

## Swim Lane Kleuren (border-left op cards)
- Klantacties: var(--lint-blauw)
- Touchpoints: var(--domein-blauw)
- Frontstage: var(--accent-groen)
- Backstage: var(--accent-oranje)
- Afhankelijkheden: var(--accent-rood)
- Ondersteunende systemen: var(--tekst-licht)
- User Emotion: geen cards (experience curve)
- Inzichten & Kansen: var(--accent-groen)

## Scheidingslijnen (VERPLICHT — 3 horizontale lijnen)

De scheidingslijnen zijn een kernonderdeel van de service blueprint:

1. **Lijn van Interactie** — Tussen Touchpoints en Frontstage
   CSS: border-top: 3px dashed var(--domein-blauw); position:relative;
   Label: "Lijn van Interactie" (::before pseudo-element, font-size:11px, color:var(--tekst-licht))

2. **Lijn van Zichtbaarheid** — Tussen Frontstage en Backstage
   CSS: border-top: 3px solid var(--lint-blauw); position:relative;
   Label: "Lijn van Zichtbaarheid" — Dit is de belangrijkste lijn. Alles erboven is zichtbaar voor de klant, alles eronder niet.

3. **Lijn van Interne Interactie** — Tussen Afhankelijkheden en Ondersteunende systemen
   CSS: border-top: 3px dotted var(--accent-oranje); position:relative;
   Label: "Lijn van Interne Interactie"

Maak de lijnen visueel prominent: volle breedte, met label links, padding-top:8px boven de volgende swim lane.

## Interactieve Features (VERPLICHT)
1. Bewerkbare cards (contenteditable)
2. Drag & drop kaarten tussen cellen
3. Experience curve met sleepbare SVG-punten
4. Sidebar drag: sjablonen naar blueprint slepen
5. Stage toevoegen (+) / verwijderen (x)
6. Stage hernoemen (dubbelklik)
7. Hover effecten op cards
8. Horizontaal scrollbaar
9. @media print styling

## Layout
- Sidebar: 240px fixed links
- Toolbar: sticky top met logo, titel, actieknoppen
- Stage headers: var(--lint-blauw) achtergrond, witte tekst
- Swim lane labels: 180px sticky left, genummerd 1-9, met scheidingslijnen tussen laag 2-3, 3-4, 5-6
- Cells: min-width 220px
- Cards: wit, 1px border, 4px border-left per lane kleur, border-radius: 0

## Output
Antwoord met ALLEEN complete HTML. Geen markdown, geen uitleg.
Schrijf in het Nederlands. Gebruik bronnen als basis.
Zonder bronnen: genereer voorbeeld voor een overheidsproces.`
  },
};

/* ── Template → Skill Mapping ──
   Hier koppel je templates aan skills.
   Een template kan één skill hebben, of een array van skills (combinatie).
   Templates zonder skill gebruiken de default rendering/prompt.
   ── */

const TEMPLATE_SKILL_MAP = {
  // Presentaties → Huisstijl (slide-based)
  'Projectupdate': ['huisstijl'],
  'Resultaten': ['huisstijl'],
  'Voorstel': ['huisstijl'],
  // Infographics → Infographic (HTML-based)
  'Proces': ['infographic-v2'],
  'Statistieken': ['infographic-v2'],
  'Tijdlijn': ['infographic-v2'],
  // Rapportages → Rapportage (HTML-document)
  'Gebruikerstest': ['rapportage'],
  'Onderzoeksrapport': ['rapportage'],
  'Evaluatie': ['rapportage'],
  // Service Blueprints → Service Blueprint (HTML-based)
  'Klantreis': ['service-blueprint'],
  'Dienstverleningsproces': ['service-blueprint'],
  'Systeemintegratie': ['service-blueprint'],
  // Illustraties → Illustratie (prompt-based)
  'Persoon': ['illustratie'],
  'Interactie': ['illustratie'],
  'Groepsscene': ['illustratie'],
};

/* ── Template Definitions ── */
const templatesByCategory = [
  {
    id: 'presentaties',
    label: 'Presentaties',
    templates: [
      { name: 'Algemeen', meta: 'Vrij onderwerp + eigen opbouw', skill: 'huisstijl' },
      { name: 'Voortgangsupdate', meta: 'Status + besluitpunten' },
      { name: 'Resultaten', meta: 'KPI\'s + highlights' },
    ],
  },
  {
    id: 'rapportages',
    label: 'Rapportages',
    templates: [
      { name: 'Algemeen', meta: 'Vrij onderwerp + eigen opbouw' },
      { name: 'Gebruikerstest', meta: 'Testresultaten + aanbevelingen' },
      { name: 'Onderzoeksrapport', meta: 'Methodiek + bevindingen' },
    ],
  },
  {
    id: 'infographics',
    label: 'Infographics',
    templates: [
      { name: 'Algemeen', meta: 'Vrij onderwerp + eigen opbouw' },
      { name: 'Proces', meta: 'Stappen + rollen' },
      { name: 'Statistieken', meta: 'Data in visuele blokken' },
    ],
  },
  {
    id: 'service-blueprints',
    label: 'Service Blueprints',
    templates: [
      { name: 'Algemeen', meta: 'Vrij onderwerp + eigen opbouw' },
      { name: 'Klantreis', meta: 'End-to-end journey + touchpoints' },
      { name: 'Dienstverleningsproces', meta: 'Front- & backstage activiteiten' },
    ],
  },
  {
    id: 'illustraties',
    label: 'Illustraties',
    templates: [
      { name: 'Persoon', meta: 'Enkele persoon in context' },
      { name: 'Interactie', meta: 'Twee personen, samenwerking' },
      { name: 'Groepsscene', meta: 'Groep in een setting' },
    ],
  },
];

/* ── DOM References ── */
const generateBtn = document.getElementById('generateBtn');
const templateAccordion = document.getElementById('templateAccordion');
const uploadDrop = document.getElementById('uploadDrop');
const fileInput = document.getElementById('fileInput');
const fileButton = document.getElementById('fileButton');
const pasteButton = document.getElementById('pasteButton');
const pasteBox = document.getElementById('pasteBox');
const sourceList = document.getElementById('sourceList');
const sourceEmpty = document.getElementById('sourceEmpty');
const pageTitle = document.getElementById('pageTitle');
const stepIndicator = document.getElementById('stepIndicator');
const generatingOverlay = document.getElementById('generatingOverlay');
const generatingStatus = document.getElementById('generatingStatus');
const generatingProgressBar = document.getElementById('generatingProgressBar');
const skillBadge = document.getElementById('skillBadge');

const sectionMap = {
  templates: { el: document.getElementById('sectionTemplates'), title: 'Templates' },
  bronnen: { el: document.getElementById('sectionBronnen'), title: 'Bronnen' },
  preview: { el: document.getElementById('sectionPreview'), title: 'Preview' },
  export: { el: document.getElementById('sectionExport'), title: 'Exporteren' },
};

const sources = [];
let isGenerating = false;
let hasGenerated = false;

/* ── Skill Helper Functions ── */

function getActiveSkills() {
  const templateName = getSelectedTemplate();
  const skillIds = TEMPLATE_SKILL_MAP[templateName] || [];
  return skillIds.map(function(id) { return SKILLS[id]; }).filter(Boolean);
}

function hasSkill(skillId) {
  return getActiveSkills().some(function(s) { return s.id === skillId; });
}

function usesBDRendering() {
  return getActiveSkills().some(function(s) { return s.useBDRendering; });
}

function usesInfographicRendering() {
  return getActiveSkills().some(function(s) { return s.outputType === 'infographic'; });
}

function usesIllustrationRendering() {
  return getActiveSkills().some(function(s) { return s.outputType === 'illustration'; });
}

function usesServiceBlueprintRendering() {
  return getActiveSkills().some(function(s) { return s.outputType === 'service-blueprint'; });
}

function usesRapportageRendering() {
  return getActiveSkills().some(function(s) { return s.outputType === 'rapportage'; });
}

function updateSkillBadge() {
  const skills = getActiveSkills();
  if (skills.length > 0) {
    skillBadge.textContent = skills.map(function(s) { return s.name; }).join(' + ');
    skillBadge.style.display = '';
  } else {
    skillBadge.style.display = 'none';
  }
}

/* ── Logo ── */
function getBDLogoSrc() {
  return 'logo.svg';
}

/* ── API Key Management ── */
const apiKeyDialog = document.getElementById('apiKeyDialog');
const apiKeyInput = document.getElementById('apiKeyInput');
const apiKeyBtn = document.getElementById('apiKeyBtn');
const apiKeySave = document.getElementById('apiKeySave');
const apiKeyCancel = document.getElementById('apiKeyCancel');
const apiKeyDialogClose = document.getElementById('apiKeyDialogClose');

function getApiKey() {
  return localStorage.getItem('cg_api_key') || '';
}

function setApiKey(key) {
  localStorage.setItem('cg_api_key', key);
  updateApiKeyIndicator();
}

function updateApiKeyIndicator() {
  if (getApiKey()) {
    apiKeyBtn.classList.add('has-key');
  } else {
    apiKeyBtn.classList.remove('has-key');
  }
}

function openApiKeyDialog() {
  apiKeyInput.value = getApiKey();
  apiKeyDialog.classList.add('open');
  apiKeyInput.focus();
}

function closeApiKeyDialog() {
  apiKeyDialog.classList.remove('open');
}

apiKeyBtn.addEventListener('click', openApiKeyDialog);
apiKeySave.addEventListener('click', function () {
  setApiKey(apiKeyInput.value.trim());
  closeApiKeyDialog();
});
apiKeyCancel.addEventListener('click', closeApiKeyDialog);
apiKeyDialogClose.addEventListener('click', closeApiKeyDialog);
apiKeyDialog.addEventListener('click', function (e) {
  if (e.target === apiKeyDialog) closeApiKeyDialog();
});
apiKeyInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    setApiKey(apiKeyInput.value.trim());
    closeApiKeyDialog();
  }
});

updateApiKeyIndicator();

/* ── Illustration API Key Management ── */
function getIllustrationApiKey() {
  return localStorage.getItem('cg_illustration_api_key') || '';
}

function setIllustrationApiKey(key) {
  localStorage.setItem('cg_illustration_api_key', key);
}

function toggleIllustrationMode() {
  var panel = document.getElementById('illustrationModePanel');
  var uploadSection = document.getElementById('uploadSection');
  var bronnenTitle = document.getElementById('bronnenTitle');
  var bronnenDesc = document.getElementById('bronnenDesc');
  var isIllustration = usesIllustrationRendering();

  if (panel) panel.style.display = isIllustration ? '' : 'none';
  if (uploadSection) uploadSection.style.display = isIllustration ? 'none' : '';
  if (bronnenTitle) bronnenTitle.textContent = isIllustration ? 'Illustraties' : 'Voeg bronnen toe';
  if (bronnenDesc) bronnenDesc.textContent = isIllustration
    ? 'Bekijk eerder gegenereerde illustraties of maak een nieuwe aan.'
    : 'Upload bestanden of plak tekst als bron voor je content.';

  // Render illustration history when switching to illustration mode
  if (isIllustration) {
    renderIllustrationHistory();
  }
}

// Save illustration API key on input change
var illustrationApiKeyInput = document.getElementById('illustrationApiKeyInput');
if (illustrationApiKeyInput) {
  illustrationApiKeyInput.value = getIllustrationApiKey();
  illustrationApiKeyInput.addEventListener('change', function() {
    setIllustrationApiKey(this.value.trim());
  });
  illustrationApiKeyInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      setIllustrationApiKey(this.value.trim());
      this.blur();
    }
  });
}

/* ── Navigation ── */
const stepOrder = ['templates', 'bronnen', 'preview', 'export'];
let currentStepIndex = 0;

function switchSection(sectionKey) {
  const newIndex = stepOrder.indexOf(sectionKey);
  if (newIndex === -1) return;

  document.querySelectorAll('.section').forEach(function (s) {
    s.classList.remove('active');
  });
  document.querySelectorAll('.nav-item').forEach(function (n) {
    n.classList.remove('active');
    n.classList.remove('completed');
  });

  var section = sectionMap[sectionKey];
  if (section) {
    section.el.classList.add('active');
    pageTitle.textContent = section.title;
  }

  stepOrder.forEach(function (key, i) {
    var navItem = document.querySelector('.nav-item[data-section="' + key + '"]');
    if (!navItem) return;
    if (i < newIndex) {
      navItem.classList.add('completed');
    }
  });

  var navItem = document.querySelector('.nav-item[data-section="' + sectionKey + '"]');
  if (navItem) {
    navItem.classList.add('active');
  }

  document.querySelectorAll('.stepper-step').forEach(function (step, i) {
    step.classList.remove('active', 'completed');
    if (i < newIndex) {
      step.classList.add('completed');
    } else if (i === newIndex) {
      step.classList.add('active');
    }
  });

  document.querySelectorAll('.stepper-line').forEach(function (line, i) {
    line.classList.remove('completed');
    if (i < newIndex) {
      line.classList.add('completed');
    }
  });

  if (stepIndicator) {
    stepIndicator.textContent = 'Stap ' + (newIndex + 1) + ' van 4';
  }

  currentStepIndex = newIndex;

  if (sectionKey === 'preview' && !hasGenerated && !isGenerating) {
    // Try restoring cached illustration first
    if (!restoreCachedIllustration()) {
      startGeneration();
    }
  }
}

document.querySelectorAll('.nav-item').forEach(function (item) {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    var section = this.getAttribute('data-section');
    switchSection(section);
  });
});

document.querySelectorAll('.stepper-step').forEach(function (step) {
  step.addEventListener('click', function () {
    var section = this.getAttribute('data-step');
    switchSection(section);
  });
});

document.querySelectorAll('.next-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var next = this.getAttribute('data-next');
    switchSection(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

document.querySelectorAll('.prev-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var prev = this.getAttribute('data-prev');
    switchSection(prev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ── Helpers ── */
function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '\u2014';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return (value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)) + ' ' + units[unitIndex];
}

function getFileLabel(file) {
  if (file.type.startsWith('image/')) return 'IMG';
  const extension = file.name.split('.').pop() || '';
  return extension.substring(0, 4).toUpperCase() || 'FILE';
}

/* ── Sources ── */
function renderSources() {
  sourceList.innerHTML = '';
  if (sources.length === 0) {
    sourceList.appendChild(sourceEmpty);
    return;
  }
  sources.forEach(function(source) {
    const item = document.createElement('div');
    item.className = 'source-item';

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    if (source.previewUrl) {
      const img = document.createElement('img');
      img.src = source.previewUrl;
      img.alt = source.name;
      thumb.appendChild(img);
    } else {
      thumb.textContent = source.label;
    }

    const info = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'source-title';
    title.textContent = source.name;
    const sub = document.createElement('div');
    sub.className = 'source-sub';
    sub.textContent = (source.type || 'Bestand') + ' \u00B7 ' + formatBytes(source.size);
    info.appendChild(title);
    info.appendChild(sub);

    const renameBtn = document.createElement('button');
    renameBtn.className = 'chip';
    renameBtn.type = 'button';
    renameBtn.textContent = 'Hernoem';
    renameBtn.addEventListener('click', function() {
      const newName = prompt('Nieuwe naam', source.name);
      if (newName && newName.trim()) {
        source.name = newName.trim();
        renderSources();
      }
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'chip danger';
    removeBtn.type = 'button';
    removeBtn.textContent = 'Verwijder';
    removeBtn.addEventListener('click', function() {
      if (source.previewUrl) {
        URL.revokeObjectURL(source.previewUrl);
      }
      const index = sources.findIndex(function(item) { return item.id === source.id; });
      if (index !== -1) {
        sources.splice(index, 1);
        renderSources();
        hasGenerated = false;
      }
    });

    item.appendChild(thumb);
    item.appendChild(info);
    item.appendChild(renameBtn);
    item.appendChild(removeBtn);
    sourceList.appendChild(item);
  });
}

function readFileContent(file) {
  return new Promise(function(resolve) {
    const textTypes = ['text/', 'application/json', 'application/xml', 'application/csv'];
    const textExtensions = ['.txt', '.csv', '.md', '.json', '.xml', '.html', '.htm', '.log'];
    const isText = textTypes.some(function(t) { return file.type.startsWith(t); }) ||
                   textExtensions.some(function(ext) { return file.name.toLowerCase().endsWith(ext); });

    if (isText) {
      const reader = new FileReader();
      reader.onload = function() { resolve(reader.result); };
      reader.onerror = function() { resolve(null); };
      reader.readAsText(file);
    } else {
      resolve(null);
    }
  });
}

async function addFiles(fileList) {
  for (const file of Array.from(fileList)) {
    const id = file.name + '-' + file.size + '-' + file.lastModified + '-' + Math.random().toString(16).slice(2);
    const content = await readFileContent(file);
    const source = {
      id: id,
      name: file.name,
      size: file.size,
      type: file.type ? (file.type.split('/')[1] || '').toUpperCase() : 'Bestand',
      label: getFileLabel(file),
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      content: content,
    };
    sources.unshift(source);
  }
  hasGenerated = false;
  renderSources();
}

/* ── Templates ── */
function renderTemplates() {
  templateAccordion.innerHTML = '';
  templatesByCategory.forEach(function(group, groupIndex) {
    const details = document.createElement('details');
    details.className = 'template-group';
    details.open = false;

    const summary = document.createElement('summary');
    summary.textContent = group.label;
    const summaryNote = document.createElement('span');
    summaryNote.textContent = (group.templates.length + 1) + ' templates';
    const summaryChevron = document.createElement('span');
    summaryChevron.className = 'chevron';
    summaryChevron.textContent = '\u2304';
    summary.appendChild(summaryNote);
    summary.appendChild(summaryChevron);
    details.appendChild(summary);

    const list = document.createElement('div');
    list.className = 'template-list';

    const newCard = document.createElement('button');
    newCard.className = 'template-card new';
    newCard.dataset.template = 'Maak nieuw template';
    newCard.innerHTML =
      '<div class="template-thumb template-plus">+</div>' +
      '<div class="template-label">Maak nieuw template</div>' +
      '<div class="template-meta">Start met een leeg canvas</div>';
    newCard.addEventListener('click', function() { selectTemplate(newCard); });
    list.appendChild(newCard);

    group.templates.forEach(function(template, templateIndex) {
      const button = document.createElement('button');
      button.className = 'template-card' + (groupIndex === 0 && templateIndex === 0 ? ' active' : '');
      button.dataset.template = template.name;

      // Show skill badge on template card if linked
      const skillIds = TEMPLATE_SKILL_MAP[template.name] || [];
      const skillLabel = skillIds.length > 0
        ? '<div class="template-meta" style="color:#154273;font-weight:600;">Skill: ' + skillIds.map(function(id) { return SKILLS[id] ? SKILLS[id].name : id; }).join(', ') + '</div>'
        : '';

      button.innerHTML =
        '<div class="template-thumb">Preview</div>' +
        '<div class="template-label">' + template.name + '</div>' +
        '<div class="template-meta">' + template.meta + '</div>' +
        skillLabel;
      button.addEventListener('click', function() { selectTemplate(button); });
      list.appendChild(button);
    });

    details.appendChild(list);
    templateAccordion.appendChild(details);

    details.addEventListener('toggle', function() {
      if (details.open) {
        templateAccordion.querySelectorAll('details').forEach(function(other) {
          if (other !== details) {
            other.open = false;
          }
        });
      }
      updateAccordionAnimation(details);
    });

    updateAccordionAnimation(details);
  });
}

function updateAccordionAnimation(details) {
  const list = details.querySelector('.template-list');
  if (!list) return;
  if (details.open) {
    list.classList.add('open');
    list.style.maxHeight = list.scrollHeight + 'px';
  } else {
    list.classList.remove('open');
    list.style.maxHeight = '0px';
  }
}

function selectTemplate(button) {
  document.querySelectorAll('.template-card').forEach(function(card) {
    card.classList.remove('active');
  });
  button.classList.add('active');
  hasGenerated = false;
  updateSkillBadge();
  // Reset viewer mode when switching templates
  if (usesInfographicRendering()) {
    // Will show infographic viewer when generated
  } else if (usesIllustrationRendering()) {
    // Will show illustration viewer when generated
  } else {
    showSlideViewer();
  }
  // Toggle illustration API key field visibility
  toggleIllustrationMode();
}

function getSelectedTemplate() {
  const active = document.querySelector('.template-card.active');
  return active ? active.dataset.template : 'Projectupdate';
}

/* ── Slides ── */
const slideCanvas = document.getElementById('slideCanvas');
const slideThumbs = document.getElementById('slideThumbs');
const slideCounter = document.getElementById('slideCounter');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');
const addSlideBtn = document.getElementById('addSlideBtn');
const slideTypePicker = document.getElementById('slideTypePicker');

const LOGO_SVG = '<svg viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Inter,sans-serif" font-size="12" font-weight="700" fill="#fff">Content Toolkit</text></svg>';

let slides = [];
let currentSlide = 0;

function createSlide(type, data) {
  const defaults = {
    cover: { title: 'Titel van de presentatie', date: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) },
    content: { title: 'Onderwerp', items: ['Eerste punt van bespreking', 'Tweede punt met toelichting', 'Derde belangrijk punt', 'Vierde punt of conclusie'] },
    text: { title: 'Onderwerp', paragraph1: 'Hier kunt u een uitgebreide toelichting geven op het onderwerp.', paragraph2: 'Een tweede alinea met aanvullende informatie.' },
    'quote-right': { quote: 'Hier komt een inspirerend of belangrijk citaat.', author: '\u2014 Naam Auteur, Functie' },
    'quote-left': { quote: 'Hier komt een inspirerend of belangrijk citaat.', author: '\u2014 Naam Auteur, Functie' },
  };
  return { type: type, data: data || Object.assign({}, defaults[type]), id: Date.now() + Math.random() };
}

/* ── Default Slide Rendering (no skill) ── */
function renderSlideHTML(slide, editable) {
  const ce = editable ? 'contenteditable="true"' : '';
  const d = slide.data;
  const header = '<div class="slide-header-bar"><div class="slide-logo">' + LOGO_SVG + '</div></div>';

  switch (slide.type) {
    case 'cover':
      return '<div class="slide-frame slide-cover">' +
        '<div class="slide-cover-vlak"></div>' +
        '<div class="slide-cover-logo"><img src="logo.svg" alt="Logo"></div>' +
        '<div class="slide-cover-textblock">' +
          '<div class="slide-cover-title" ' + ce + ' data-field="title">' + d.title + '</div>' +
          '<div class="slide-cover-date" ' + ce + ' data-field="date">' + d.date + '</div>' +
        '</div></div>';
    case 'content':
      var items = (d.items || []).map(function(item, i) { return '<li ' + ce + ' data-field="items" data-index="' + i + '">' + item + '</li>'; }).join('');
      return '<div class="slide-frame slide-content-slide">' + header +
        '<div class="slide-content-body"><div class="slide-content-left"><div class="slide-content-title" ' + ce + ' data-field="title">' + d.title + '</div><ul class="slide-content-list">' + items + '</ul></div>' +
        '<div class="slide-content-right">' +
          '<div class="bd-illustration-placeholder" data-context="' + (d.title || '').replace(/"/g, '&quot;') + '">' +
            '<div class="placeholder-icon"><svg width="24" height="24" fill="none" stroke="#154273" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>' +
            '<span class="placeholder-label">Klik om afbeelding<br>te genereren</span>' +
          '</div>' +
        '</div></div></div>';
    case 'text':
      return '<div class="slide-frame slide-text-slide">' + header + '<div class="slide-text-body"><div class="slide-text-title" ' + ce + ' data-field="title">' + d.title + '</div><div class="slide-text-paragraph" ' + ce + ' data-field="paragraph1">' + d.paragraph1 + '</div><div class="slide-text-paragraph" ' + ce + ' data-field="paragraph2">' + d.paragraph2 + '</div></div></div>';
    case 'quote-right':
      return '<div class="slide-frame slide-quote-slide">' + header +
        '<div class="slide-quote-body">' +
          '<div class="slide-quote-image">' +
            '<div class="bd-illustration-placeholder" data-context="' + (d.quote || '').replace(/"/g, '&quot;') + '">' +
              '<div class="placeholder-icon"><svg width="24" height="24" fill="none" stroke="#154273" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>' +
              '<span class="placeholder-label">Klik om afbeelding<br>te genereren</span>' +
            '</div>' +
          '</div>' +
          '<div class="slide-quote-content"><div class="slide-quote-mark">\u201C</div><div class="slide-quote-text" ' + ce + ' data-field="quote">' + d.quote + '</div><div class="slide-quote-author" ' + ce + ' data-field="author">' + d.author + '</div></div>' +
        '</div></div>';
    case 'quote-left':
      return '<div class="slide-frame slide-quote-slide">' + header +
        '<div class="slide-quote-body">' +
          '<div class="slide-quote-content"><div class="slide-quote-mark">\u201C</div><div class="slide-quote-text" ' + ce + ' data-field="quote">' + d.quote + '</div><div class="slide-quote-author" ' + ce + ' data-field="author">' + d.author + '</div></div>' +
          '<div class="slide-quote-image">' +
            '<div class="bd-illustration-placeholder" data-context="' + (d.quote || '').replace(/"/g, '&quot;') + '">' +
              '<div class="placeholder-icon"><svg width="24" height="24" fill="none" stroke="#154273" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>' +
              '<span class="placeholder-label">Klik om afbeelding<br>te genereren</span>' +
            '</div>' +
          '</div>' +
        '</div></div>';
    default:
      return '';
  }
}

/* ── Huisstijl Slide Rendering (skill-based) ── */
function renderBDSlideHTML(slide, editable) {
  const ce = editable ? 'contenteditable="true"' : '';
  const d = slide.data;
  const logoSrc = getBDLogoSrc();
  const logo = '<div class="bd-logo"><img src="' + logoSrc + '" alt="Logo"></div>';

  switch (slide.type) {
    case 'cover':
      return '<div class="slide-frame slide-cover">' +
        '<div class="slide-cover-vlak"></div>' +
        '<div class="slide-cover-logo"><img src="' + logoSrc + '" alt="Logo"></div>' +
        '<div class="slide-cover-textblock">' +
          '<div class="slide-cover-title" ' + ce + ' data-field="title">' + d.title + '</div>' +
          '<div class="slide-cover-date" ' + ce + ' data-field="date">' + (d.date || '') + '</div>' +
        '</div></div>';
    case 'content':
      return '<div class="slide-frame bd-content-slide">' + logo +
        '<div class="bd-right-block">' +
          '<div class="bd-illustration-placeholder" data-context="' + (d.title || '').replace(/"/g, '&quot;') + '">' +
            '<div class="placeholder-icon"><svg width="24" height="24" fill="none" stroke="#154273" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>' +
            '<span class="placeholder-label">Klik om afbeelding<br>te genereren</span>' +
          '</div>' +
        '</div>' +
        '<div class="bd-left-area">' +
          '<div class="bd-section-label" ' + ce + ' data-field="section">' + (d.section || '') + '</div>' +
          '<h2 class="bd-slide-title" ' + ce + ' data-field="title">' + d.title + '</h2>' +
          '<div class="bd-slide-body" ' + ce + ' data-field="body">' + (d.body || (d.items || []).join('. ')) + '</div>' +
        '</div>' +
        '</div>';
    case 'text':
      return '<div class="slide-frame bd-text-slide">' + logo +
        '<div class="bd-text-area">' +
          '<div class="bd-section-label" ' + ce + ' data-field="section">' + (d.section || '') + '</div>' +
          '<h2 class="bd-slide-title" ' + ce + ' data-field="title">' + d.title + '</h2>' +
          '<div class="bd-slide-body" ' + ce + ' data-field="paragraph1">' + d.paragraph1 + '</div>' +
          '<div class="bd-slide-body" ' + ce + ' data-field="paragraph2">' + d.paragraph2 + '</div>' +
        '</div></div>';
    case 'quote-right':
      return '<div class="slide-frame bd-quote-right">' + logo +
        '<div class="bd-section-label bd-section-abs" ' + ce + ' data-field="section">' + (d.section || '') + '</div>' +
        '<div class="bd-blue-block-l"></div>' +
        '<h2 class="bd-quote-title" ' + ce + ' data-field="title">' + (d.title || d.quote) + '</h2>' +
        '<div class="bd-quote-area">' +
          '<div class="bd-quote-text" ' + ce + ' data-field="quote">' + d.quote + '</div>' +
          '<div class="bd-quote-source" ' + ce + ' data-field="author">' + d.author + '</div>' +
        '</div>' +
        '<div class="bd-photo-right">' +
          '<div class="bd-illustration-placeholder" data-context="' + (d.title || d.quote || '').replace(/"/g, '&quot;') + '">' +
            '<div class="placeholder-icon"><svg width="24" height="24" fill="none" stroke="#154273" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>' +
            '<span class="placeholder-label">Klik om afbeelding<br>te genereren</span>' +
          '</div>' +
        '</div>' +
        '</div>';
    case 'quote-left':
      return '<div class="slide-frame bd-quote-left">' + logo +
        '<div class="bd-photo-left">' +
          '<div class="bd-illustration-placeholder" data-context="' + (d.title || d.quote || '').replace(/"/g, '&quot;') + '">' +
            '<div class="placeholder-icon"><svg width="24" height="24" fill="none" stroke="#154273" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>' +
            '<span class="placeholder-label">Klik om afbeelding<br>te genereren</span>' +
          '</div>' +
        '</div>' +
        '<div class="bd-right-block"></div>' +
        '<div class="bd-ql-text-area">' +
          '<h2 class="bd-slide-title" ' + ce + ' data-field="title">' + (d.title || d.quote) + '</h2>' +
          '<div class="bd-slide-subtitle" ' + ce + ' data-field="subtitle">' + (d.subtitle || d.quote) + '</div>' +
          '<div class="bd-quote-source" ' + ce + ' data-field="author">' + d.author + '</div>' +
        '</div>' +
        '</div>';
    default:
      return '';
  }
}

/* ── Slide Rendering (dispatches to skill or default) ── */
function renderSlide(slide, editable) {
  if (usesBDRendering()) {
    return renderBDSlideHTML(slide, editable);
  }
  return renderSlideHTML(slide, editable);
}

function renderCurrentSlide() {
  if (slides.length === 0) return;
  const slide = slides[currentSlide];
  slideCanvas.innerHTML = renderSlide(slide, true);
  slideCounter.textContent = 'Slide ' + (currentSlide + 1) + ' van ' + slides.length;

  slideCanvas.querySelectorAll('[contenteditable]').forEach(function(el) {
    el.addEventListener('blur', function() {
      const field = el.getAttribute('data-field');
      const index = el.getAttribute('data-index');
      if (field === 'items' && index !== null) {
        slide.data.items[parseInt(index)] = el.textContent;
      } else {
        slide.data[field] = el.innerHTML;
      }
      renderThumbs();
    });
  });

  // Restore saved placeholder images, then initialize click handlers
  restorePlaceholderImages(slideCanvas, slide);
  initPlaceholderClickHandlers(slideCanvas);
}

function renderThumbs() {
  slideThumbs.innerHTML = '';
  slides.forEach(function(slide, i) {
    const thumb = document.createElement('div');
    thumb.className = 'slide-thumb' + (i === currentSlide ? ' active' : '');

    const num = document.createElement('span');
    num.className = 'slide-thumb-number';
    num.textContent = i + 1;
    thumb.appendChild(num);

    if (i > 0) {
      const del = document.createElement('button');
      del.className = 'slide-thumb-delete';
      del.type = 'button';
      del.textContent = '\u00D7';
      del.addEventListener('click', function(e) {
        e.stopPropagation();
        slides.splice(i, 1);
        if (currentSlide >= slides.length) currentSlide = slides.length - 1;
        renderCurrentSlide();
        renderThumbs();
      });
      thumb.appendChild(del);
    }

    const inner = document.createElement('div');
    inner.className = 'slide-thumb-inner';
    inner.innerHTML = renderSlide(slide, false);
    const scale = 0.18;
    inner.style.transform = 'scale(' + scale + ')';
    inner.style.width = (1 / scale * 100) + '%';
    inner.style.height = (1 / scale * 100) + '%';
    thumb.appendChild(inner);

    thumb.addEventListener('click', function() {
      currentSlide = i;
      renderCurrentSlide();
      renderThumbs();
    });

    slideThumbs.appendChild(thumb);
  });
}

function initSlides() {
  slides = [createSlide('cover'), createSlide('content'), createSlide('text')];
  currentSlide = 0;
  renderCurrentSlide();
  renderThumbs();
}

prevSlideBtn.addEventListener('click', function() {
  if (currentSlide > 0) {
    currentSlide--;
    renderCurrentSlide();
    renderThumbs();
  }
});

nextSlideBtn.addEventListener('click', function() {
  if (currentSlide < slides.length - 1) {
    currentSlide++;
    renderCurrentSlide();
    renderThumbs();
  }
});

addSlideBtn.addEventListener('click', function() {
  slideTypePicker.classList.toggle('open');
});

document.querySelectorAll('.slide-type-option').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const type = btn.getAttribute('data-type');
    slides.push(createSlide(type));
    currentSlide = slides.length - 1;
    renderCurrentSlide();
    renderThumbs();
    slideTypePicker.classList.remove('open');
  });
});

/* ── Generation via Claude API ── */
function getSourcesText() {
  var text = '';
  sources.forEach(function(source, i) {
    text += '\n--- Bron ' + (i + 1) + ': ' + source.name + ' ---\n';
    if (source.content) {
      var trimmed = source.content.length > 8000
        ? source.content.substring(0, 8000) + '\n[... ingekort ...]'
        : source.content;
      text += trimmed + '\n';
    } else {
      text += '(Bestandstype: ' + source.type + ', ' + formatBytes(source.size) + ' - inhoud niet leesbaar als tekst)\n';
    }
  });
  return text;
}

function buildPrompt() {
  const templateName = getSelectedTemplate();
  const sourcesText = getSourcesText();
  const userPrompt = document.querySelector('.prompt-row .input').value.trim();
  const activeSkills = getActiveSkills();

  // Build system prompt from skills
  var system;
  if (activeSkills.length > 0) {
    // Combine skill system prompts
    system = activeSkills.map(function(skill) { return skill.system; }).join('\n\n---\n\n');
  } else {
    // Default system prompt (no skill)
    system = 'Je bent een presentatie-generator. Je maakt professionele slide-presentaties op basis van bronmateriaal.\n\n' +
      'Je MOET antwoorden met ALLEEN valid JSON, geen markdown, geen uitleg, geen tekst ervoor of erna.\n\n' +
      'Het JSON-formaat is:\n{\n  "slides": [\n    {\n      "type": "cover",\n      "data": { "title": "...", "date": "..." }\n    },\n' +
      '    {\n      "type": "content",\n      "data": { "title": "...", "items": ["...", "...", "...", "..."] }\n    },\n' +
      '    {\n      "type": "text",\n      "data": { "title": "...", "paragraph1": "...", "paragraph2": "..." }\n    },\n' +
      '    {\n      "type": "quote-right",\n      "data": { "quote": "...", "author": "\u2014 Naam, Functie" }\n    }\n  ]\n}\n\n' +
      'Beschikbare slide types: cover, content, text, quote-right, quote-left\n' +
      '- De eerste slide MOET type "cover" zijn\n' +
      '- Genereer 5-8 slides\n' +
      '- content slides hebben 3-5 items\n' +
      '- Schrijf in het Nederlands\n' +
      '- Maak de content professioneel en zakelijk\n' +
      '- Gebruik de bronnen als basis voor de inhoud';
  }

  var userMessage = 'Template type: ' + templateName + '\n';
  if (activeSkills.length > 0) {
    userMessage += 'Actieve skill(s): ' + activeSkills.map(function(s) { return s.name; }).join(', ') + '\n';
  }
  if (userPrompt) {
    userMessage += '\nAanvullende instructie: ' + userPrompt + '\n';
  }

  // For illustrations: use the description textarea instead of sources
  if (usesIllustrationRendering()) {
    var illustrationDesc = document.getElementById('illustrationDescription');
    var description = illustrationDesc ? illustrationDesc.value.trim() : '';
    if (description) {
      userMessage += '\nBeschrijving van de gewenste illustratie:\n' + description + '\n';
    } else {
      userMessage += '\nEr is geen beschrijving opgegeven. Genereer een voorbeeld-illustratie prompt passend bij het template type "' + templateName + '".';
    }
  } else if (sources.length > 0) {
    userMessage += '\nBronmateriaal:\n' + sourcesText;
  } else {
    if (usesRapportageRendering()) {
      userMessage += '\nEr zijn geen bronnen toegevoegd. Genereer een voorbeeld-rapportage met realistische placeholder-data passend bij het template type "' + templateName + '".';
    } else if (usesInfographicRendering()) {
      userMessage += '\nEr zijn geen bronnen toegevoegd. Genereer een voorbeeld-infographic met fictieve maar realistische placeholder-data passend bij het template type "' + templateName + '".';
    } else if (usesServiceBlueprintRendering()) {
      userMessage += '\nEr zijn geen bronnen toegevoegd. Genereer een voorbeeld-service blueprint met realistische placeholder-data passend bij het template type "' + templateName + '".';
    } else {
      userMessage += '\nEr zijn geen bronnen toegevoegd. Genereer een voorbeeld-presentatie passend bij het template type.';
    }
  }
  if (usesIllustrationRendering()) {
    userMessage += '\n\nBELANGRIJK: Baseer de scene-beschrijving op de bovenstaande beschrijving van de gebruiker. Gebruik de context en informatie uit de beschrijving om een passende illustratie-scene te bedenken.';
    userMessage += '\n\nGenereer nu het complete nano banana prompt in het Engels. Gebruik de template structuur uit je system prompt. Geef ALLEEN het prompt, geen uitleg of markdown.';
  } else if (usesRapportageRendering()) {
    userMessage += '\n\nBELANGRIJK: Baseer de rapportage VOLLEDIG op het bovenstaande bronmateriaal. Gebruik de informatie uit de bronnen voor inhoud, feiten en conclusies. Als er geen bronnen zijn, maak dan een realistisch voorbeeld passend bij het template type.';
    userMessage += '\n\nGenereer nu de rapportage als valid JSON volgens het formaat in je system prompt. Geef ALLEEN het JSON-object, geen markdown, geen uitleg, geen tekst ervoor of erna.';
  } else if (usesServiceBlueprintRendering()) {
    userMessage += '\n\nBELANGRIJK: Baseer de service blueprint VOLLEDIG op het bovenstaande bronmateriaal. Gebruik de informatie uit de bronnen om fases, swim lanes en kaarten te vullen. Als er geen bronnen zijn, maak dan een realistisch voorbeeld passend bij een overheidsproces.';
    userMessage += '\n\nGenereer nu de service blueprint als een volledige interactieve standalone HTML-pagina met drag-and-drop, contenteditable, experience curve en import/export functionaliteit.';
  } else if (usesInfographicRendering()) {
    userMessage += '\n\nBELANGRIJK: Baseer de infographic VOLLEDIG op het bovenstaande bronmateriaal. Gebruik ALLEEN feiten, cijfers en informatie uit de bronnen. Verzin NIETS zelf. Als er geen bronnen zijn, maak dan een voorbeeld met duidelijk fictieve placeholder-data.';
    userMessage += '\n\nGenereer nu de infographic als een volledige standalone HTML-pagina.';
  } else {
    userMessage += '\n\nGenereer nu de presentatie als JSON.';
  }

  return { system: system, userMessage: userMessage };
}

async function callClaudeAPI(system, userMessage) {
  const apiKey = getApiKey();
  const proxyUrl = 'proxy.php';
  const isLargeRequest = usesInfographicRendering() || usesServiceBlueprintRendering() || usesRapportageRendering();
  const timeoutMs = isLargeRequest ? 310000 : 130000;
  const controller = new AbortController();
  const timeoutId = setTimeout(function() { controller.abort(); }, timeoutMs);

  var response;
  try {
    response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        api_key: apiKey,
        system: system,
        messages: [{ role: 'user', content: userMessage }],
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: isLargeRequest ? 16000 : (usesIllustrationRendering() ? 4096 : 4096),
      }),
    });
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') throw new Error('Generatie duurde te lang (timeout na ' + Math.round(timeoutMs / 1000) + 's). Probeer het opnieuw.');
    throw e;
  }
  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorData = await response.json().catch(function() { return {}; });
    if (response.status === 401) {
      throw new Error('Ongeldige API key. Controleer je key via het sleutel-icoon rechtsboven.');
    }
    throw new Error((errorData.error && errorData.error.message) || errorData.error || 'API fout (' + response.status + ')');
  }

  const data = await response.json();
  const textBlock = data.content && data.content.find(function(b) { return b.type === 'text'; });
  if (!textBlock) {
    throw new Error('Geen tekst ontvangen van de API.');
  }

  return textBlock.text;
}

function parseSlideJSON(text) {
  var jsonStr = text.trim();
  var jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }
  var parsed = JSON.parse(jsonStr);
  if (!parsed.slides || !Array.isArray(parsed.slides)) {
    throw new Error('Ongeldig response formaat: geen slides array gevonden.');
  }
  return parsed.slides;
}

function showOverlay(show) {
  if (show) {
    generatingOverlay.classList.add('active');
  } else {
    generatingOverlay.classList.remove('active');
  }
}

function updateProgress(percent, status) {
  generatingProgressBar.style.width = percent + '%';
  if (status) generatingStatus.textContent = status;
}

function showOverlayError(message) {
  var existing = generatingOverlay.querySelector('.generating-error');
  if (existing) existing.remove();

  var spinner = generatingOverlay.querySelector('.generating-spinner');
  if (spinner) spinner.style.display = 'none';

  generatingOverlay.querySelector('.generating-title').textContent = 'Genereren mislukt';

  var errorEl = document.createElement('div');
  errorEl.className = 'generating-error';
  errorEl.textContent = message;

  var retryBtn = document.createElement('button');
  retryBtn.className = 'btn primary';
  retryBtn.textContent = 'Opnieuw proberen';
  retryBtn.style.marginTop = '12px';
  retryBtn.addEventListener('click', function() {
    startGeneration();
  });

  var content = generatingOverlay.querySelector('.generating-content');
  content.appendChild(errorEl);
  content.appendChild(retryBtn);
}

function resetOverlay() {
  var spinner = generatingOverlay.querySelector('.generating-spinner');
  if (spinner) spinner.style.display = '';
  var label = usesIllustrationRendering() ? 'Illustratie' : (usesRapportageRendering() ? 'Rapportage' : (usesServiceBlueprintRendering() ? 'Service Blueprint' : (usesInfographicRendering() ? 'Infographic' : 'Presentatie')));
  generatingOverlay.querySelector('.generating-title').textContent = label + ' genereren...';
  var existing = generatingOverlay.querySelector('.generating-error');
  if (existing) existing.remove();
  var retryBtn = generatingOverlay.querySelector('.btn.primary');
  if (retryBtn && retryBtn.textContent === 'Opnieuw proberen') retryBtn.remove();
  updateProgress(0, 'Bronnen analyseren');
}

/* ── Infographic Preview Rendering ── */
var infographicHTML = '';

function renderInfographicPreview(html) {
  infographicHTML = html;
  var slideViewer = document.getElementById('slideViewer');
  var infographicViewer = document.getElementById('infographicViewer');

  var isBlueprint = usesServiceBlueprintRendering();

  // Update badge text based on active skill
  var badge = infographicViewer && infographicViewer.querySelector('.infographic-badge');
  if (badge) {
    badge.textContent = isBlueprint ? 'Service Blueprint' : (usesRapportageRendering() ? 'Rapportage Preview' : 'Infographic Preview');
  }

  // Add/remove close button for blueprint fullscreen
  var existingClose = infographicViewer && infographicViewer.querySelector('.blueprint-close-btn');
  if (isBlueprint && infographicViewer && !existingClose) {
    var closeBtn = document.createElement('button');
    closeBtn.className = 'blueprint-close-btn';
    closeBtn.innerHTML = '&times; Sluiten';
    closeBtn.style.cssText = 'margin-left:auto;background:#154273;color:#fff;border:none;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;';
    closeBtn.onclick = function() {
      infographicViewer.classList.remove('blueprint-fullscreen');
      // Re-enable scrolling on body
      document.body.style.overflow = '';
      // Restore iframe height
      var iframe = infographicViewer.querySelector('iframe');
      if (iframe) {
        try {
          iframe.style.height = Math.max(iframe.contentDocument.body.scrollHeight, 400) + 'px';
        } catch(e) { iframe.style.height = '800px'; }
      }
    };
    var header = infographicViewer.querySelector('.infographic-header');
    if (header) header.appendChild(closeBtn);
  } else if (!isBlueprint && existingClose) {
    existingClose.remove();
  }

  // Toggle fullscreen class for blueprints
  if (infographicViewer) {
    if (isBlueprint) {
      infographicViewer.classList.add('blueprint-fullscreen');
      document.body.style.overflow = 'hidden';
    } else {
      infographicViewer.classList.remove('blueprint-fullscreen');
      document.body.style.overflow = '';
    }
  }

  // Hide slide viewer, show infographic viewer
  if (slideViewer) slideViewer.style.display = 'none';
  if (infographicViewer) {
    infographicViewer.style.display = '';
    var iframe = infographicViewer.querySelector('iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.className = 'infographic-iframe';
      iframe.sandbox = 'allow-same-origin allow-scripts';
      infographicViewer.querySelector('.infographic-frame').appendChild(iframe);
    }
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    // Inject <base> tag zodat relatieve URLs (logo SVG etc.) correct laden
    var baseTag = '<base href="' + window.location.href.replace(/[^\/]*$/, '') + '">';
    var htmlWithBase = html.replace(/<head>/i, '<head>' + baseTag);
    // Als er geen <head> is, voeg base toe aan begin
    if (htmlWithBase === html && html.indexOf('<base') === -1) {
      htmlWithBase = html.replace(/(<html[^>]*>)/i, '$1<head>' + baseTag + '</head>');
    }
    doc.open();
    doc.write(htmlWithBase);
    doc.close();

    if (isBlueprint) {
      // Blueprint: iframe fills container, no fixed height
      iframe.style.height = '100%';
    } else {
      // Infographic: auto-resize iframe to content height
      iframe.onload = function() {
        try {
          var h = iframe.contentDocument.body.scrollHeight;
          iframe.style.height = Math.max(h, 400) + 'px';
        } catch(e) {
          iframe.style.height = '800px';
        }
      };
    }
    // Trigger height calculation after write + init placeholder handlers
    setTimeout(function() {
      try {
        if (!isBlueprint) {
          var h = iframe.contentDocument.body.scrollHeight;
          iframe.style.height = Math.max(h, 400) + 'px';
        }
        // Init click handlers for illustration placeholders in infographic
        initInfographicPlaceholderHandlers(iframe.contentDocument);
      } catch(e) {
        if (!isBlueprint) iframe.style.height = '800px';
      }
    }, 300);
  }
}

function showSlideViewer() {
  var slideViewer = document.getElementById('slideViewer');
  var infographicViewer = document.getElementById('infographicViewer');
  var illustrationViewer = document.getElementById('illustrationViewer');
  if (slideViewer) slideViewer.style.display = '';
  if (infographicViewer) {
    infographicViewer.style.display = 'none';
    infographicViewer.classList.remove('blueprint-fullscreen');
  }
  if (illustrationViewer) illustrationViewer.style.display = 'none';
  document.body.style.overflow = '';
}

/* ── Illustration Cache (localStorage) ── */
function saveIllustrationCache(templateName, imageData, mimeType, promptText) {
  try {
    var entry = {
      templateName: templateName,
      imageData: imageData,
      mimeType: mimeType,
      promptText: promptText,
      timestamp: Date.now()
    };
    localStorage.setItem('cg_illustration_' + templateName, JSON.stringify(entry));
  } catch (e) {
    // localStorage full — try clearing old illustrations first
    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf('cg_illustration_') === 0 && k !== 'cg_illustration_api_key') {
          keys.push(k);
        }
      }
      // Remove all cached illustrations except current
      keys.forEach(function(k) { localStorage.removeItem(k); });
      // Try again
      localStorage.setItem('cg_illustration_' + templateName, JSON.stringify(entry));
    } catch (e2) {
      console.warn('Kan illustratie niet cachen:', e2);
    }
  }
}

function loadIllustrationCache(templateName) {
  try {
    var data = localStorage.getItem('cg_illustration_' + templateName);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

function getAllCachedIllustrations() {
  var results = [];
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf('cg_illustration_') === 0 && k !== 'cg_illustration_api_key') {
        var data = JSON.parse(localStorage.getItem(k));
        if (data && data.imageData) {
          results.push(data);
        }
      }
    }
    // Sort by timestamp, newest first
    results.sort(function(a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });
  } catch (e) {
    // ignore
  }
  return results;
}

/* ── Placeholder Image Storage (per slide, in-memory) ── */

function savePlaceholderImage(slideId, phIndex, imageData, mimeType, promptText, transform) {
  var slide = slides.find(function(s) { return s.id === slideId; });
  if (!slide) return;
  if (!slide.placeholderImages) slide.placeholderImages = {};
  var existing = slide.placeholderImages[phIndex] || {};
  slide.placeholderImages[phIndex] = {
    imageData: imageData,
    mimeType: mimeType,
    promptText: promptText,
    timestamp: Date.now(),
    transform: transform || existing.transform || { scale: 1, translateX: 0, translateY: 0 }
  };
}

function savePlaceholderTransform(slideId, phIndex, transform) {
  var slide = slides.find(function(s) { return s.id === slideId; });
  if (!slide || !slide.placeholderImages || !slide.placeholderImages[phIndex]) return;
  slide.placeholderImages[phIndex].transform = transform;
}

function getPlaceholderImage(slideId, phIndex) {
  var slide = slides.find(function(s) { return s.id === slideId; });
  if (!slide || !slide.placeholderImages) return null;
  return slide.placeholderImages[phIndex] || null;
}

/* ── Illustratie Gallerij (localStorage, persistent) ── */
var GALLERY_PREFIX = 'cg_gallery_';
var GALLERY_MAX = 30; // max images to keep

function saveToGallery(imageData, mimeType, promptText) {
  try {
    var id = Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    var entry = {
      id: id,
      imageData: imageData,
      mimeType: mimeType,
      promptText: promptText || '',
      timestamp: Date.now()
    };
    // Check for duplicates (first 80 chars of imageData)
    var hash = imageData.substring(0, 80);
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(GALLERY_PREFIX) === 0) {
        try {
          var existing = JSON.parse(localStorage.getItem(k));
          if (existing && existing.imageData && existing.imageData.substring(0, 80) === hash) {
            // Update timestamp of existing entry instead of adding duplicate
            existing.timestamp = Date.now();
            localStorage.setItem(k, JSON.stringify(existing));
            return;
          }
        } catch (e) { /* skip corrupt entries */ }
      }
    }
    localStorage.setItem(GALLERY_PREFIX + id, JSON.stringify(entry));
    cleanupGallery();
  } catch (e) {
    // localStorage full — clear oldest gallery items and retry
    try {
      pruneGallery(10);
      var id2 = Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      localStorage.setItem(GALLERY_PREFIX + id2, JSON.stringify({
        id: id2, imageData: imageData, mimeType: mimeType,
        promptText: promptText || '', timestamp: Date.now()
      }));
    } catch (e2) {
      console.warn('Kan illustratie niet opslaan in gallerij:', e2);
    }
  }
}

function getAllGalleryImages() {
  var images = [];
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(GALLERY_PREFIX) === 0) {
        var data = JSON.parse(localStorage.getItem(k));
        if (data && data.imageData) {
          images.push(data);
        }
      }
    }
  } catch (e) { /* ignore */ }
  images.sort(function(a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });
  return images;
}

function cleanupGallery() {
  var items = getAllGalleryImages();
  if (items.length > GALLERY_MAX) {
    // Remove oldest entries beyond the max
    var toRemove = items.slice(GALLERY_MAX);
    toRemove.forEach(function(item) {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(GALLERY_PREFIX) === 0) {
          try {
            var d = JSON.parse(localStorage.getItem(k));
            if (d && d.id === item.id) {
              localStorage.removeItem(k);
              break;
            }
          } catch (e) { /* skip */ }
        }
      }
    });
  }
}

function pruneGallery(removeCount) {
  var items = getAllGalleryImages();
  var toRemove = items.slice(-removeCount);
  toRemove.forEach(function(item) {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(GALLERY_PREFIX) === 0) {
        try {
          var d = JSON.parse(localStorage.getItem(k));
          if (d && d.id === item.id) {
            localStorage.removeItem(k);
            break;
          }
        } catch (e) { /* skip */ }
      }
    }
  });
}

function deleteFromGallery(galleryId) {
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k && k.indexOf(GALLERY_PREFIX) === 0) {
      try {
        var d = JSON.parse(localStorage.getItem(k));
        if (d && d.id === galleryId) {
          localStorage.removeItem(k);
          return true;
        }
      } catch (e) { /* skip */ }
    }
  }
  return false;
}

function getAllAvailableImages() {
  var images = [];
  var seen = {};

  // 1. Gallery images (localStorage, persistent)
  var gallery = getAllGalleryImages();
  gallery.forEach(function(g) {
    var hash = g.imageData.substring(0, 80);
    if (!seen[hash]) {
      seen[hash] = true;
      images.push({
        imageData: g.imageData,
        mimeType: g.mimeType,
        promptText: g.promptText || '',
        timestamp: g.timestamp || 0,
        galleryId: g.id || null,
        source: 'gallery'
      });
    }
  });

  // 2. Illustration cache (localStorage, main illustration feature)
  var cached = getAllCachedIllustrations();
  cached.forEach(function(c) {
    var hash = c.imageData.substring(0, 80);
    if (!seen[hash]) {
      seen[hash] = true;
      images.push({
        imageData: c.imageData,
        mimeType: c.mimeType,
        promptText: c.promptText || c.templateName || '',
        timestamp: c.timestamp || 0,
        galleryId: null,
        source: 'cache'
      });
    }
  });

  // 3. In-memory slide placeholder images (current session)
  slides.forEach(function(slide) {
    if (!slide.placeholderImages) return;
    Object.keys(slide.placeholderImages).forEach(function(key) {
      var img = slide.placeholderImages[key];
      if (img && img.imageData) {
        var hash = img.imageData.substring(0, 80);
        if (!seen[hash]) {
          seen[hash] = true;
          images.push({
            imageData: img.imageData,
            mimeType: img.mimeType,
            promptText: img.promptText || '',
            timestamp: img.timestamp || 0,
            galleryId: null,
            source: 'slide'
          });
        }
      }
    });
  });

  images.sort(function(a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });
  return images;
}

function restorePlaceholderImages(container, slide) {
  if (!slide || !slide.placeholderImages) return;
  var placeholders = container.querySelectorAll('.bd-illustration-placeholder');
  placeholders.forEach(function(placeholder, index) {
    var saved = slide.placeholderImages[index];
    if (saved && saved.imageData) {
      applyImageToPlaceholder(placeholder, saved.imageData, saved.mimeType, saved.promptText, saved.transform);
    }
  });
}

function applyImageToPlaceholder(placeholder, imageData, mimeType, promptText, transform) {
  var t = transform || { scale: 1, translateX: 0, translateY: 0 };

  var img = document.createElement('img');
  img.className = 'placeholder-generated';
  img.src = 'data:' + mimeType + ';base64,' + imageData;
  img.alt = promptText || '';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.style.transformOrigin = 'center center';
  img.style.transform = 'scale(' + t.scale + ') translate(' + t.translateX + 'px, ' + t.translateY + 'px)';
  img.draggable = false;

  placeholder.innerHTML = '';
  placeholder.style.overflow = 'hidden';
  placeholder.appendChild(img);

  // Add hover overlay for editing
  var overlay = document.createElement('div');
  overlay.className = 'placeholder-edit-overlay';
  overlay.innerHTML = '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Wijzig afbeelding';
  placeholder.appendChild(overlay);

  // Add resize handle
  var handle = document.createElement('div');
  handle.className = 'placeholder-resize-handle';
  handle.title = 'Sleep om te schalen';
  placeholder.appendChild(handle);

  placeholder.style.cursor = 'pointer';
  placeholder.style.border = 'none';
  placeholder.style.opacity = '1';
  placeholder.style.background = 'transparent';

  // Init pan/zoom interactions
  initImagePanZoom(placeholder, t);
}

function initImagePanZoom(placeholder, initialTransform) {
  var t = { scale: initialTransform.scale || 1, translateX: initialTransform.translateX || 0, translateY: initialTransform.translateY || 0 };
  var img = placeholder.querySelector('img.placeholder-generated');
  var handle = placeholder.querySelector('.placeholder-resize-handle');
  if (!img) return;

  function applyTransform() {
    img.style.transform = 'scale(' + t.scale + ') translate(' + t.translateX + 'px, ' + t.translateY + 'px)';
  }

  function saveTransform() {
    var slideId = parseFloat(placeholder.dataset.slideId);
    var phIndex = parseInt(placeholder.dataset.phIndex || '0');
    if (slideId) {
      savePlaceholderTransform(slideId, phIndex, { scale: t.scale, translateX: t.translateX, translateY: t.translateY });
    }
  }

  // Corner resize handle — drag to scale
  if (handle) {
    var isResizing = false;
    var startY = 0;
    var startScale = 1;

    handle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      e.stopPropagation();
      isResizing = true;
      startY = e.clientY;
      startScale = t.scale;
      placeholder.classList.add('resizing');

      function onMouseMove(e2) {
        if (!isResizing) return;
        var delta = (e2.clientY - startY) * 0.01;
        t.scale = Math.max(0.3, Math.min(4, startScale + delta));
        applyTransform();
      }

      function onMouseUp() {
        isResizing = false;
        placeholder.classList.remove('resizing');
        _placeholderInteracting = true;
        saveTransform();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  // Mouse wheel to zoom
  placeholder.addEventListener('wheel', function(e) {
    // Only zoom if image exists
    if (!placeholder.querySelector('img.placeholder-generated')) return;
    e.preventDefault();
    e.stopPropagation();
    var zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
    t.scale = Math.max(0.3, Math.min(4, t.scale + zoomDelta));
    applyTransform();
    saveTransform();
  }, { passive: false });

  // Drag to pan (on the image itself, not the overlay/handle)
  var isPanning = false;
  var panStartX = 0;
  var panStartY = 0;
  var panStartTX = 0;
  var panStartTY = 0;

  img.addEventListener('mousedown', function(e) {
    // Only pan if already placed (has img)
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panStartTX = t.translateX;
    panStartTY = t.translateY;
    placeholder.classList.add('panning');

    function onMouseMove(e2) {
      if (!isPanning) return;
      // Divide by scale so panning feels natural at any zoom level
      t.translateX = panStartTX + (e2.clientX - panStartX) / t.scale;
      t.translateY = panStartTY + (e2.clientY - panStartY) / t.scale;
      applyTransform();
    }

    function onMouseUp() {
      isPanning = false;
      placeholder.classList.remove('panning');
      _placeholderInteracting = true;
      saveTransform();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

function renderIllustrationHistory() {
  var container = document.getElementById('illustrationHistory');
  var grid = document.getElementById('illustrationHistoryGrid');
  if (!container || !grid) return;

  var allImages = getAllAvailableImages();
  if (allImages.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = '';
  grid.innerHTML = '';

  allImages.forEach(function(item) {
    var card = document.createElement('div');
    card.className = 'illustration-history-card';

    var img = document.createElement('img');
    img.src = 'data:' + (item.mimeType || 'image/png') + ';base64,' + item.imageData;
    img.alt = item.promptText ? item.promptText.substring(0, 60) : 'Illustratie';

    var info = document.createElement('div');
    info.className = 'illustration-history-info';

    var label = document.createElement('div');
    label.className = 'illustration-history-label';
    var labelText = (item.promptText || 'Illustratie').substring(0, 50);
    if ((item.promptText || '').length > 50) labelText += '…';
    label.textContent = labelText;

    var date = document.createElement('div');
    date.className = 'illustration-history-date';
    if (item.timestamp) {
      var d = new Date(item.timestamp);
      date.textContent = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    info.appendChild(label);
    info.appendChild(date);

    // Actions row
    var actions = document.createElement('div');
    actions.className = 'illustration-history-actions';

    var viewBtn = document.createElement('button');
    viewBtn.className = 'btn small';
    viewBtn.type = 'button';
    viewBtn.textContent = 'Bekijk';
    viewBtn.addEventListener('click', function() {
      renderIllustrationPreview(item.imageData, item.mimeType, item.promptText);
      hasGenerated = true;
      switchSection('preview');
    });

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn small ghost';
    deleteBtn.type = 'button';
    deleteBtn.textContent = '\u00D7';
    deleteBtn.title = 'Verwijder';
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      // Delete from gallery if it has a galleryId
      if (item.galleryId) {
        deleteFromGallery(item.galleryId);
      } else if (item.source === 'cache') {
        // Try to remove from illustration cache
        try {
          var keys = Object.keys(localStorage);
          for (var i = 0; i < keys.length; i++) {
            if (keys[i].indexOf('cg_illustration_') === 0) {
              var cached = JSON.parse(localStorage.getItem(keys[i]));
              if (cached && cached.imageData && cached.imageData.substring(0, 80) === item.imageData.substring(0, 80)) {
                localStorage.removeItem(keys[i]);
                break;
              }
            }
          }
        } catch(err) {}
      }
      renderIllustrationHistory();
    });

    actions.appendChild(viewBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(actions);

    // Click on card to view
    card.addEventListener('click', function(e) {
      if (e.target.tagName === 'BUTTON') return;
      renderIllustrationPreview(item.imageData, item.mimeType, item.promptText);
      hasGenerated = true;
      switchSection('preview');
    });

    grid.appendChild(card);
  });
}

function restoreCachedIllustration() {
  if (!usesIllustrationRendering()) return false;
  var templateName = getSelectedTemplate();
  var cached = loadIllustrationCache(templateName);
  if (cached && cached.imageData) {
    renderIllustrationPreview(cached.imageData, cached.mimeType, cached.promptText);
    hasGenerated = true;
    return true;
  }
  return false;
}

/* ── Illustration Preview Rendering ── */
function renderIllustrationPreview(imageData, mimeType, promptText) {
  var slideViewer = document.getElementById('slideViewer');
  var infographicViewer = document.getElementById('infographicViewer');
  var illustrationViewer = document.getElementById('illustrationViewer');

  // Hide other viewers, show illustration viewer
  if (slideViewer) slideViewer.style.display = 'none';
  if (infographicViewer) infographicViewer.style.display = 'none';
  if (illustrationViewer) {
    illustrationViewer.style.display = '';

    // Show generated image
    var imgEl = document.getElementById('illustrationImage');
    if (imgEl) {
      imgEl.src = 'data:' + mimeType + ';base64,' + imageData;
      imgEl.alt = 'Gegenereerde Rijkshuisstijl illustratie';
    }

    // Store prompt text in the pre element
    var promptEl = document.getElementById('illustrationPrompt');
    if (promptEl) {
      promptEl.textContent = promptText;
    }
  }

  // Setup download button
  var downloadBtn = document.getElementById('downloadImageBtn');
  if (downloadBtn) {
    downloadBtn.onclick = function() {
      var link = document.createElement('a');
      var ext = mimeType.indexOf('png') !== -1 ? '.png' : '.jpg';
      link.download = 'illustratie-' + Date.now() + ext;
      link.href = 'data:' + mimeType + ';base64,' + imageData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  }

  // Setup prompt toggle button
  var toggleBtn = document.getElementById('togglePromptBtn');
  var promptContainer = document.getElementById('promptContainer');
  if (toggleBtn && promptContainer) {
    promptContainer.style.display = 'none';
    toggleBtn.onclick = function() {
      var isVisible = promptContainer.style.display !== 'none';
      promptContainer.style.display = isVisible ? 'none' : '';
      toggleBtn.textContent = isVisible ? 'Toon prompt' : 'Verberg prompt';
    };
  }

  // Setup copy button
  var copyBtn = document.getElementById('copyPromptBtn');
  if (copyBtn) {
    copyBtn.onclick = function() {
      navigator.clipboard.writeText(promptText).then(function() {
        copyBtn.textContent = 'Gekopieerd!';
        copyBtn.classList.add('copied');
        setTimeout(function() {
          copyBtn.textContent = 'Kopieer';
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(function() {
        // Fallback for older browsers
        var textarea = document.createElement('textarea');
        textarea.value = promptText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyBtn.textContent = 'Gekopieerd!';
        copyBtn.classList.add('copied');
        setTimeout(function() {
          copyBtn.textContent = 'Kopieer';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    };
  }

  // Render gallery strip with all available illustrations
  renderGalleryStrip(imageData);
}

/* ── Gallery Strip in Illustration Viewer ── */
function renderGalleryStrip(currentImageData) {
  var strip = document.getElementById('galleryStrip');
  if (!strip) return;

  var allImages = getAllAvailableImages();
  if (allImages.length <= 1) {
    strip.style.display = 'none';
    return;
  }

  strip.style.display = '';
  strip.innerHTML = '<div class="gallery-strip-label">Eerdere illustraties (' + allImages.length + ')</div><div class="gallery-strip-scroll">';

  var scrollContainer = document.createElement('div');
  scrollContainer.className = 'gallery-strip-scroll';

  allImages.forEach(function(img, idx) {
    var thumb = document.createElement('div');
    thumb.className = 'gallery-strip-thumb';
    // Mark active based on matching image data
    if (currentImageData && img.imageData.substring(0, 80) === currentImageData.substring(0, 80)) {
      thumb.classList.add('active');
    }

    var imgEl = document.createElement('img');
    imgEl.src = 'data:' + (img.mimeType || 'image/png') + ';base64,' + img.imageData;
    imgEl.alt = (img.promptText || '').substring(0, 30);
    thumb.appendChild(imgEl);

    thumb.addEventListener('click', function() {
      renderIllustrationPreview(img.imageData, img.mimeType, img.promptText);
      hasGenerated = true;
    });

    scrollContainer.appendChild(thumb);
  });

  strip.innerHTML = '<div class="gallery-strip-label">Eerdere illustraties (' + allImages.length + ')</div>';
  strip.appendChild(scrollContainer);
}

/* ── Gemini Image Generation API ── */
async function callGeminiImageAPI(promptText) {
  var geminiKey = getIllustrationApiKey();
  if (!geminiKey) {
    throw new Error('Vul eerst je Gemini API key in bij stap 2 (Bronnen) om illustraties te genereren.');
  }

  var proxyUrl = 'proxy.php';

  var response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      target: 'gemini',
      api_key: geminiKey,
      prompt: promptText,
      model: 'gemini-3.1-flash-image-preview',
      aspect_ratio: '1:1',
      image_size: '2K',
    }),
  });

  if (!response.ok) {
    var errorData = await response.json().catch(function() { return {}; });
    // Gemini error format: { error: { code, message, status } }
    var errMsg = '';
    if (errorData.error) {
      errMsg = typeof errorData.error === 'string' ? errorData.error : (errorData.error.message || JSON.stringify(errorData.error));
    }
    if (response.status === 400) {
      throw new Error(errMsg || 'Ongeldige request naar Gemini API.');
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('Ongeldige Gemini API key. Controleer je key bij stap 2 (Bronnen).');
    }
    throw new Error(errMsg || 'Gemini API fout (' + response.status + ')');
  }

  var data = await response.json();

  // Extract image from Gemini response
  // Response format: { candidates: [{ content: { parts: [{ text: "..." }, { inline_data: { mime_type, data } }] } }] }
  if (!data.candidates || !data.candidates[0]) {
    // Check if there's a promptFeedback (blocked content)
    var feedback = data.promptFeedback;
    if (feedback && feedback.blockReason) {
      throw new Error('Gemini heeft de prompt geblokkeerd (' + feedback.blockReason + '). Probeer een andere omschrijving.');
    }
    console.error('Gemini response:', JSON.stringify(data).substring(0, 500));
    throw new Error('Geen response ontvangen van Gemini API. Probeer het opnieuw.');
  }

  var candidate = data.candidates[0];
  // Check if generation was blocked by safety filters
  if (candidate.finishReason && candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS') {
    throw new Error('Gemini kon geen afbeelding genereren (reden: ' + candidate.finishReason + '). Probeer een andere omschrijving.');
  }

  if (!candidate.content || !candidate.content.parts) {
    console.error('Gemini candidate:', JSON.stringify(candidate).substring(0, 500));
    throw new Error('Geen content ontvangen van Gemini API. Probeer het opnieuw.');
  }

  var parts = candidate.content.parts;
  var imagePart = null;
  for (var i = 0; i < parts.length; i++) {
    // Google AI REST API returns camelCase (inlineData), check both formats
    var inlineData = parts[i].inlineData || parts[i].inline_data;
    if (inlineData && inlineData.data) {
      imagePart = inlineData;
      break;
    }
  }

  if (!imagePart) {
    // Log what we did get for debugging
    var partTypes = parts.map(function(p) {
      if (p.text) return 'text(' + p.text.substring(0, 80) + ')';
      var iData = p.inlineData || p.inline_data;
      if (iData) return 'inlineData(' + (iData.mimeType || iData.mime_type || 'unknown') + ')';
      return 'unknown(' + Object.keys(p).join(',') + ')';
    });
    console.error('Gemini parts ontvangen:', partTypes.join(', '));
    console.error('Gemini raw response parts:', JSON.stringify(parts).substring(0, 1000));
    throw new Error('Gemini API heeft alleen tekst gegenereerd, geen afbeelding. Probeer een andere omschrijving.');
  }

  return {
    imageData: imagePart.data,
    mimeType: imagePart.mimeType || imagePart.mime_type || 'image/png',
  };
}

/* ── Placeholder Image Generation (direct Gemini, skips Claude) ── */

function buildPlaceholderPrompt(contextText) {
  return 'Create a 100% FLAT 2D government illustration in official Dutch Rijkshuisstijl style depicting: ' + contextText + '. ' +
    'CRITICAL STYLE: 100% flat solid color shapes like paper cut-outs. ZERO shadows, ZERO gradients, ZERO 3D effects, ZERO outlines, ZERO texture. ' +
    'Every shape is ONE single solid color. Depth ONLY through overlapping flat shapes. ' +
    'Use ONLY these colors: dark blue #154273 (dominant, for hair and accents), light blue #8FCAE7 (secondary accents). ' +
    'Background: solid uniform color RGB(224,237,245) — NOT transparent, NOT white. ' +
    'If people are shown: blank featureless faces with NO eyes, NO nose, NO mouth — only smooth head shape with dark blue #154273 hair. ' +
    'Skin tones: flat solid colors only — RGB(235,215,195) or RGB(215,180,145) or RGB(175,125,85) or RGB(125,80,50). NO shading on skin. ' +
    'ABSOLUTELY NO TEXT anywhere in the image — zero letters, zero numbers, zero words, zero symbols. ' +
    'NEVER include: shadows, gradients, 3D effects, outlines, text, facial features, cartoon style, textures, pure black, highlights, gloss. ' +
    'Clean, flat, geometric, minimal composition with ample white space.';
}

var _placeholderInteracting = false;

function initPlaceholderClickHandlers(container) {
  var placeholders = container.querySelectorAll('.bd-illustration-placeholder');
  var currentSlideObj = slides[currentSlide];

  placeholders.forEach(function(placeholder, index) {
    if (placeholder.dataset.initialized) return;
    placeholder.dataset.initialized = 'true';
    placeholder.dataset.phIndex = index;
    if (currentSlideObj) placeholder.dataset.slideId = currentSlideObj.id;
    placeholder.style.cursor = 'pointer';

    placeholder.addEventListener('click', function(e) {
      e.stopPropagation();
      // Don't open popover if we just finished panning/resizing
      if (_placeholderInteracting) {
        _placeholderInteracting = false;
        return;
      }
      // If image exists, only open popover when clicking the overlay
      var hasImg = placeholder.querySelector('img.placeholder-generated');
      if (hasImg) {
        var overlay = placeholder.querySelector('.placeholder-edit-overlay');
        if (overlay && (e.target === overlay || overlay.contains(e.target))) {
          showPlaceholderPopover(placeholder);
        }
        // Click on image itself = no-op (handled by pan/zoom)
        return;
      }
      showPlaceholderPopover(placeholder);
    });
  });
}

function initInfographicPlaceholderHandlers(iframeDoc) {
  if (!iframeDoc) return;
  var placeholders = iframeDoc.querySelectorAll('.illustration-placeholder');
  placeholders.forEach(function(placeholder) {
    if (placeholder.dataset.initialized) return;
    placeholder.dataset.initialized = 'true';
    placeholder.style.cursor = 'pointer';

    placeholder.addEventListener('click', function(e) {
      e.stopPropagation();
      // Get context from the label text (before it might be replaced by image)
      var label = placeholder.querySelector('.ph-label');
      var contextText = label ? label.textContent.replace('Illustratie:', '').trim() : (placeholder.dataset.context || '');
      // Store context for later use after image replacement
      if (contextText) placeholder.dataset.context = contextText;
      showPlaceholderPopoverForInfographic(placeholder, iframeDoc, contextText);
    });
  });
}

function handleUploadedFile(file, placeholder, isInfographic) {
  if (!file) return;

  // Validate file type
  var validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (validTypes.indexOf(file.type) === -1) {
    alert('Ongeldig bestandstype. Gebruik PNG, JPEG, WebP, SVG of GIF.');
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Bestand is te groot. Maximaal 5MB toegestaan.');
    return;
  }

  var reader = new FileReader();
  reader.onload = function(e) {
    var dataUrl = e.target.result;
    // Split data:image/png;base64,XXXX into mimeType and imageData
    var parts = dataUrl.split(',');
    var mimeType = parts[0].replace('data:', '').replace(';base64', '');
    var imageData = parts[1];

    applyImageToPlaceholder(placeholder, imageData, mimeType, file.name);

    // Save to slide storage if applicable
    if (!isInfographic) {
      var slideId = parseFloat(placeholder.dataset.slideId);
      var phIndex = parseInt(placeholder.dataset.phIndex || '0');
      if (slideId) {
        savePlaceholderImage(slideId, phIndex, imageData, mimeType, file.name);
      }
    }

    // Save to persistent gallery
    saveToGallery(imageData, mimeType, file.name);

    // Re-init click handler
    placeholder.dataset.initialized = '';
    if (!isInfographic) {
      initPlaceholderClickHandlers(placeholder.parentElement || slideCanvas);
    }

    // Re-render thumbs
    if (typeof renderThumbs === 'function') {
      setTimeout(renderThumbs, 200);
    }

    closePlaceholderPopover();
  };
  reader.readAsDataURL(file);
}

function buildUploadTabHTML() {
  return '<div class="popover-tab-content" data-tab-content="upload" style="display:none;">' +
    '<div class="upload-dropzone" id="popoverDropzone">' +
      '<svg width="32" height="32" fill="none" stroke="#8b95a5" stroke-width="1.5" viewBox="0 0 24 24">' +
        '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
        '<polyline points="17 8 12 3 7 8"/>' +
        '<line x1="12" y1="3" x2="12" y2="15"/>' +
      '</svg>' +
      '<span class="upload-dropzone-text">Sleep een afbeelding hierheen</span>' +
      '<span class="upload-dropzone-sub">of</span>' +
      '<label class="upload-btn-label" for="popoverFileInput">Kies bestand</label>' +
      '<input type="file" id="popoverFileInput" class="upload-file-input" accept="image/*" />' +
      '<span class="upload-dropzone-hint">PNG, JPEG, WebP, SVG — max 5MB</span>' +
    '</div>' +
  '</div>';
}

function initUploadHandlers(popover, placeholder, isInfographic) {
  var dropzone = popover.querySelector('#popoverDropzone');
  var fileInput = popover.querySelector('#popoverFileInput');

  if (dropzone) {
    dropzone.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
    dropzone.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUploadedFile(e.dataTransfer.files[0], placeholder, isInfographic);
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', function() {
      if (fileInput.files && fileInput.files.length > 0) {
        handleUploadedFile(fileInput.files[0], placeholder, isInfographic);
      }
    });
  }
}

function showPlaceholderPopover(placeholder) {
  closePlaceholderPopover();

  var context = placeholder.dataset.context || '';
  var hasExisting = !!placeholder.querySelector('img.placeholder-generated');
  var availableImages = getAllAvailableImages();
  var hasGallery = availableImages.length > 0;

  var popover = document.createElement('div');
  popover.className = 'placeholder-popover';
  popover.id = 'placeholderPopover';

  var geminiKey = getIllustrationApiKey();
  var keySection = '';
  if (!geminiKey) {
    keySection = '<div class="popover-field">' +
      '<label>Gemini API Key</label>' +
      '<input type="password" class="input popover-api-key" placeholder="Vul je Gemini API key in..." />' +
      '</div>';
  }

  // Tab bar (always shown — generate + upload, plus gallery if images exist)
  var tabBar = '<div class="popover-tabs">' +
    '<button class="popover-tab active" data-tab="generate">Genereer nieuw</button>' +
    '<button class="popover-tab" data-tab="upload">📁 Upload</button>' +
    (hasGallery ? '<button class="popover-tab" data-tab="gallery">Kies bestaande <span class="popover-tab-count">' + availableImages.length + '</span></button>' : '') +
    '</div>';

  // Gallery grid
  var galleryHTML = '';
  if (hasGallery) {
    galleryHTML = '<div class="popover-tab-content" data-tab-content="gallery" style="display:none;">' +
      '<div class="popover-gallery-header">' +
        '<span class="popover-gallery-count">' + availableImages.length + ' illustratie' + (availableImages.length !== 1 ? 's' : '') + '</span>' +
      '</div>' +
      '<div class="popover-gallery">';
    availableImages.forEach(function(img, idx) {
      var label = (img.promptText || '').substring(0, 40);
      if ((img.promptText || '').length > 40) label += '…';
      galleryHTML += '<div class="popover-gallery-item" data-gallery-index="' + idx + '" title="' + (img.promptText || '').replace(/"/g, '&quot;') + '">' +
        '<div class="gallery-item-thumb"><img src="data:' + img.mimeType + ';base64,' + img.imageData + '" /></div>' +
        (label ? '<div class="gallery-item-label">' + label.replace(/</g, '&lt;') + '</div>' : '') +
        '</div>';
    });
    galleryHTML += '</div></div>';
  }

  // Upload tab HTML
  var uploadHTML = buildUploadTabHTML();

  popover.innerHTML =
    '<div class="popover-header">' + (hasExisting ? 'Afbeelding wijzigen' : 'Afbeelding toevoegen') + '</div>' +
    tabBar +
    '<div class="popover-tab-content" data-tab-content="generate">' +
      keySection +
      '<div class="popover-field">' +
        '<label>Omschrijving</label>' +
        '<textarea class="input popover-prompt" rows="3" placeholder="Beschrijf de gewenste illustratie...">' + context + '</textarea>' +
      '</div>' +
      '<div class="popover-actions">' +
        '<button class="btn small ghost popover-cancel" type="button">Annuleren</button>' +
        '<button class="btn small primary popover-generate" type="button">Genereer</button>' +
      '</div>' +
    '</div>' +
    uploadHTML +
    galleryHTML;

  // Position near the placeholder
  var rect = placeholder.getBoundingClientRect();
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  popover.style.position = 'absolute';
  popover.style.top = (rect.top + scrollTop + rect.height / 2 - 100) + 'px';
  popover.style.left = (rect.left + rect.width + 12) + 'px';
  // Keep within viewport
  if (rect.left + rect.width + 12 + 340 > window.innerWidth) {
    popover.style.left = (rect.left - 340) + 'px';
  }

  document.body.appendChild(popover);

  // Tab switching
  popover.querySelectorAll('.popover-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var targetTab = tab.dataset.tab;
      popover.querySelectorAll('.popover-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      popover.querySelectorAll('.popover-tab-content').forEach(function(c) {
        c.style.display = c.dataset.tabContent === targetTab ? 'block' : 'none';
      });
    });
  });

  // Upload handlers
  initUploadHandlers(popover, placeholder, false);

  // Gallery item clicks
  popover.querySelectorAll('.popover-gallery-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var idx = parseInt(item.dataset.galleryIndex);
      var selected = availableImages[idx];
      if (selected) {
        applyImageToPlaceholder(placeholder, selected.imageData, selected.mimeType, selected.promptText);
        var slideId = parseFloat(placeholder.dataset.slideId);
        var phIndex = parseInt(placeholder.dataset.phIndex || '0');
        savePlaceholderImage(slideId, phIndex, selected.imageData, selected.mimeType, selected.promptText);
        if (typeof renderThumbs === 'function') setTimeout(renderThumbs, 200);
        // Re-init click handler for the refreshed placeholder
        placeholder.dataset.initialized = '';
        initPlaceholderClickHandlers(placeholder.parentElement || slideCanvas);
        closePlaceholderPopover();
      }
    });
  });

  // Cancel button
  popover.querySelector('.popover-cancel').addEventListener('click', closePlaceholderPopover);

  // Generate button
  popover.querySelector('.popover-generate').addEventListener('click', function() {
    var promptText = popover.querySelector('.popover-prompt').value.trim();
    if (!promptText) { alert('Vul een omschrijving in.'); return; }

    var keyInput = popover.querySelector('.popover-api-key');
    if (keyInput && keyInput.value.trim()) {
      setIllustrationApiKey(keyInput.value.trim());
    }

    if (!getIllustrationApiKey()) {
      alert('Vul eerst een Gemini API key in.');
      return;
    }

    closePlaceholderPopover();
    generatePlaceholderImage(placeholder, promptText);
  });

  // Close on click outside
  setTimeout(function() {
    document.addEventListener('click', handlePopoverOutsideClick);
  }, 100);
}

function showPlaceholderPopoverForInfographic(placeholder, iframeDoc, contextText) {
  closePlaceholderPopover();

  var hasExisting = !!placeholder.querySelector('img.placeholder-generated');
  var availableImages = getAllAvailableImages();
  var hasGallery = availableImages.length > 0;

  var popover = document.createElement('div');
  popover.className = 'placeholder-popover';
  popover.id = 'placeholderPopover';

  var geminiKey = getIllustrationApiKey();
  var keySection = '';
  if (!geminiKey) {
    keySection = '<div class="popover-field">' +
      '<label>Gemini API Key</label>' +
      '<input type="password" class="input popover-api-key" placeholder="Vul je Gemini API key in..." />' +
      '</div>';
  }

  // Tab bar (always shown — generate + upload, plus gallery if images exist)
  var tabBar = '<div class="popover-tabs">' +
    '<button class="popover-tab active" data-tab="generate">Genereer nieuw</button>' +
    '<button class="popover-tab" data-tab="upload">📁 Upload</button>' +
    (hasGallery ? '<button class="popover-tab" data-tab="gallery">Kies bestaande <span class="popover-tab-count">' + availableImages.length + '</span></button>' : '') +
    '</div>';

  var galleryHTML = '';
  if (hasGallery) {
    galleryHTML = '<div class="popover-tab-content" data-tab-content="gallery" style="display:none;">' +
      '<div class="popover-gallery-header">' +
        '<span class="popover-gallery-count">' + availableImages.length + ' illustratie' + (availableImages.length !== 1 ? 's' : '') + '</span>' +
      '</div>' +
      '<div class="popover-gallery">';
    availableImages.forEach(function(img, idx) {
      var label = (img.promptText || '').substring(0, 40);
      if ((img.promptText || '').length > 40) label += '…';
      galleryHTML += '<div class="popover-gallery-item" data-gallery-index="' + idx + '" title="' + (img.promptText || '').replace(/"/g, '&quot;') + '">' +
        '<div class="gallery-item-thumb"><img src="data:' + img.mimeType + ';base64,' + img.imageData + '" /></div>' +
        (label ? '<div class="gallery-item-label">' + label.replace(/</g, '&lt;') + '</div>' : '') +
        '</div>';
    });
    galleryHTML += '</div></div>';
  }

  // Upload tab HTML
  var uploadHTML = buildUploadTabHTML();

  popover.innerHTML =
    '<div class="popover-header">' + (hasExisting ? 'Afbeelding wijzigen' : 'Afbeelding toevoegen') + '</div>' +
    tabBar +
    '<div class="popover-tab-content" data-tab-content="generate">' +
      keySection +
      '<div class="popover-field">' +
        '<label>Omschrijving</label>' +
        '<textarea class="input popover-prompt" rows="3" placeholder="Beschrijf de gewenste illustratie...">' + contextText + '</textarea>' +
      '</div>' +
      '<div class="popover-actions">' +
        '<button class="btn small ghost popover-cancel" type="button">Annuleren</button>' +
        '<button class="btn small primary popover-generate" type="button">Genereer</button>' +
      '</div>' +
    '</div>' +
    uploadHTML +
    galleryHTML;

  var infographicViewer = document.getElementById('infographicViewer');
  if (infographicViewer) {
    var viewerRect = infographicViewer.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    popover.style.position = 'absolute';
    popover.style.top = (viewerRect.top + scrollTop + 100) + 'px';
    popover.style.left = (viewerRect.right + 12) + 'px';
  }

  document.body.appendChild(popover);

  // Tab switching
  popover.querySelectorAll('.popover-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var targetTab = tab.dataset.tab;
      popover.querySelectorAll('.popover-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      popover.querySelectorAll('.popover-tab-content').forEach(function(c) {
        c.style.display = c.dataset.tabContent === targetTab ? 'block' : 'none';
      });
    });
  });

  // Upload handlers
  initUploadHandlers(popover, placeholder, true);

  // Gallery item clicks
  popover.querySelectorAll('.popover-gallery-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var idx = parseInt(item.dataset.galleryIndex);
      var selected = availableImages[idx];
      if (selected) {
        applyImageToPlaceholder(placeholder, selected.imageData, selected.mimeType, selected.promptText);
        closePlaceholderPopover();
      }
    });
  });

  popover.querySelector('.popover-cancel').addEventListener('click', closePlaceholderPopover);

  popover.querySelector('.popover-generate').addEventListener('click', function() {
    var promptText = popover.querySelector('.popover-prompt').value.trim();
    if (!promptText) { alert('Vul een omschrijving in.'); return; }

    var keyInput = popover.querySelector('.popover-api-key');
    if (keyInput && keyInput.value.trim()) {
      setIllustrationApiKey(keyInput.value.trim());
    }

    if (!getIllustrationApiKey()) {
      alert('Vul eerst een Gemini API key in.');
      return;
    }

    closePlaceholderPopover();
    generatePlaceholderImage(placeholder, promptText);
  });

  setTimeout(function() {
    document.addEventListener('click', handlePopoverOutsideClick);
  }, 100);
}

function handlePopoverOutsideClick(e) {
  var popover = document.getElementById('placeholderPopover');
  if (popover && !popover.contains(e.target)) {
    closePlaceholderPopover();
  }
}

function closePlaceholderPopover() {
  var existing = document.getElementById('placeholderPopover');
  if (existing) existing.remove();
  document.removeEventListener('click', handlePopoverOutsideClick);
}

async function generatePlaceholderImage(placeholder, promptText) {
  // Show loading state
  var originalContent = placeholder.innerHTML;
  placeholder.innerHTML = '<div class="placeholder-loading"><div class="placeholder-spinner"></div><span>Genereren...</span></div>';
  placeholder.style.cursor = 'wait';

  try {
    var fullPrompt = buildPlaceholderPrompt(promptText);
    var result = await callGeminiImageAPI(fullPrompt);

    // Apply image to placeholder with overlay
    applyImageToPlaceholder(placeholder, result.imageData, result.mimeType, promptText);

    // Save to slide storage for persistence across navigation
    var slideId = parseFloat(placeholder.dataset.slideId);
    var phIndex = parseInt(placeholder.dataset.phIndex || '0');
    if (slideId) {
      savePlaceholderImage(slideId, phIndex, result.imageData, result.mimeType, promptText);
    }

    // Save to persistent gallery (localStorage)
    saveToGallery(result.imageData, result.mimeType, promptText);

    // Re-init click handler for the refreshed placeholder
    placeholder.dataset.initialized = '';
    initPlaceholderClickHandlers(placeholder.parentElement || slideCanvas);

    // Re-render thumbs if in slide mode
    if (typeof renderThumbs === 'function') {
      setTimeout(renderThumbs, 200);
    }
  } catch (err) {
    // Show error and restore original content
    placeholder.innerHTML = originalContent;
    placeholder.style.cursor = 'pointer';

    var errorDiv = document.createElement('div');
    errorDiv.className = 'placeholder-error';
    errorDiv.textContent = err.message || 'Fout bij genereren';
    placeholder.appendChild(errorDiv);

    setTimeout(function() {
      var errEl = placeholder.querySelector('.placeholder-error');
      if (errEl) errEl.remove();
    }, 4000);
  }
}

/* ── HTML Escape Helper ── */
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Rapportage JSON Parser ── */
function parseRapportageJSON(text) {
  var trimmed = text.trim();
  // Remove markdown code fences if present
  var jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    trimmed = jsonMatch[1].trim();
  }
  try {
    var data = JSON.parse(trimmed);
    if (!data.meta || !data.sections) {
      throw new Error('JSON mist "meta" of "sections" veld');
    }
    return data;
  } catch (e) {
    console.error('[Rapportage] JSON parse error:', e.message);
    // Try to find JSON object in the text
    var objMatch = trimmed.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        var data2 = JSON.parse(objMatch[0]);
        if (data2.meta && data2.sections) return data2;
      } catch (e2) { /* fall through */ }
    }
    throw new Error('Kon rapportage JSON niet parsen: ' + e.message);
  }
}

/* ── Rapportage HTML Renderer ── */
function renderRapportageHTML(meta, sections) {
  // Build table of contents from chapters
  var tocItems = [];
  var chapterCount = 0;
  sections.forEach(function(s, i) {
    if (s.type === 'chapter' || s.type === 'summary' || s.type === 'conclusion') {
      var num = s.number || '';
      var title = s.title || (s.type === 'summary' ? 'Managementsamenvatting' : (s.type === 'conclusion' ? 'Conclusie' : 'Hoofdstuk'));
      tocItems.push({ id: 'section-' + i, number: num, title: title, type: s.type });
    }
  });

  // Render each section
  var sectionsHTML = '';
  sections.forEach(function(s, i) {
    var sectionId = 'section-' + i;
    switch (s.type) {
      case 'summary':
        sectionsHTML += '<section id="' + sectionId + '" class="rpt-section rpt-summary">' +
          '<div class="rpt-summary-bar"></div>' +
          '<h2 class="rpt-section-title">' + escapeHtml(s.title || 'Managementsamenvatting') + '</h2>' +
          '<div class="rpt-section-body">' + (s.body || '') + '</div>' +
          '</section>';
        break;

      case 'chapter':
        var numLabel = s.number ? '<span class="rpt-chapter-num">' + escapeHtml(s.number) + '</span>' : '';
        sectionsHTML += '<section id="' + sectionId + '" class="rpt-section rpt-chapter">' +
          '<h2 class="rpt-section-title">' + numLabel + escapeHtml(s.title || '') + '</h2>' +
          '<div class="rpt-section-body">' + (s.body || '') + '</div>' +
          '</section>';
        break;

      case 'callout':
        sectionsHTML += '<section id="' + sectionId + '" class="rpt-section rpt-callout">' +
          '<div class="rpt-callout-icon">' +
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#154273" stroke-width="2">' +
              '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' +
            '</svg>' +
          '</div>' +
          '<div class="rpt-callout-content">' +
            '<h3 class="rpt-callout-title">' + escapeHtml(s.title || 'Let op') + '</h3>' +
            '<div class="rpt-section-body">' + (s.body || '') + '</div>' +
          '</div>' +
          '</section>';
        break;

      case 'table':
        var tableHTML = '<table class="rpt-table"><thead><tr>';
        (s.headers || []).forEach(function(h) {
          tableHTML += '<th>' + escapeHtml(h) + '</th>';
        });
        tableHTML += '</tr></thead><tbody>';
        (s.rows || []).forEach(function(row) {
          tableHTML += '<tr>';
          row.forEach(function(cell) {
            tableHTML += '<td>' + escapeHtml(cell) + '</td>';
          });
          tableHTML += '</tr>';
        });
        tableHTML += '</tbody></table>';
        sectionsHTML += '<section id="' + sectionId + '" class="rpt-section rpt-table-section">' +
          (s.title ? '<h3 class="rpt-section-subtitle">' + escapeHtml(s.title) + '</h3>' : '') +
          tableHTML +
          '</section>';
        break;

      case 'quote':
        sectionsHTML += '<section id="' + sectionId + '" class="rpt-section rpt-quote">' +
          '<blockquote class="rpt-blockquote">' +
            '<div class="rpt-quote-mark">\u201C</div>' +
            '<p class="rpt-quote-text">' + escapeHtml(s.text || '') + '</p>' +
            (s.source ? '<cite class="rpt-quote-source">' + escapeHtml(s.source) + '</cite>' : '') +
          '</blockquote>' +
          '</section>';
        break;

      case 'list':
        var listHTML = '<ol class="rpt-list">';
        (s.items || []).forEach(function(item) {
          listHTML += '<li>' + escapeHtml(item) + '</li>';
        });
        listHTML += '</ol>';
        sectionsHTML += '<section id="' + sectionId + '" class="rpt-section rpt-list-section">' +
          (s.title ? '<h3 class="rpt-section-subtitle">' + escapeHtml(s.title) + '</h3>' : '') +
          listHTML +
          '</section>';
        break;

      case 'conclusion':
        sectionsHTML += '<section id="' + sectionId + '" class="rpt-section rpt-conclusion">' +
          '<div class="rpt-conclusion-bar"></div>' +
          '<h2 class="rpt-section-title">' + escapeHtml(s.title || 'Conclusie') + '</h2>' +
          '<div class="rpt-section-body">' + (s.body || '') + '</div>' +
          '</section>';
        break;

      case 'stats-grid':
        var statsHTML = '<div class="rpt-stats-grid">';
        (s.stats || []).forEach(function(stat) {
          statsHTML += '<div class="rpt-stat-card">' +
            '<div class="rpt-stat-number">' + escapeHtml(stat.number || '') + '</div>' +
            '<div class="rpt-stat-label">' + escapeHtml(stat.label || '') + '</div>' +
            (stat.sublabel ? '<div class="rpt-stat-sublabel">' + escapeHtml(stat.sublabel) + '</div>' : '') +
          '</div>';
        });
        statsHTML += '</div>';
        sectionsHTML += '<section id="' + sectionId + '" class="rpt-section rpt-stats-section">' +
          (s.title ? '<h3 class="rpt-section-subtitle">' + escapeHtml(s.title) + '</h3>' : '') +
          statsHTML +
          '</section>';
        break;

      case 'divider':
        sectionsHTML += '<section id="' + sectionId + '" class="rpt-section rpt-divider">' +
          '<hr class="rpt-divider-line"/>' +
          (s.title ? '<span class="rpt-divider-label">' + escapeHtml(s.title) + '</span>' : '') +
          '</section>';
        break;

      case 'text-full':
        sectionsHTML += '<section id="' + sectionId + '" class="rpt-section rpt-text-full">' +
          (s.title ? '<h3 class="rpt-section-subtitle">' + escapeHtml(s.title) + '</h3>' : '') +
          '<div class="rpt-section-body">' + (s.body || '') + '</div>' +
          '</section>';
        break;

      default:
        sectionsHTML += '<section id="' + sectionId + '" class="rpt-section">' +
          '<div class="rpt-section-body">' + (s.body || JSON.stringify(s)) + '</div>' +
          '</section>';
    }
  });

  // Build TOC HTML
  var tocHTML = '<nav class="rpt-toc"><h2 class="rpt-toc-title">Inhoudsopgave</h2><ol class="rpt-toc-list">';
  tocItems.forEach(function(item) {
    var prefix = item.number ? '<span class="rpt-toc-num">' + escapeHtml(item.number) + '</span>' : '';
    tocHTML += '<li class="rpt-toc-item' + (item.type === 'summary' || item.type === 'conclusion' ? ' rpt-toc-highlight' : '') + '">' +
      '<a href="#' + item.id + '">' + prefix + escapeHtml(item.title) + '</a></li>';
  });
  tocHTML += '</ol></nav>';

  // Assemble full HTML document
  return '<!DOCTYPE html>\n<html lang="nl">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '<title>' + escapeHtml(meta.title || 'Rapportage') + '</title>\n' +
    '<style>\n' +
    '@import url("https://fonts.googleapis.com/css2?family=RO+Sans:wght@300;400;500;600;700&display=swap");\n' +
    ':root {\n' +
    '  --rpt-blauw: #154273;\n  --rpt-lichtblauw: #8FCAE7;\n  --rpt-lichtblauw-bg: #E3EFF7;\n' +
    '  --rpt-achtergrond: #EBF2F8;\n  --rpt-wit: #FFFFFF;\n  --rpt-tekst: #1A1A1A;\n' +
    '  --rpt-accent: #007BC7;\n}\n' +
    '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n' +
    'body {\n  font-family: "RO Sans", "Segoe UI", Arial, sans-serif;\n  color: var(--rpt-tekst);\n' +
    '  background: var(--rpt-wit);\n  line-height: 1.6;\n  font-size: 15px;\n}\n' +
    /* Title page */
    '.rpt-titlepage {\n  width: 100%;\n  aspect-ratio: 16/9;\n  background: #fff;\n  position: relative;\n  overflow: hidden;\n}\n' +
    '.rpt-titlepage-vlak {\n  position: absolute;\n  left: 0; top: 0;\n  width: 50%;\n  height: 100%;\n' +
    '  background: #8FCAE7;\n  clip-path: polygon(0% 0%, 96% 0%, 96% 8%, 100% 8%, 100% 55%, 75% 55%, 75% 65%, 0% 65%);\n}\n' +
    '.rpt-titlepage-content {\n  position: absolute;\n  left: 4%;\n  top: 32.5%;\n  transform: translateY(-50%);\n  width: 44%;\n  z-index: 1;\n  color: var(--rpt-blauw);\n}\n' +
    '.rpt-titlepage-content h1 {\n  font-size: clamp(24px, 3.5vw, 42px);\n  font-weight: 700;\n  color: var(--rpt-blauw);\n' +
    '  line-height: 1.2;\n  margin-bottom: 8px;\n}\n' +
    '.rpt-titlepage-content .rpt-subtitle {\n  font-size: clamp(13px, 1.6vw, 18px);\n  color: var(--rpt-blauw);\n  opacity: 0.85;\n' +
    '  margin-bottom: 24px;\n  font-weight: 400;\n  line-height: 1.45;\n}\n' +
    '.rpt-meta-grid {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  gap: 4px 16px;\n  font-size: clamp(11px, 1.2vw, 14px);\n  color: #555;\n}\n' +
    '.rpt-meta-label { font-weight: 600; color: var(--rpt-blauw); }\n' +
    /* Main content area */
    '.rpt-main {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 60px 40px;\n}\n' +
    /* TOC */
    '.rpt-toc {\n  margin-bottom: 50px;\n  padding: 30px;\n  background: var(--rpt-lichtblauw-bg);\n}\n' +
    '.rpt-toc-title {\n  font-size: 22px;\n  color: var(--rpt-blauw);\n  margin-bottom: 16px;\n  font-weight: 700;\n}\n' +
    '.rpt-toc-list {\n  list-style: none;\n  counter-reset: toc;\n}\n' +
    '.rpt-toc-item {\n  padding: 6px 0;\n  border-bottom: 1px solid rgba(21, 66, 115, 0.1);\n}\n' +
    '.rpt-toc-item a {\n  color: var(--rpt-blauw);\n  text-decoration: none;\n  font-size: 15px;\n}\n' +
    '.rpt-toc-item a:hover { text-decoration: underline; }\n' +
    '.rpt-toc-num { display: inline-block; min-width: 36px; font-weight: 600; }\n' +
    '.rpt-toc-highlight a { font-weight: 600; }\n' +
    /* Sections general */
    '.rpt-section {\n  margin-bottom: 40px;\n}\n' +
    '.rpt-section-title {\n  font-size: 22px;\n  font-weight: 700;\n  color: var(--rpt-blauw);\n' +
    '  margin-bottom: 16px;\n  padding-bottom: 8px;\n  border-bottom: 2px solid var(--rpt-lichtblauw);\n}\n' +
    '.rpt-section-subtitle {\n  font-size: 18px;\n  font-weight: 600;\n  color: var(--rpt-blauw);\n  margin-bottom: 12px;\n}\n' +
    '.rpt-section-body p { margin-bottom: 12px; }\n' +
    '.rpt-section-body strong { color: var(--rpt-blauw); }\n' +
    '.rpt-chapter-num {\n  display: inline-block;\n  min-width: 40px;\n  color: var(--rpt-accent);\n  font-weight: 700;\n}\n' +
    /* Summary */
    '.rpt-summary {\n  background: var(--rpt-lichtblauw-bg);\n  padding: 28px 32px;\n  position: relative;\n}\n' +
    '.rpt-summary-bar {\n  position: absolute;\n  left: 0; top: 0;\n  width: 4px;\n  height: 100%;\n  background: var(--rpt-blauw);\n}\n' +
    /* Callout */
    '.rpt-callout {\n  background: var(--rpt-lichtblauw-bg);\n  border-left: 4px solid var(--rpt-lichtblauw);\n  padding: 20px 24px;\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n}\n' +
    '.rpt-callout-icon { flex-shrink: 0; margin-top: 2px; }\n' +
    '.rpt-callout-title { font-weight: 700; color: var(--rpt-blauw); margin-bottom: 6px; }\n' +
    /* Table */
    '.rpt-table {\n  width: 100%;\n  border-collapse: collapse;\n  margin-top: 8px;\n}\n' +
    '.rpt-table th {\n  background: var(--rpt-blauw);\n  color: white;\n  padding: 10px 14px;\n' +
    '  text-align: left;\n  font-weight: 600;\n  font-size: 13px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n' +
    '.rpt-table td {\n  padding: 10px 14px;\n  border-bottom: 1px solid #ddd;\n  font-size: 14px;\n}\n' +
    '.rpt-table tbody tr:nth-child(even) { background: #f8fafb; }\n' +
    /* Quote */
    '.rpt-quote {\n  padding: 20px 0;\n}\n' +
    '.rpt-blockquote {\n  background: var(--rpt-achtergrond);\n  padding: 32px 36px;\n  position: relative;\n}\n' +
    '.rpt-quote-mark {\n  font-size: 64px;\n  color: var(--rpt-lichtblauw);\n  line-height: 1;\n  position: absolute;\n  top: 12px;\n  left: 20px;\n  opacity: 0.6;\n}\n' +
    '.rpt-quote-text {\n  font-size: 18px;\n  font-style: italic;\n  color: var(--rpt-blauw);\n  margin-left: 36px;\n  line-height: 1.6;\n}\n' +
    '.rpt-quote-source {\n  display: block;\n  margin-top: 12px;\n  margin-left: 36px;\n  font-size: 14px;\n  color: #666;\n  font-style: normal;\n}\n' +
    /* List */
    '.rpt-list {\n  padding-left: 24px;\n}\n' +
    '.rpt-list li {\n  padding: 6px 0;\n  font-size: 15px;\n}\n' +
    '.rpt-list li::marker { color: var(--rpt-blauw); font-weight: 700; }\n' +
    /* Conclusion */
    '.rpt-conclusion {\n  background: var(--rpt-achtergrond);\n  padding: 28px 32px;\n  position: relative;\n}\n' +
    '.rpt-conclusion-bar {\n  position: absolute;\n  left: 0; top: 0;\n  width: 4px;\n  height: 100%;\n  background: var(--rpt-lichtblauw);\n}\n' +
    /* Stats grid */
    '.rpt-stats-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 16px;\n}\n' +
    '.rpt-stat-card {\n  background: var(--rpt-lichtblauw-bg);\n  padding: 20px;\n  text-align: center;\n}\n' +
    '.rpt-stat-number {\n  font-size: 32px;\n  font-weight: 700;\n  color: var(--rpt-blauw);\n  line-height: 1.2;\n}\n' +
    '.rpt-stat-label {\n  font-size: 13px;\n  font-weight: 600;\n  color: #555;\n  margin-top: 4px;\n}\n' +
    '.rpt-stat-sublabel { font-size: 11px; color: #888; margin-top: 2px; }\n' +
    /* Divider */
    '.rpt-divider {\n  text-align: center;\n  padding: 20px 0;\n}\n' +
    '.rpt-divider-line {\n  border: none;\n  border-top: 2px solid var(--rpt-lichtblauw);\n  margin-bottom: 8px;\n}\n' +
    '.rpt-divider-label {\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--rpt-blauw);\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}\n' +
    /* Text full */
    '.rpt-text-full .rpt-section-body { max-width: 100%; }\n' +
    /* Back to top */
    '.rpt-back-top {\n  display: inline-block;\n  margin-top: 8px;\n  font-size: 12px;\n  color: var(--rpt-accent);\n  text-decoration: none;\n}\n' +
    '.rpt-back-top:hover { text-decoration: underline; }\n' +
    /* Print styles */
    '@media print {\n  .rpt-titlepage { aspect-ratio: auto; height: auto; min-height: 60vh; page-break-after: always; }\n' +
    '  .rpt-section { page-break-inside: avoid; }\n  .rpt-back-top { display: none; }\n' +
    '  body { font-size: 12pt; }\n}\n' +
    '</style>\n</head>\n<body>\n' +
    /* Title page */
    '<div class="rpt-titlepage">\n' +
    '  <div class="rpt-titlepage-vlak"></div>\n' +
    '  <div class="rpt-titlepage-content">\n' +
    '    <h1>' + escapeHtml(meta.title || 'Rapportage') + '</h1>\n' +
    (meta.subtitle ? '    <div class="rpt-subtitle">' + escapeHtml(meta.subtitle) + '</div>\n' : '') +
    '    <div class="rpt-meta-grid">\n' +
    (meta.date ? '      <span class="rpt-meta-label">Datum</span><span>' + escapeHtml(meta.date) + '</span>\n' : '') +
    (meta.author ? '      <span class="rpt-meta-label">Auteur</span><span>' + escapeHtml(meta.author) + '</span>\n' : '') +
    (meta.classification ? '      <span class="rpt-meta-label">Classificatie</span><span>' + escapeHtml(meta.classification) + '</span>\n' : '') +
    (meta.version ? '      <span class="rpt-meta-label">Versie</span><span>' + escapeHtml(meta.version) + '</span>\n' : '') +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    /* Main content */
    '<main class="rpt-main">\n' +
    tocHTML + '\n' +
    sectionsHTML + '\n' +
    '</main>\n' +
    '</body>\n</html>';
}

function extractHTMLFromResponse(text) {
  var trimmed = text.trim();
  // Remove markdown code fences if present
  var htmlMatch = trimmed.match(/```(?:html)?\s*([\s\S]*?)```/);
  if (htmlMatch) {
    return htmlMatch[1].trim();
  }
  // If it starts with <!DOCTYPE or <html, it's raw HTML
  if (trimmed.match(/^<!DOCTYPE|^<html/i)) {
    return trimmed;
  }
  // Otherwise return as-is and hope for the best
  return trimmed;
}

async function startGeneration() {
  if (isGenerating) return;

  if (!getApiKey()) {
    openApiKeyDialog();
    return;
  }

  isGenerating = true;
  resetOverlay();
  showOverlay(true);

  var activeSkills = getActiveSkills();
  var skillNames = activeSkills.length > 0
    ? activeSkills.map(function(s) { return s.name; }).join(' + ')
    : 'Standaard';
  var isInfographic = usesInfographicRendering();
  var isIllustration = usesIllustrationRendering();
  var isBlueprint = usesServiceBlueprintRendering();
  var isRapportage = usesRapportageRendering();

  console.log('[DEBUG] Template:', getSelectedTemplate(), '| Skills:', skillNames, '| isIllustration:', isIllustration, '| isBlueprint:', isBlueprint, '| isInfographic:', isInfographic, '| isRapportage:', isRapportage);

  try {
    updateProgress(15, 'Bronnen analyseren...');
    var prompt = buildPrompt();

    var genLabel = isIllustration ? 'Illustratie prompt' : (isRapportage ? 'Rapportage' : (isBlueprint ? 'Service Blueprint' : (isInfographic ? 'Infographic' : 'Presentatie')));
    updateProgress(30, genLabel + ' genereren via ' + skillNames + '...');
    var responseText = await callClaudeAPI(prompt.system, prompt.userMessage);

    if (isIllustration) {
      // Illustration mode: Claude generates prompt → send to Gemini for image
      updateProgress(50, 'Prompt verwerken...');
      var promptText = responseText.trim();
      // Remove markdown fences if present
      var fenceMatch = promptText.match(/```(?:\w*)?\s*([\s\S]*?)```/);
      if (fenceMatch) {
        promptText = fenceMatch[1].trim();
      }

      updateProgress(65, 'Afbeelding genereren via Gemini...');
      var imageResult = await callGeminiImageAPI(promptText);

      updateProgress(90, 'Afbeelding laden...');
      renderIllustrationPreview(imageResult.imageData, imageResult.mimeType, promptText);
      // Cache the illustration for next visit
      saveIllustrationCache(getSelectedTemplate(), imageResult.imageData, imageResult.mimeType, promptText);
      // Also save to persistent gallery
      saveToGallery(imageResult.imageData, imageResult.mimeType, promptText);
    } else if (isRapportage) {
      // Rapportage mode: parse JSON → render to HTML document
      updateProgress(50, 'Rapportage JSON verwerken...');
      var rapportageData = parseRapportageJSON(responseText);

      updateProgress(70, 'Rapportage document opbouwen...');
      var htmlContent = renderRapportageHTML(rapportageData.meta, rapportageData.sections);

      updateProgress(90, 'Rapportage laden...');
      renderInfographicPreview(htmlContent);
    } else if (isBlueprint) {
      // Service Blueprint mode: render HTML directly (same as infographic)
      updateProgress(70, 'Service Blueprint opbouwen...');
      var htmlContent = extractHTMLFromResponse(responseText);

      updateProgress(90, 'Service Blueprint laden...');
      renderInfographicPreview(htmlContent);
    } else if (isInfographic) {
      // Infographic mode: render HTML directly
      updateProgress(70, 'Infographic opbouwen...');
      var htmlContent = extractHTMLFromResponse(responseText);

      updateProgress(90, 'Infographic laden...');
      renderInfographicPreview(htmlContent);
    } else {
      // Slide mode: parse JSON and render slides
      updateProgress(70, 'Slides opbouwen...');
      var slideData = parseSlideJSON(responseText);

      updateProgress(90, 'Presentatie laden...');

      slides = slideData.map(function(s) {
        var validTypes = ['cover', 'content', 'text', 'quote-right', 'quote-left'];
        var type = validTypes.indexOf(s.type) !== -1 ? s.type : 'text';
        return createSlide(type, s.data);
      });

      if (slides.length === 0) {
        slides = [createSlide('cover')];
      }

      currentSlide = 0;
      showSlideViewer();
      renderCurrentSlide();
      renderThumbs();
    }

    updateProgress(100, 'Klaar!');

    await new Promise(function(r) { setTimeout(r, 500); });

    showOverlay(false);
    hasGenerated = true;
  } catch (err) {
    showOverlayError(err.message);
  } finally {
    isGenerating = false;
  }
}

/* ── Generate button ── */
generateBtn.addEventListener('click', function() {
  hasGenerated = false;
  startGeneration();
});

/* ── Regenerate illustration button ── */
var regenerateBtn = document.getElementById('regenerateIllustrationBtn');
if (regenerateBtn) {
  regenerateBtn.addEventListener('click', function() {
    hasGenerated = false;
    startGeneration();
  });
}

/* ── File Upload ── */
fileButton.addEventListener('click', function() {
  fileInput.click();
});

pasteButton.addEventListener('click', function() {
  pasteBox.classList.toggle('active');
  if (pasteBox.classList.contains('active')) {
    pasteBox.querySelector('textarea').focus();
  }
});

pasteBox.querySelector('textarea').addEventListener('blur', function () {
  var text = this.value.trim();
  if (text) {
    var existing = sources.find(function(s) { return s.id === 'pasted-text'; });
    if (existing) {
      existing.content = text;
      existing.size = new Blob([text]).size;
    } else {
      sources.unshift({
        id: 'pasted-text',
        name: 'Geplakte tekst',
        size: new Blob([text]).size,
        type: 'TXT',
        label: 'TXT',
        previewUrl: null,
        content: text,
      });
    }
    hasGenerated = false;
    renderSources();
  }
});

uploadDrop.addEventListener('click', function(event) {
  if (event.target !== fileButton && event.target !== pasteButton) {
    fileInput.click();
  }
});

fileInput.addEventListener('change', function(event) {
  if (event.target.files.length > 0) {
    addFiles(event.target.files);
    fileInput.value = '';
  }
});

['dragenter', 'dragover'].forEach(function(eventName) {
  uploadDrop.addEventListener(eventName, function(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadDrop.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach(function(eventName) {
  uploadDrop.addEventListener(eventName, function(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadDrop.classList.remove('dragover');
  });
});

uploadDrop.addEventListener('drop', function(event) {
  if (event.dataTransfer.files.length > 0) {
    addFiles(event.dataTransfer.files);
  }
});

/* ── PPTX Export ── */
var PPTX_CDN = 'https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js';
var PPTX_W = 10;
var PPTX_H = 5.625;
var PPTX_LINT = '154273';
var PPTX_LICHT = '8FCAE7';
var PPTX_BG = 'DAE9F3';
var PPTX_FONT = 'Calibri';

function loadScript(url) {
  return new Promise(function(resolve, reject) {
    if (document.querySelector('script[src="' + url + '"]')) { resolve(); return; }
    var s = document.createElement('script');
    s.src = url;
    s.onload = resolve;
    s.onerror = function() { reject(new Error('Kan library niet laden: ' + url)); };
    document.head.appendChild(s);
  });
}

function imageToBase64(src) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      // SVG's hebben soms naturalWidth=0; gebruik dan vaste render-grootte
      var w = img.naturalWidth || 800;
      var h = img.naturalHeight || 480;
      // Render op hoge resolutie voor scherpte in PPTX
      var scale = (w < 400) ? 4 : 2;
      var c = document.createElement('canvas');
      c.width = w * scale;
      c.height = h * scale;
      var ctx = c.getContext('2d');
      // Canvas is transparant by default — niet vullen!
      ctx.drawImage(img, 0, 0, c.width, c.height);
      resolve({ data: c.toDataURL('image/png'), width: w, height: h });
    };
    img.onerror = function() { reject(new Error('Kan afbeelding niet laden: ' + src)); };
    img.src = src;
  });
}

function pptxStripHTML(html) {
  if (!html) return '';
  var d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || d.innerText || '';
}

function pptxAddLogo(slide, logoInfo, logoAspect) {
  var h = PPTX_H * 0.172;
  var w = h * logoAspect;
  slide.addImage({ data: logoInfo.data, x: PPTX_W * 0.475, y: 0, w: w, h: h });
}

function pptxAddPlaceholder(slide, slideData, x, y, w, h) {
  if (slideData.placeholderImages) {
    var keys = Object.keys(slideData.placeholderImages);
    if (keys.length > 0) {
      var img = slideData.placeholderImages[keys[0]];
      if (img && img.imageData) {
        var uri = img.imageData.startsWith('data:') ? img.imageData : 'data:' + (img.mimeType || 'image/png') + ';base64,' + img.imageData;
        slide.addImage({ data: uri, x: x, y: y, w: w, h: h, sizing: { type: 'cover' } });
        return;
      }
    }
  }
  slide.addShape('rect', { x: x, y: y, w: w, h: h, fill: { color: 'E8E8E8' }, line: { color: 'E8E8E8', width: 0 } });
}

function buildPptxCover(slide, slideData, pres, logoInfo, logoAspect) {
  var d = slideData.data;
  slide.background = { color: 'FFFFFF' };

  // L-vlak als 2 rechthoeken (betrouwbaarder dan CUSTOM_GEOMETRY)
  // Vlak = 50% breedte van slide. Clip-path: 0% 0%, 96% 0%, 96% 8%, 100% 8%, 100% 55%, 75% 55%, 75% 65%, 0% 65%
  // L-vlak via overlappende rechthoeken (geen borders)
  var lfill = { color: PPTX_LICHT };
  var lline = { color: PPTX_LICHT, width: 0 };
  // Bovenbalk: volledige breedte boven, 0-8% hoogte
  slide.addShape('rect', { x: 0, y: 0, w: 5.0, h: 0.45, fill: lfill, line: lline });
  // Hoofdvlak: 0-48% breedte, 8%-55% hoogte
  slide.addShape('rect', { x: 0, y: 0.45, w: 4.8, h: 2.644, fill: lfill, line: lline });
  // Keep rechtsboven: 48%-50%, 8%-55%
  slide.addShape('rect', { x: 4.8, y: 0.45, w: 0.2, h: 2.644, fill: lfill, line: lline });
  // Keep linksonder: 0-75%, 55%-65%
  slide.addShape('rect', { x: 0, y: 3.094, w: 3.75, h: 0.562, fill: lfill, line: lline });

  // Logo
  var logoH = PPTX_H * 0.172;
  var logoW = logoH * logoAspect;
  var logoX = (PPTX_W * 0.5) - (logoW * 0.091);
  slide.addImage({ data: logoInfo.data, x: logoX, y: 0, w: logoW, h: logoH });

  // Titel
  slide.addText(pptxStripHTML(d.title), {
    x: PPTX_W * 0.04, y: PPTX_H * 0.20, w: PPTX_W * 0.44, h: 1.5,
    fontFace: PPTX_FONT, fontSize: 28, color: PPTX_LINT,
    bold: false, valign: 'top', wrap: true
  });

  // Datum
  if (d.date) {
    slide.addText(pptxStripHTML(d.date), {
      x: PPTX_W * 0.04, y: PPTX_H * 0.20 + 1.6, w: PPTX_W * 0.44, h: 0.4,
      fontFace: PPTX_FONT, fontSize: 14, color: PPTX_LINT, italic: true, valign: 'top'
    });
  }
}

function buildPptxContent(slide, slideData, pres, logoInfo, logoAspect) {
  var d = slideData.data;
  slide.background = { color: 'FFFFFF' };

  // Rechterhelft lichtblauw
  slide.addShape('rect', { x: 5.0, y: 0, w: 5.0, h: PPTX_H, fill: { color: PPTX_BG }, line: { color: PPTX_BG, width: 0 } });

  // Placeholder/afbeelding rechts
  pptxAddPlaceholder(slide, slideData, 5.5, 0.85, 4.0, 3.9);

  // Logo
  pptxAddLogo(slide, logoInfo, logoAspect);

  // Sectielabel
  var yPos = 0.48;
  if (d.section) {
    slide.addText(pptxStripHTML(d.section), {
      x: 0.32, y: yPos, w: 4.5, h: 0.3,
      fontFace: PPTX_FONT, fontSize: 11, bold: true, color: PPTX_LINT
    });
  }

  // Titel
  slide.addText(pptxStripHTML(d.title), {
    x: 0.32, y: 0.85, w: 4.5, h: 0.8,
    fontFace: PPTX_FONT, fontSize: 22, bold: true, color: PPTX_LINT, valign: 'top', wrap: true
  });

  // Body/items
  if (d.items && d.items.length > 0) {
    var bulletRows = d.items.map(function(item) {
      return { text: pptxStripHTML(item), options: { bullet: true, indentLevel: 0 } };
    });
    slide.addText(bulletRows, {
      x: 0.32, y: 1.7, w: 4.5, h: 3.2,
      fontFace: PPTX_FONT, fontSize: 13, color: '1A1A1A',
      lineSpacingMultiple: 1.4, valign: 'top', wrap: true
    });
  } else if (d.body) {
    slide.addText(pptxStripHTML(d.body), {
      x: 0.32, y: 1.7, w: 4.5, h: 3.2,
      fontFace: PPTX_FONT, fontSize: 13, color: '1A1A1A',
      lineSpacingMultiple: 1.4, valign: 'top', wrap: true
    });
  }
}

function buildPptxText(slide, slideData, pres, logoInfo, logoAspect) {
  var d = slideData.data;
  slide.background = { color: 'FFFFFF' };

  pptxAddLogo(slide, logoInfo, logoAspect);

  if (d.section) {
    slide.addText(pptxStripHTML(d.section), {
      x: 0.32, y: 0.48, w: 8.0, h: 0.3,
      fontFace: PPTX_FONT, fontSize: 11, bold: true, color: PPTX_LINT
    });
  }

  slide.addText(pptxStripHTML(d.title), {
    x: 0.32, y: 0.85, w: 8.0, h: 0.8,
    fontFace: PPTX_FONT, fontSize: 22, bold: true, color: PPTX_LINT, valign: 'top', wrap: true
  });

  slide.addText(pptxStripHTML(d.paragraph1), {
    x: 0.32, y: 1.7, w: 7.5, h: 1.5,
    fontFace: PPTX_FONT, fontSize: 13, color: '1A1A1A',
    lineSpacingMultiple: 1.4, valign: 'top', wrap: true
  });

  slide.addText(pptxStripHTML(d.paragraph2), {
    x: 0.32, y: 3.3, w: 7.5, h: 1.5,
    fontFace: PPTX_FONT, fontSize: 13, color: '1A1A1A',
    lineSpacingMultiple: 1.4, valign: 'top', wrap: true
  });
}

function buildPptxQuoteRight(slide, slideData, pres, logoInfo, logoAspect) {
  var d = slideData.data;
  slide.background = { color: 'FFFFFF' };

  // Lichtblauw blok links (vereenvoudigd)
  slide.addShape('rect', { x: 0, y: 0.58, w: 4.8, h: 2.45, fill: { color: PPTX_BG }, line: { color: PPTX_BG, width: 0 } });
  slide.addShape('rect', { x: 0, y: 3.03, w: 2.64, h: 0.82, fill: { color: PPTX_BG }, line: { color: PPTX_BG, width: 0 } });

  // Foto rechts
  pptxAddPlaceholder(slide, slideData, 5.0, 0, 5.0, PPTX_H);

  pptxAddLogo(slide, logoInfo, logoAspect);

  if (d.section) {
    slide.addText(pptxStripHTML(d.section), {
      x: 0.32, y: 0.28, w: 4.0, h: 0.3,
      fontFace: PPTX_FONT, fontSize: 11, bold: true, color: PPTX_LINT
    });
  }

  // Titel
  slide.addText(pptxStripHTML(d.title || ''), {
    x: 0.32, y: 0.8, w: 4.2, h: 1.5,
    fontFace: PPTX_FONT, fontSize: 24, color: PPTX_LINT, valign: 'top', wrap: true
  });

  // Quote
  slide.addText(pptxStripHTML(d.quote), {
    x: 0.32, y: PPTX_H - 1.4, w: 4.2, h: 0.8,
    fontFace: PPTX_FONT, fontSize: 12, color: '1A1A1A', italic: true,
    lineSpacingMultiple: 1.3, valign: 'bottom', wrap: true
  });

  // Auteur
  slide.addText(pptxStripHTML(d.author), {
    x: 0.32, y: PPTX_H - 0.5, w: 4.2, h: 0.35,
    fontFace: PPTX_FONT, fontSize: 11, color: '555555', valign: 'bottom'
  });
}

function buildPptxQuoteLeft(slide, slideData, pres, logoInfo, logoAspect) {
  var d = slideData.data;
  slide.background = { color: 'FFFFFF' };

  // Foto links
  pptxAddPlaceholder(slide, slideData, 0, 0, 5.0, PPTX_H);

  // Rechterhelft lichtblauw
  slide.addShape('rect', { x: 5.0, y: 0, w: 5.0, h: PPTX_H, fill: { color: PPTX_BG }, line: { color: PPTX_BG, width: 0 } });

  pptxAddLogo(slide, logoInfo, logoAspect);

  // Titel rechts
  slide.addText(pptxStripHTML(d.title || d.quote), {
    x: 5.36, y: 0.64, w: 4.2, h: 1.5,
    fontFace: PPTX_FONT, fontSize: 24, bold: true, color: PPTX_LINT, valign: 'top', wrap: true
  });

  // Subtitle
  if (d.subtitle) {
    slide.addText(pptxStripHTML(d.subtitle), {
      x: 5.36, y: 2.2, w: 4.2, h: 1.2,
      fontFace: PPTX_FONT, fontSize: 14, color: '1A1A1A',
      lineSpacingMultiple: 1.3, valign: 'top', wrap: true
    });
  }

  // Quote
  slide.addText(pptxStripHTML(d.quote), {
    x: 5.36, y: PPTX_H - 1.4, w: 4.2, h: 0.8,
    fontFace: PPTX_FONT, fontSize: 12, color: '1A1A1A', italic: true,
    lineSpacingMultiple: 1.3, valign: 'bottom', wrap: true
  });

  // Auteur
  slide.addText(pptxStripHTML(d.author), {
    x: 5.36, y: PPTX_H - 0.5, w: 4.2, h: 0.35,
    fontFace: PPTX_FONT, fontSize: 11, color: '555555', valign: 'bottom'
  });
}

async function exportPPTX() {
  await loadScript(PPTX_CDN);

  // Logo laden als base64 (SVG → transparante PNG via canvas)
  var logoSrc = 'logo.svg';
  var logoInfo = await imageToBase64(logoSrc);
  var logoAspect = logoInfo.width / logoInfo.height;

  var pres = new PptxGenJS();
  pres.defineLayout({ name: 'RIJKSHUISSTIJL', width: PPTX_W, height: PPTX_H });
  pres.layout = 'RIJKSHUISSTIJL';

  slides.forEach(function(slideData) {
    var s = pres.addSlide();
    switch (slideData.type) {
      case 'cover':       buildPptxCover(s, slideData, pres, logoInfo, logoAspect); break;
      case 'content':     buildPptxContent(s, slideData, pres, logoInfo, logoAspect); break;
      case 'text':        buildPptxText(s, slideData, pres, logoInfo, logoAspect); break;
      case 'quote-right': buildPptxQuoteRight(s, slideData, pres, logoInfo, logoAspect); break;
      case 'quote-left':  buildPptxQuoteLeft(s, slideData, pres, logoInfo, logoAspect); break;
      default:            buildPptxText(s, slideData, pres, logoInfo, logoAspect); break;
    }
  });

  await pres.writeFile({ fileName: 'presentatie.pptx' });
}

/* ── Export selectie + knop ── */
var selectedExportFormat = null;
var exportError = document.getElementById('exportError');
var exportBtn = document.getElementById('exportBtn');

// Selectie-logica: klik op een export-card om formaat te kiezen
document.querySelectorAll('.export-card').forEach(function(card) {
  card.addEventListener('click', function() {
    document.querySelectorAll('.export-card').forEach(function(c) { c.classList.remove('selected'); });
    card.classList.add('selected');
    selectedExportFormat = card.getAttribute('data-format');
    if (exportError) exportError.style.display = 'none';
  });
});

// Exporteren knop
if (exportBtn) {
  exportBtn.addEventListener('click', async function() {
    // Validatie: is er een formaat gekozen?
    if (!selectedExportFormat) {
      if (exportError) {
        exportError.style.display = 'flex';
        // Re-trigger shake animatie
        exportError.style.animation = 'none';
        exportError.offsetHeight; // reflow
        exportError.style.animation = '';
      }
      return;
    }

    if (exportError) exportError.style.display = 'none';
    var origText = exportBtn.textContent;

    try {
      exportBtn.textContent = 'Exporteren...';
      exportBtn.style.opacity = '0.6';
      exportBtn.style.pointerEvents = 'none';

      switch (selectedExportFormat) {
        case 'pptx':
          if (!slides || slides.length === 0) {
            alert('Geen slides om te exporteren. Genereer eerst een presentatie.');
            break;
          }
          await exportPPTX();
          break;
        case 'pdf':
        case 'docx':
        case 'html':
        case 'png':
        case 'svg':
          alert('Export als ' + selectedExportFormat.toUpperCase() + ' is nog in ontwikkeling.');
          break;
        default:
          alert('Onbekend formaat: ' + selectedExportFormat);
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('Fout bij export: ' + err.message);
    } finally {
      exportBtn.innerHTML = 'Exporteren <span class="arrow">\u2192</span>';
      exportBtn.style.opacity = '';
      exportBtn.style.pointerEvents = '';
    }
  });
}

/* ── Init ── */
renderTemplates();
renderSources();
updateSkillBadge();
