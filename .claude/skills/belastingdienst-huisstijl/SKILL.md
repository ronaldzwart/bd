---
name: belastingdienst-huisstijl
description: >
  Pas de officiële Belastingdienst-huisstijl (Rijkshuisstijl) toe op presentaties en HTML-artifacts.
  Gebruik deze skill wanneer de gebruiker een presentatie, slides, of een deck wil maken voor de
  Belastingdienst, of wanneer "huisstijl", "Rijkshuisstijl", "Belastingdienst", "BD-stijl",
  "overheids-presentatie" of vergelijkbare termen worden genoemd. Ook triggeren bij verzoeken om
  slides, decks of presentaties te maken in een professionele overheidsstijl. Deze skill bevat
  HTML-templates voor 6 slide-typen en het officiële Belastingdienst-logo.
---

# Belastingdienst Huisstijl

## Overzicht

Deze skill levert presentaties op in de officiële Belastingdienst-huisstijl (onderdeel van de
Rijkshuisstijl). Output is een enkel HTML-bestand met alle slides, klaar om te presenteren in
de browser of later te exporteren naar .pptx.

## Huisstijl Specificaties

### Kleuren

| Kleur          | Hex       | Gebruik                                    |
|----------------|-----------|--------------------------------------------|
| Lintblauw      | `#154273` | Titels, koppen, primaire merkkleur         |
| Lichtblauw     | `#8FCAE7` | Cover-vlak, accenten                       |
| Lichtblauw BG  | `#DAE9F3` | Achtergrondvlakken op content-slides       |
| Wit            | `#FFFFFF` | Slide-achtergrond, tekst op donkere vlakken|
| Tekst donker   | `#1A1A1A` | Body-tekst                                 |

### Typografie

- **Font-stack**: `'RijksoverheidSansWebText', 'Calibri', 'Segoe UI', sans-serif`
- Gebruik dit font-stack voor zowel headings als body-tekst (de Rijkshuisstijl hanteert
  één sans-serif lettertypefamilie).
- **Titels op cover**: `font-weight: 400`, `font-size: 48px`
- **Slide-titels**: `font-weight: 700`, `font-size: 36px`
- **Body-tekst**: `font-size: 19px`, `line-height: 1.55`
- **Sectielabels**: `font-size: 15px`, `font-weight: 700`

### Logo

- Bestand: `assets/Belastingdienst_logo.png` (Rijkswapen + "Belastingdienst")
- Positie: bovenkant slide, horizontaal gecentreerd (iets rechts van midden: `left: 47.5%`)
- Hoogte: `17.2%` van de slide-hoogte
- Het logo staat op **elke slide** behalve wanneer de gebruiker anders aangeeft.

### Slide-afmetingen

- Breedte: `1122px`, Hoogte: `794px` (16:9-achtige verhouding)
- Deze maten worden consistent aangehouden op alle slide-typen.

## Slide-typen

Er zijn **6 slide-typen** beschikbaar. Lees de corresponderende HTML-template in `references/`
om de exacte layout, posities en clip-paths te gebruiken.

### 1. Cover Slide
- **Template**: `references/cover-slide.html`
- **Gebruik**: Altijd de eerste slide van elke presentatie
- **Kenmerken**: Lichtblauw L-vormig vlak linksboven, logo rechtsboven, titel in lintblauw,
  datum cursief eronder
- **Bevat**: Presentatietitel + datum

### 2. Content Slide
- **Template**: `references/content-slide.html`
- **Gebruik**: Standaard slide voor inhoud met tekst + visueel element
- **Kenmerken**: Tekst links (50%), lichtblauw achtergrondvlak rechts (50%),
  placeholder voor illustratie/visualisatie rechts
- **Bevat**: Sectielabel, slide-titel, body-tekst, optionele illustratie

### 3. Tekst Slide
- **Template**: `references/tekst-slide.html`
- **Gebruik**: Slides met alleen tekst, geen visueel element nodig
- **Kenmerken**: Volle breedte wit, tekst beperkt tot 75-80% breedte voor leesbaarheid
- **Bevat**: Sectielabel, slide-titel, body-tekst

### 4. Quote Slide (foto rechts)
- **Template**: `references/quote-slide-rechts.html`
- **Gebruik**: Citaten, stellingen, of impactvolle boodschappen met foto
- **Kenmerken**: Lichtblauw L-vlak links, grote titel, quote onderaan links, foto rechterhelft
- **Bevat**: Sectielabel, grote stelling/titel, quote met bron, foto-placeholder

### 5. Quote Slide (foto links)
- **Template**: `references/quote-slide-links.html`
- **Gebruik**: Variant van quote-slide met foto aan de linkerkant
- **Kenmerken**: Foto links (50%), lichtblauw vlak rechts, tekst rechts
- **Bevat**: Sectielabel, titel, ondertitel, quote-bron

### 6. Afsluiter Slide
- **Geen apart template** — genereer deze op basis van de cover-slide maar dan met:
  - Tekst "Vragen?" of "Bedankt" of passende afsluittekst
  - Optioneel contactgegevens
  - Zelfde L-vormig vlak en logo als de cover

## Automatische Slide-keuze

Bij het genereren van een presentatie kies je automatisch het beste slide-type per inhoud:

| Inhoud                                    | Slide-type              |
|-------------------------------------------|-------------------------|
| Eerste slide                              | Cover                   |
| Laatste slide                             | Afsluiter               |
| Tekst met een visueel element/voorbeeld   | Content Slide           |
| Alleen tekst / opsomming / uitleg         | Tekst Slide             |
| Impactvolle stelling + onderbouwing       | Quote Slide (rechts)    |
| Citaat of persoonlijke boodschap          | Quote Slide (links)     |

Wissel af tussen slide-typen voor visuele variatie. Vermijd meer dan 2 dezelfde typen
achter elkaar.

## Logische Presentatie-indeling

Een goede presentatie vertelt een verhaal. Gebruik de volgende structuur als basis en pas
aan op het onderwerp en de context. De indeling volgt het principe: **situatie → probleem →
oplossing → actie**.

### Standaard opbouw (8-12 slides)

| Nr | Onderdeel            | Doel                                                  | Slide-type          |
|----|----------------------|-------------------------------------------------------|---------------------|
| 1  | Cover                | Titel, datum, eventueel naam spreker                  | Cover               |
| 2  | Aanleiding / Context | Waarom zijn we hier? Wat is de achtergrond?            | Tekst Slide         |
| 3  | Probleemstelling     | Wat is het vraagstuk of de uitdaging?                  | Content Slide       |
| 4  | Kernboodschap        | De centrale stelling of visie                          | Quote Slide         |
| 5  | Analyse / Huidige situatie | Feiten, cijfers, bevindingen                     | Content Slide       |
| 6  | Oplossingsrichting   | Wat stellen we voor?                                   | Content Slide       |
| 7  | Aanpak / Hoe         | Concrete stappen, fasering, werkwijze                  | Tekst Slide         |
| 8  | Impact / Resultaat   | Wat levert het op? Wat verandert er?                   | Quote Slide         |
| 9  | Planning / Vervolg   | Tijdlijn, mijlpalen, volgende stappen                  | Tekst Slide         |
| 10 | Afsluiter            | "Vragen?" of "Bedankt" + contactgegevens               | Afsluiter           |

### Korte presentatie (4-6 slides)

Voor een bondige update of stand-van-zaken:

| Nr | Onderdeel         | Slide-type    |
|----|-------------------|---------------|
| 1  | Cover             | Cover         |
| 2  | Context + probleem| Tekst Slide   |
| 3  | Kernboodschap     | Quote Slide   |
| 4  | Voorstel / Aanpak | Content Slide |
| 5  | Vervolg           | Tekst Slide   |
| 6  | Afsluiter         | Afsluiter     |

### Uitgebreide presentatie (15+ slides)

Bij diepgaande onderwerpen of workshops:
- Voeg een **agenda-slide** toe na de cover (Tekst Slide met overzicht)
- Gebruik **tussenkopjes** (Quote Slides) om secties visueel te scheiden
- Wissel Content Slides en Tekst Slides af voor ritme
- Voeg eventueel een **samenvatting-slide** toe vóór de afsluiter

### Tips voor een goede opbouw

- **Eén boodschap per slide** — als je meer dan 4 zinnen nodig hebt, splits de slide
- **Begin met het "waarom"** — geef context voordat je de oplossing presenteert
- **Eindig met een concrete vraag of actie** — wat moet het publiek doen of onthouden?
- **Gebruik quote-slides als rustpunten** — ze geven het publiek even ademruimte
  tussen informatiedichte slides
- **Denk aan je publiek** — een presentatie voor bestuurders is korter en
  strategischer dan een presentatie voor een projectteam

## Werkwijze

### Stap 1: Lees de templates
Lees de relevante HTML-templates uit `references/` voordat je begint:
```
Read references/cover-slide.html
Read references/content-slide.html
Read references/tekst-slide.html
Read references/quote-slide-rechts.html
Read references/quote-slide-links.html
```

### Stap 2: Genereer de presentatie
Maak één HTML-bestand dat alle slides bevat. Elke slide is een `<div class="slide">` met
de juiste layout uit het template. Voeg navigatie toe (pijltjestoetsen / klik) zodat het
als een presentatie werkt in de browser.

### Stap 3: Logo embedden
Embed het logo als base64-afbeelding in het HTML-bestand zodat het standalone werkt:
```bash
base64 assets/Belastingdienst_logo.png
```
Gebruik het resultaat als `<img src="data:image/png;base64,...">`

### Stap 4: Presentatiefunctionaliteit toevoegen
Voeg aan het HTML-bestand toe:
- Pijltjestoetsen (links/rechts) voor navigatie
- Klik om door te gaan
- Slide-indicator (bijv. "3 / 12")
- Fullscreen-optie (F-toets)
- Vloeiende overgangen tussen slides

## Richtlijnen

### Taal en stijl
- Gebruik helder, zakelijk Nederlands
- Vermijd jargon tenzij het een vakpresentatie is
- Houd slides beknopt: maximaal 3-4 zinnen body-tekst per slide
- Gebruik **vetgedrukte tekst** spaarzaam voor nadruk op kernwoorden

### Visueel
- Geen clipart, decoratieve randen, of onnodige grafische elementen
- Gebruik de huisstijlkleuren, niet willekeurige kleuren
- Foto-placeholders mogen met een subtiele grijze gradient (zoals in de templates)
- Houd voldoende witruimte; overlaad slides niet

### Toegankelijkheid
- Alt-tekst op het logo en afbeeldingen
- Voldoende kleurcontrast (lintblauw op wit heeft uitstekend contrast)
- Logische leesstructuur in de HTML

## Voorbeeld

Als de gebruiker vraagt: "Maak een presentatie over de nieuwe digitale dienstverlening"

Dan genereer je een HTML-bestand met bijvoorbeeld:
1. **Cover**: "Nieuwe Digitale Dienstverlening" + datum
2. **Tekst Slide**: Aanleiding en context
3. **Content Slide**: Huidige situatie + visualisatie
4. **Quote Slide (rechts)**: Kernboodschap + foto
5. **Content Slide**: Oplossingsrichting + diagram
6. **Tekst Slide**: Planning en volgende stappen
7. **Afsluiter**: "Vragen?" + contactgegevens
