/* ══════════════════════════════════════════════════════════════
   Content Generator v2.0 – Skill-based Architecture

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
  'belastingdienst-huisstijl': {
    id: 'belastingdienst-huisstijl',
    name: 'Belastingdienst Huisstijl',
    useBDRendering: true,
    system: `Je bent een presentatie-generator voor de Belastingdienst in de officiële Rijkshuisstijl.
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
};

/* ── Template → Skill Mapping ──
   Hier koppel je templates aan skills.
   Een template kan één skill hebben, of een array van skills (combinatie).
   Templates zonder skill gebruiken de default rendering/prompt.
   ── */

const TEMPLATE_SKILL_MAP = {
  'Projectupdate': ['belastingdienst-huisstijl'],
  // Voeg hier meer mappings toe, bijv:
  // 'Resultaten': ['belastingdienst-huisstijl'],
  // 'Voorstel': ['belastingdienst-huisstijl', 'another-skill'],
};

/* ── Template Definitions ── */
const templatesByCategory = [
  {
    id: 'presentaties',
    label: 'Presentaties',
    templates: [
      { name: 'Projectupdate', meta: 'Voortgang + besluitpunten', skill: 'belastingdienst-huisstijl' },
      { name: 'Resultaten', meta: 'KPI dashboards + highlights' },
      { name: 'Voorstel', meta: 'Aanpak + impact' },
    ],
  },
  {
    id: 'rapportages',
    label: 'Rapportages',
    templates: [
      { name: 'Gebruikerstest', meta: 'Cover + managementsamenvatting' },
      { name: 'Onderzoeksrapport', meta: 'Methodiek + bevindingen' },
      { name: 'Evaluatie', meta: 'Doelstellingen + conclusies' },
    ],
  },
  {
    id: 'infographics',
    label: 'Infographics',
    templates: [
      { name: 'Proces', meta: 'Stappen + rollen' },
      { name: 'Statistieken', meta: 'Data in visuele blokken' },
      { name: 'Tijdlijn', meta: 'Fases + mijlpalen' },
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
// BD_LOGO_BASE64 is loaded from logo.js
function getBDLogoSrc() {
  return typeof BD_LOGO_BASE64 !== 'undefined' ? BD_LOGO_BASE64 : '../.claude/skills/belastingdienst-huisstijl/assets/Belastingdienst_logo.png';
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
    startGeneration();
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
    details.open = groupIndex === 0;

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
    newCard.dataset.template = 'Nieuwe template';
    newCard.innerHTML =
      '<div class="template-thumb template-plus">+</div>' +
      '<div class="template-label">Nieuwe template</div>' +
      '<div class="template-meta">Start met een leeg template</div>';
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

const LOGO_SVG = '<svg viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Inter,sans-serif" font-size="12" font-weight="700" fill="#fff">Belastingdienst</text></svg>';

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
        '<div class="slide-cover-logo"><img src="Belastingdienst_logo.png" alt="Belastingdienst"></div>' +
        '<div class="slide-cover-textblock">' +
          '<div class="slide-cover-title" ' + ce + ' data-field="title">' + d.title + '</div>' +
          '<div class="slide-cover-date" ' + ce + ' data-field="date">' + d.date + '</div>' +
        '</div></div>';
    case 'content':
      var items = (d.items || []).map(function(item, i) { return '<li ' + ce + ' data-field="items" data-index="' + i + '">' + item + '</li>'; }).join('');
      return '<div class="slide-frame slide-content-slide">' + header + '<div class="slide-content-body"><div class="slide-content-left"><div class="slide-content-title" ' + ce + ' data-field="title">' + d.title + '</div><ul class="slide-content-list">' + items + '</ul></div><div class="slide-content-right">Afbeelding</div></div></div>';
    case 'text':
      return '<div class="slide-frame slide-text-slide">' + header + '<div class="slide-text-body"><div class="slide-text-title" ' + ce + ' data-field="title">' + d.title + '</div><div class="slide-text-paragraph" ' + ce + ' data-field="paragraph1">' + d.paragraph1 + '</div><div class="slide-text-paragraph" ' + ce + ' data-field="paragraph2">' + d.paragraph2 + '</div></div></div>';
    case 'quote-right':
      return '<div class="slide-frame slide-quote-slide">' + header + '<div class="slide-quote-body"><div class="slide-quote-image">Afbeelding</div><div class="slide-quote-content"><div class="slide-quote-mark">\u201C</div><div class="slide-quote-text" ' + ce + ' data-field="quote">' + d.quote + '</div><div class="slide-quote-author" ' + ce + ' data-field="author">' + d.author + '</div></div></div></div>';
    case 'quote-left':
      return '<div class="slide-frame slide-quote-slide">' + header + '<div class="slide-quote-body"><div class="slide-quote-content"><div class="slide-quote-mark">\u201C</div><div class="slide-quote-text" ' + ce + ' data-field="quote">' + d.quote + '</div><div class="slide-quote-author" ' + ce + ' data-field="author">' + d.author + '</div></div><div class="slide-quote-image">Afbeelding</div></div></div>';
    default:
      return '';
  }
}

/* ── Belastingdienst Huisstijl Slide Rendering (skill-based) ── */
function renderBDSlideHTML(slide, editable) {
  const ce = editable ? 'contenteditable="true"' : '';
  const d = slide.data;
  const logoSrc = getBDLogoSrc();
  const logo = '<div class="bd-logo"><img src="' + logoSrc + '" alt="Belastingdienst"></div>';

  switch (slide.type) {
    case 'cover':
      return '<div class="slide-frame slide-cover">' +
        '<div class="slide-cover-vlak"></div>' +
        '<div class="slide-cover-logo"><img src="' + logoSrc + '" alt="Belastingdienst"></div>' +
        '<div class="slide-cover-textblock">' +
          '<div class="slide-cover-title" ' + ce + ' data-field="title">' + d.title + '</div>' +
          '<div class="slide-cover-date" ' + ce + ' data-field="date">' + (d.date || '') + '</div>' +
        '</div></div>';
    case 'content':
      return '<div class="slide-frame bd-content-slide">' + logo +
        '<div class="bd-right-block"></div>' +
        '<div class="bd-left-area">' +
          '<div class="bd-section-label" ' + ce + ' data-field="section">' + (d.section || '') + '</div>' +
          '<h2 class="bd-slide-title" ' + ce + ' data-field="title">' + d.title + '</h2>' +
          '<div class="bd-slide-body" ' + ce + ' data-field="body">' + (d.body || (d.items || []).join('. ')) + '</div>' +
        '</div>' +
        '<div class="bd-illustration-placeholder">Illustratie of<br>visualisatie</div>' +
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
        '<div class="bd-photo-right"><div class="bd-photo-placeholder">Foto</div></div>' +
        '</div>';
    case 'quote-left':
      return '<div class="slide-frame bd-quote-left">' + logo +
        '<div class="bd-photo-left"><div class="bd-photo-placeholder">Foto</div></div>' +
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
  if (sources.length > 0) {
    userMessage += '\nBronmateriaal:\n' + sourcesText;
  } else {
    userMessage += '\nEr zijn geen bronnen toegevoegd. Genereer een voorbeeld-presentatie passend bij het template type.';
  }
  userMessage += '\n\nGenereer nu de presentatie als JSON.';

  return { system: system, userMessage: userMessage };
}

async function callClaudeAPI(system, userMessage) {
  const apiKey = getApiKey();
  const proxyUrl = window.location.origin + '/proxy.php';

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      system: system,
      messages: [{ role: 'user', content: userMessage }],
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
    }),
  });

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
  generatingOverlay.querySelector('.generating-title').textContent = 'Presentatie genereren...';
  var existing = generatingOverlay.querySelector('.generating-error');
  if (existing) existing.remove();
  var retryBtn = generatingOverlay.querySelector('.btn.primary');
  if (retryBtn && retryBtn.textContent === 'Opnieuw proberen') retryBtn.remove();
  updateProgress(0, 'Bronnen analyseren');
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

  try {
    updateProgress(15, 'Bronnen analyseren...');
    var prompt = buildPrompt();

    updateProgress(30, 'Genereren via ' + skillNames + '...');
    var responseText = await callClaudeAPI(prompt.system, prompt.userMessage);

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
    updateProgress(100, 'Klaar!');

    await new Promise(function(r) { setTimeout(r, 500); });

    showOverlay(false);
    hasGenerated = true;
    renderCurrentSlide();
    renderThumbs();
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

/* ── Init ── */
renderTemplates();
renderSources();
updateSkillBadge();
