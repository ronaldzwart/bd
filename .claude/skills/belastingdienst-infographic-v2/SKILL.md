---
name: belastingdienst-infographic-v2
description: >
  Maak infographics in Belastingdienst-huisstijl (Rijkshuisstijl).
  Gebruik bij "infographic", "dashboard", "feiten en cijfers",
  "stappenplan visueel", of data visueel weergeven in BD-stijl.
---

# Belastingdienst Infographic Skill (v2)

## Overzicht

Deze skill genereert infographics als enkel HTML-bestand in de officiële Belastingdienst-huisstijl (Rijkshuisstijl). De output is een standalone HTML-pagina die direct in de browser bekeken, gedeeld of geprint kan worden.

Het modulaire systeem werkt in 3 lagen: **Componenten** (bouwstenen) → **Modules** (samengestelde onderdelen) → **Toepassing** (de complete infographic).

### Wijzigingen t.o.v. v1:
- Logo is altijd inline SVG, gecentreerd midden bovenaan in de header
- Illustraties worden vervangen door gestandaardiseerde placeholders (zie sectie Illustration Placeholders)

---

## Huisstijl Specificaties

### Kleuren

| Kleur | Hex | CSS variabele | Gebruik |
|-------|-----|---------------|---------|
| Contrast-blauw | `#154273` | `--contrast-blauw` | Titels, koppen, primaire tekst, iconen |
| Domein-blauw | `#8FCAE7` | `--domein-blauw` | Accentsecties, donut-charts, lichtere elementen |
| Domein-blauw-2 | `#ABD7ED` | `--domein-blauw-2` | Subtielere achtergronden |
| Domein-blauw-3 | `#BCDFF0` | `--domein-blauw-3` | Lichte vlakken |
| Domein-blauw-4 | `#CCE7F4` | `--domein-blauw-4` | Lichtere vlakken |
| Domein-blauw-5 | `#DDEFF8` | `--domein-blauw-5` | Zeer lichte achtergronden |
| Domein-blauw-6 | `#EEF7FC` | `--domein-blauw-6` | Subtielste achtergrond |
| Wit | `#FFFFFF` | | Canvas/ondergrond (altijd wit!) |
| Accent-cyaan | `#007BC7` | `--accent-cyaan` | Informatieve signaalelementen |
| Accent-paars | `#A90061` | `--accent-paars` | Alarmerende signaal, chart-accenten |
| Accent-oranje | `#E17000` | `--accent-oranje` | Adviserende signaal |
| Accent-geel | `#FFB612` | `--accent-geel` | Attenderende signaal |
| Accent-groen | `#39870C` | `--accent-groen` | Motiverende signaal |

**Kleurregels:**
- Canvas (ondergrond) is ALTIJD wit
- Start met corporate blauw-tinten voor inhoud
- Gebruik maximaal ÉÉN accentkleur per infographic (tenzij onderdeel van groter geheel)
- Meerdere accentkleuren alleen als het functioneel noodzakelijk is
- Zorg voor voldoende contrast voor digitale toegankelijkheid

### Typografie

- **Font-stack**: `'RO Sans', 'Segoe UI', 'Calibri', Arial, sans-serif`
- **Importeer via Google Fonts**: `@import url('https://fonts.googleapis.com/css2?family=RO+Sans:wght@300;400;500;600;700&display=swap')`
- **Grote kopcijfers**: font-weight: 700, font-size: 36-48px, kleur contrast-blauw
- **Sectietitels**: font-weight: 700, font-size: 20-24px, kleur contrast-blauw
- **Body-tekst**: font-size: 14-16px, line-height: 1.5, kleur #333 of contrast-blauw
- **Labels/beschrijvingen**: font-size: 12-14px, font-weight: 400
- Lopende tekst altijd linkslijnend (ook in blokken)
- Tekst NOOIT schuin plaatsen
- Vermijd afkortingen

---

## Logo — ALTIJD inline SVG, gecentreerd in header

Het Belastingdienst-logo wordt ALTIJD als inline SVG in het HTML-bestand opgenomen. Het logo staat midden bovenaan, gecentreerd in de header, vóór de titel.

### Vaste SVG-code voor het logo

Gebruik altijd onderstaande SVG letterlijk in de header. Pas de hoogte aan via `height` op de `<svg>` tag (standaard 80px). De breedte schaalt automatisch mee via `viewBox`.

```html
<!-- LOGO — midden bovenaan in de header, altijd gecentreerd -->
<div class="logo-wrapper">
  <svg height="80" viewBox="0 0 275 125" xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink" aria-label="Belastingdienst logo">
    <style>.st0{fill:none;}.st1{fill:#154273;}.st2{fill:#FFFFFF;}</style>
    <g id="Laag_1_1_">
      <g>
        <rect y="0" class="st0" width="275" height="125"/>
        <rect y="0" class="st1" width="50" height="100"/>
      </g>
      <!-- Volledige SVG-paden: lees assets/Belastingdienst_logo.svg -->
    </g>
  </svg>
</div>
```

### CSS voor logo-wrapper

```css
.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
}
```

### Volledige SVG-broncode

De volledige, onverkorte SVG staat in `assets/Belastingdienst_logo.svg`. Lees dit bestand en embed de volledige SVG inline bij het genereren van een infographic:

```bash
cat assets/Belastingdienst_logo.svg
```

Zet de volledige inhoud van dit bestand — inclusief alle `<path>` elementen — als inline SVG in de `.logo-wrapper` div, met `height="80"` op de `<svg>` tag en het `aria-label` attribuut.

---

## Illustration Placeholders — ALTIJD gebruiken i.p.v. afbeeldingen

Overal waar illustraties of afbeeldingen zouden komen, gebruik je gestandaardiseerde placeholder-blokken. Placeholders zijn bedoeld om achteraf eenvoudig door echte illustraties vervangen te worden.

### Waarom placeholders?
- Illustraties worden door een ontwerper toegevoegd ná het genereren
- Placeholders geven duidelijk aan: afmeting, positie en context van de illustratie
- Ze zien er visueel verzorgd uit maar storen de infographic-layout niet

### Placeholder-ontwerp

Placeholders hebben:
- Lichtblauwe achtergrond (`var(--domein-blauw-5)` of `#DDEFF8`)
- Gestippelde rand in domein-blauw (`#8FCAE7`)
- Icoon (SVG bergfoto-pictogram) in de middelste kleur van het palet
- Label met de beoogde illustratie-naam (bijv. "Illustratie: gebruikers")
- Afmeting-hint als kleine tekst (bijv. "140 × 140 px")
- Vierkante hoeken (geen border-radius, conform BD-stijl)

### CSS voor placeholders

Voeg altijd onderstaande CSS toe aan het `<style>` blok:

```css
/* ================================================
   ILLUSTRATION PLACEHOLDERS
   Vervang .illustration-placeholder > div door
   een <img> of inline SVG na oplevering.
   ================================================ */

.illustration-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--domein-blauw-5, #DDEFF8);
  border: 2px dashed #8FCAE7;
  border-radius: 0; /* BD-stijl: GEEN afgeronde hoeken */
  color: #154273;
  text-align: center;
  flex-shrink: 0;
  padding: 12px;
  box-sizing: border-box;
}

.illustration-placeholder .ph-icon {
  opacity: 0.45;
}

.illustration-placeholder .ph-label {
  font-size: 11px;
  font-weight: 600;
  color: #154273;
  line-height: 1.3;
  opacity: 0.7;
}

.illustration-placeholder .ph-size {
  font-size: 10px;
  color: #154273;
  opacity: 0.45;
  font-weight: 400;
}
```

### HTML-component per grootte

#### Klein (80 × 80 px) — voor icoon-posities, stap-iconen
```html
<div class="illustration-placeholder" style="width:80px;height:80px;" role="img" aria-label="Illustratie placeholder">
  <svg class="ph-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#154273" stroke-width="1.5">
    <rect x="3" y="3" width="18" height="18" rx="0" ry="0"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
  <span class="ph-label">Illustratie:<br>[naam]</span>
  <span class="ph-size">80 × 80</span>
</div>
```

#### Normaal (140 × 140 px) — voor stat-cards, naast cijfers
```html
<div class="illustration-placeholder" style="width:140px;height:140px;" role="img" aria-label="Illustratie placeholder">
  <svg class="ph-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#154273" stroke-width="1.5">
    <rect x="3" y="3" width="18" height="18" rx="0" ry="0"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
  <span class="ph-label">Illustratie:<br>[naam]</span>
  <span class="ph-size">140 × 140</span>
</div>
```

#### Breed (200 × 140 px) — voor brede kaartblokken, opties
```html
<div class="illustration-placeholder" style="width:200px;height:140px;" role="img" aria-label="Illustratie placeholder">
  <svg class="ph-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#154273" stroke-width="1.5">
    <rect x="3" y="3" width="18" height="18" rx="0" ry="0"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
  <span class="ph-label">Illustratie:<br>[naam]</span>
  <span class="ph-size">200 × 140</span>
</div>
```

#### Footer / groot (120 × 120 px) — voor footer-illustraties, afsluitblok
```html
<div class="illustration-placeholder" style="width:120px;height:120px;" role="img" aria-label="Illustratie placeholder">
  <svg class="ph-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#154273" stroke-width="1.5">
    <rect x="3" y="3" width="18" height="18" rx="0" ry="0"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
  <span class="ph-label">Illustratie:<br>[naam]</span>
  <span class="ph-size">120 × 120</span>
</div>
```

### Naamgeving placeholders

Geef elke placeholder een beschrijvende naam die aangeeft wat de illustratie moet uitbeelden. Voorbeelden:
- `Illustratie:<br>gebruikers` (bij een stat-card over respondenten)
- `Illustratie:<br>conclusie` (bij footer)
- `Illustratie:<br>stap 1` (bij een processtap)
- `Illustratie:<br>belastingaangifte` (bij een inhoudelijk blok)

### Vervangen door echte illustratie

Wanneer een ontwerper de placeholder vervangt, vervangen zij het `<div class="illustration-placeholder">` blok door een `<img>` of inline SVG:

```html
<!-- VOOR (placeholder) -->
<div class="illustration-placeholder" style="width:140px;height:140px;" ...>
  ...
</div>

<!-- NA (echte illustratie) -->
<img src="images/gebruikers.svg" alt="Gebruikers" style="width:140px;height:140px;object-fit:contain;">
```

---

## Infographic Vormen

Er zijn 5 vormen. Kies de juiste vorm op basis van de inhoud. Combineren mag, maar houd het simpel. Lees het corresponderende referentie-template in `references/`.

### 1. Paden (Proces/Tijdlijn)
- **Template**: `references/paden-infographic.html`
- **Gebruik**: Processen, tijdlijnen, stappenplannen, customer journeys
- **Kenmerken**: Sequentiële stappen met nummers in cirkels, verbindingslijnen, fasekoppen in contrast-blauw, per stap een icoon + titel + beschrijving
- **Layout**: Horizontaal (max 4-5 per rij) of verticaal (tijdlijn), meerdere fases als S-bocht patroon
- **Illustraties**: placeholder (80×80) per stap als icoonvervanger

### 2. Opties (Keuzes)
- **Template**: `references/opties-infographic.html`
- **Gebruik**: Keuzemogelijkheden, vergelijkingen, varianten presenteren
- **Kenmerken**: Gelijke kolommen naast elkaar, per optie een illustratie-area, titel, voor/nadelen of kenmerken, optioneel vergelijkingstabel onderaan
- **Layout**: 2-4 kolommen naast elkaar, gelijke breedte
- **Illustraties**: placeholder (200×140) bovenaan elke optie-kolom

### 3. Dashboard (Overzicht)
- **Template**: `references/dashboard-infographic.html`
- **Gebruik**: Jaarverslagen, feiten & cijfers, gecombineerde informatie
- **Kenmerken**: Mix van stat-cards, donut-charts, opsommingen, tekstvlakken, 2-koloms grid (links: data/charts, rechts: opsommingen/details)
- **Layout**: Grid-based, visuele hiërarchie hoofd→bijzaak, call-to-action blok
- **Illustraties**: placeholder (140×140) naast stat-cards; placeholder (120×120) in footer

### 4. Kaart (Geografisch)
- **Template**: `references/kaart-infographic.html`
- **Gebruik**: Provinciale/regionale data, locaties, geografische spreiding
- **Kenmerken**: SVG-kaart van Nederland met provincies, kleurintensiteit per data-waarde, legenda, aanvullende tekst/cijfers naast de kaart
- **Layout**: Kaart links/centraal, data-labels per provincie, legenda
- **Illustraties**: geen illustratie-placeholders (kaart is het visuele element)

### 5. Cijfers (Statistieken)
- **Template**: `references/cijfers-infographic.html`
- **Gebruik**: Wanneer getallen het belangrijkste element zijn
- **Kenmerken**: Grote uitvergrote cijfers, icon-arrays (persoon-iconen), donut/bar-charts, beschrijvende labels onder de cijfers
- **Layout**: Stat-cards in grid, afgewisseld met visualisaties
- **Illustraties**: placeholder (140×140) per stat-card naast de cijfers

---

## Basisprincipes (ALTIJD toepassen)

### Eenvoud
- Vereenvoudig complexe informatie tot behapbare visuele elementen en beknopte tekst
- Laat overbodige en decoratieve elementen achterwege

### Verhaal
- Vertel een verhaal. Dat onthouden mensen het beste
- Logische leesvolgorde die visueel ondersteund wordt

### Rust en witruimte
- Creëer een evenwichtige en overzichtelijke compositie
- Niet alles in één blok proppen

### Visuele hiërarchie
- Groepeer gerelateerde informatie samen
- Onderscheid hoofd- en bijzaken (grotere/vetdrukte elementen = belangrijker)
- Breng focus aan op de kernboodschap

### Toegankelijkheid
- Zorg dat elke doelgroep de informatie tot zich kan nemen
- Alt-tekst op afbeeldingen en logo
- Voldoende kleurcontrast
- Semantische HTML-structuur

### Consistentie
- Herhaal vormgevingselementen (lettergrootte, gewichten) consistent
- Gelijke marges binnen vlakken

---

## Componenten (Bouwstenen)

### Vlakken
- Altijd vierkante hoeken (GEEN afgeronde hoeken)
- Vermijd ronde vormen als stijlelement
- Cirkels alleen functioneel toegestaan (bijv. in stappenplannen)
- Vlakverdeling komt voort uit functie
- Vlakkleuren: domein-blauw varianten of wit

### Iconen
- Gebruik iconen vanuit inhoud, niet als decoratie
- Gebruik eenvoudige SVG-iconen in contrast-blauw of domein-blauw
- Verwijzing: Iconenbibliotheek Rijksoverheid

### Pijlen en lijnen
- Minimaliseer het gebruik van lijnen
- 4 soorten pijlen: chevron-blok, dunne pijl, dubbele pijl, chevron-teken (>)
- Geen stippellijnen als component (stippellijnen zijn ALLEEN voor illustration-placeholders)

### Stappen
- Cirkels toegestaan bij stappen (functioneel)
- Opties: gevulde cirkels of outline cirkels
- Nummers in cirkels in contrast-blauw of wit-op-blauw

### Grafieken
- Begin met corporate blauwtinten, daarna accentkleuren
- Donut-charts: SVG circles met stroke-dasharray
- Bar-charts: horizontaal of verticaal, blauwtinten
- Zorg voor voldoende contrast tussen elementen

---

## Werkwijze

### Stap 1: Analyseer de inhoud

Bepaal welke infographic-vorm het beste past bij de gevraagde inhoud. Stel jezelf de checklist-vragen:
- Is er een duidelijke leesvolgorde?
- Is de boodschap helder?
- Is er onderscheid hoofd-/bijzaak?
- Is het handelingsperspectief toegepast? (wat moet de lezer doen?)
- Zijn er plekken voor illustraties? (zo ja: plan illustration placeholders in)

### Stap 2: Lees het template

Lees de relevante HTML-template uit `references/` als referentie voor de layout.

### Stap 3: Logo embedden

Lees de volledige SVG-broncode:

```bash
cat assets/Belastingdienst_logo.svg
```

Embed de volledige SVG inline in de `.logo-wrapper` div, bovenaan de header, gecentreerd.

### Stap 4: Illustration placeholders plannen

Bepaal voor elke plek waar een illustratie past:
- Welke grootte? (80, 120, 140 of 200px breed)
- Welke beschrijvende naam? (wat moet de illustratie uitbeelden?)

Gebruik dan de placeholder-HTML-component uit deze skill.

### Stap 5: Genereer de infographic

Maak één HTML-bestand met:
- CSS variabelen voor alle huisstijlkleuren
- Google Fonts import voor RO Sans
- Placeholder CSS (zie sectie Illustration Placeholders)
- Responsive layout (max-width: 1200px, gecentreerd)
- Witte canvas als basis
- Logo bovenaan gecentreerd als inline SVG in `.logo-wrapper`
- Titel in contrast-blauw
- Modules opgebouwd uit de componenten
- Illustration placeholders op alle illustratie-posities
- Print-friendly styling (`@media print`)

### Stap 6: Kwaliteitscheck (mentaal)

Controleer tegen de checklist:
- ✓ Logo staat midden bovenaan als inline SVG
- ✓ Illustration placeholders aanwezig op alle illustratie-posities
- ✓ Placeholder-namen zijn beschrijvend en context-specifiek
- ✓ Duidelijke leesvolgorde, visueel ondersteund
- ✓ Heldere boodschap
- ✓ Onderscheid hoofd-/bijzaak
- ✓ Handelingsperspectief aanwezig
- ✓ Merkbeleid gevolgd (kleuren, logo, typografie)
- ✓ Alle basisprincipes toegepast
- ✓ Digitaal toegankelijk

---

## Taal en interactie

- Vermijd afkortingen
- Maak duidelijk wie wat doet ("jij" / "wij")
- Koppel aan het handelingsperspectief van de gebruiker
- Neem een call-to-action op waar relevant
- Maak duidelijk waar iemand informatie kan vinden

---

## Voorbeeld

Als de gebruiker vraagt: "Maak een infographic met de feiten en cijfers van de inkomstenbelasting 2024"

Dan kies je **Dashboard** vorm en genereer je een HTML-bestand met:
- Logo inline SVG bovenaan, gecentreerd in `.logo-wrapper`
- Titel "Feiten en cijfers inkomstenbelasting 2024" in contrast-blauw
- Links: stat-cards met grote cijfers (8,3 miljoen, 9,3 miljoen) + illustration placeholder (140×140, "Illustratie: belastingplichtige") + donut-charts
- Rechts: opsommingen (Belastingdienst.nl, Aangiftevragen, Geholpen via aangiftehulp)
- Footer: illustration placeholder (120×120, "Illustratie: conclusie") + contactinformatie
- Onderaan: call-to-action blok
