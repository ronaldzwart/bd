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

const sectionMap = {
  templates: { el: document.getElementById('sectionTemplates'), title: 'Templates' },
  bronnen: { el: document.getElementById('sectionBronnen'), title: 'Bronnen' },
  preview: { el: document.getElementById('sectionPreview'), title: 'Preview' },
  export: { el: document.getElementById('sectionExport'), title: 'Exporteren' },
};

const templatesByCategory = [
  {
    id: 'presentaties',
    label: 'Presentaties',
    templates: [
      { name: 'Projectupdate', meta: 'Voortgang + besluitpunten' },
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

const sources = [];
let isGenerating = false;
let hasGenerated = false;

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

  // Update sections
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

  // Mark completed steps in sidebar
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

  // Update stepper
  document.querySelectorAll('.stepper-step').forEach(function (step, i) {
    step.classList.remove('active', 'completed');
    if (i < newIndex) {
      step.classList.add('completed');
    } else if (i === newIndex) {
      step.classList.add('active');
    }
  });

  // Update stepper lines
  document.querySelectorAll('.stepper-line').forEach(function (line, i) {
    line.classList.remove('completed');
    if (i < newIndex) {
      line.classList.add('completed');
    }
  });

  // Update step indicator
  if (stepIndicator) {
    stepIndicator.textContent = 'Stap ' + (newIndex + 1) + ' van 4';
  }

  currentStepIndex = newIndex;

  // Auto-generate when navigating to preview
  if (sectionKey === 'preview' && !hasGenerated && !isGenerating) {
    startGeneration();
  }
}

// Sidebar nav clicks
document.querySelectorAll('.nav-item').forEach(function (item) {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    var section = this.getAttribute('data-section');
    switchSection(section);
  });
});

// Stepper clicks
document.querySelectorAll('.stepper-step').forEach(function (step) {
  step.addEventListener('click', function () {
    var section = this.getAttribute('data-step');
    switchSection(section);
  });
});

// Next/Previous buttons
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
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
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
  sources.forEach((source) => {
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
    sub.textContent = `${source.type || 'Bestand'} \u00B7 ${formatBytes(source.size)}`;
    info.appendChild(title);
    info.appendChild(sub);

    const renameBtn = document.createElement('button');
    renameBtn.className = 'chip';
    renameBtn.type = 'button';
    renameBtn.textContent = 'Hernoem';
    renameBtn.addEventListener('click', () => {
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
    removeBtn.addEventListener('click', () => {
      if (source.previewUrl) {
        URL.revokeObjectURL(source.previewUrl);
      }
      const index = sources.findIndex((item) => item.id === source.id);
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
  return new Promise((resolve) => {
    const textTypes = ['text/', 'application/json', 'application/xml', 'application/csv'];
    const textExtensions = ['.txt', '.csv', '.md', '.json', '.xml', '.html', '.htm', '.log'];
    const isText = textTypes.some(t => file.type.startsWith(t)) ||
                   textExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (isText) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    } else {
      resolve(null);
    }
  });
}

async function addFiles(fileList) {
  for (const file of Array.from(fileList)) {
    const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(16).slice(2)}`;
    const content = await readFileContent(file);
    const source = {
      id,
      name: file.name,
      size: file.size,
      type: file.type ? file.type.split('/')[1]?.toUpperCase() : 'Bestand',
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
  templatesByCategory.forEach((group, groupIndex) => {
    const details = document.createElement('details');
    details.className = 'template-group';
    details.open = groupIndex === 0;

    const summary = document.createElement('summary');
    summary.textContent = group.label;
    const summaryNote = document.createElement('span');
    summaryNote.textContent = `${group.templates.length + 1} templates`;
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
    newCard.innerHTML = `
      <div class="template-thumb template-plus">+</div>
      <div class="template-label">Nieuwe template</div>
      <div class="template-meta">Start met een leeg template</div>
    `;
    newCard.addEventListener('click', () => selectTemplate(newCard));
    list.appendChild(newCard);

    group.templates.forEach((template, templateIndex) => {
      const button = document.createElement('button');
      button.className = 'template-card' + (groupIndex === 0 && templateIndex === 0 ? ' active' : '');
      button.dataset.template = template.name;
      button.innerHTML = `
        <div class="template-thumb">Preview</div>
        <div class="template-label">${template.name}</div>
        <div class="template-meta">${template.meta}</div>
      `;
      button.addEventListener('click', () => selectTemplate(button));
      list.appendChild(button);
    });

    details.appendChild(list);
    templateAccordion.appendChild(details);

    details.addEventListener('toggle', () => {
      if (details.open) {
        templateAccordion.querySelectorAll('details').forEach((other) => {
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
    list.style.maxHeight = `${list.scrollHeight}px`;
  } else {
    list.classList.remove('open');
    list.style.maxHeight = '0px';
  }
}

function selectTemplate(button) {
  document.querySelectorAll('.template-card').forEach((card) => {
    card.classList.remove('active');
  });
  button.classList.add('active');
  hasGenerated = false;
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

const LOGO_SVG = `<svg viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Inter,sans-serif" font-size="12" font-weight="700" fill="#fff">Belastingdienst</text></svg>`;


let slides = [];
let currentSlide = 0;

function createSlide(type, data) {
  const defaults = {
    cover: { title: 'Titel van de presentatie', date: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) },
    content: { title: 'Onderwerp', items: ['Eerste punt van bespreking', 'Tweede punt met toelichting', 'Derde belangrijk punt', 'Vierde punt of conclusie'] },
    text: { title: 'Onderwerp', paragraph1: 'Hier kunt u een uitgebreide toelichting geven op het onderwerp. Deze tekst kan worden aangepast door erop te klikken.', paragraph2: 'Een tweede alinea met aanvullende informatie, context of achtergrond bij het onderwerp dat wordt gepresenteerd.' },
    'quote-right': { quote: 'Hier komt een inspirerend of belangrijk citaat dat relevant is voor de presentatie.', author: '\u2014 Naam Auteur, Functie' },
    'quote-left': { quote: 'Hier komt een inspirerend of belangrijk citaat dat relevant is voor de presentatie.', author: '\u2014 Naam Auteur, Functie' },
  };
  return { type, data: data || { ...defaults[type] }, id: Date.now() + Math.random() };
}

function renderSlideHTML(slide, editable) {
  const ce = editable ? 'contenteditable="true"' : '';
  const d = slide.data;
  const header = `<div class="slide-header-bar"><div class="slide-logo">${LOGO_SVG}</div></div>`;

  switch (slide.type) {
    case 'cover':
      return `<div class="slide-frame slide-cover">
        <div class="slide-cover-vlak"></div>
        <div class="slide-cover-logo"><img src="Belastingdienst_logo.png" alt="Belastingdienst"></div>
        <div class="slide-cover-textblock">
          <div class="slide-cover-title" ${ce} data-field="title">${d.title}</div>
          <div class="slide-cover-date" ${ce} data-field="date">${d.date}</div>
        </div>
      </div>`;
    case 'content':
      const items = (d.items || []).map((item, i) => `<li ${ce} data-field="items" data-index="${i}">${item}</li>`).join('');
      return `<div class="slide-frame slide-content-slide">${header}<div class="slide-content-body"><div class="slide-content-left"><div class="slide-content-title" ${ce} data-field="title">${d.title}</div><ul class="slide-content-list">${items}</ul></div><div class="slide-content-right">Afbeelding</div></div></div>`;
    case 'text':
      return `<div class="slide-frame slide-text-slide">${header}<div class="slide-text-body"><div class="slide-text-title" ${ce} data-field="title">${d.title}</div><div class="slide-text-paragraph" ${ce} data-field="paragraph1">${d.paragraph1}</div><div class="slide-text-paragraph" ${ce} data-field="paragraph2">${d.paragraph2}</div></div></div>`;
    case 'quote-right':
      return `<div class="slide-frame slide-quote-slide">${header}<div class="slide-quote-body"><div class="slide-quote-image">Afbeelding</div><div class="slide-quote-content"><div class="slide-quote-mark">\u201C</div><div class="slide-quote-text" ${ce} data-field="quote">${d.quote}</div><div class="slide-quote-author" ${ce} data-field="author">${d.author}</div></div></div></div>`;
    case 'quote-left':
      return `<div class="slide-frame slide-quote-slide">${header}<div class="slide-quote-body"><div class="slide-quote-content"><div class="slide-quote-mark">\u201C</div><div class="slide-quote-text" ${ce} data-field="quote">${d.quote}</div><div class="slide-quote-author" ${ce} data-field="author">${d.author}</div></div><div class="slide-quote-image">Afbeelding</div></div></div>`;
    default:
      return '';
  }
}

/* ── Belastingdienst Huisstijl ── */
function isBDTemplate() {
  return getSelectedTemplate() === 'Projectupdate';
}

function renderBDSlideHTML(slide, editable) {
  const ce = editable ? 'contenteditable="true"' : '';
  const d = slide.data;
  const logo = '<div class="bd-logo"><img src="Belastingdienst_logo.png" alt="Belastingdienst"></div>';

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

function renderCurrentSlide() {
  if (slides.length === 0) return;
  const slide = slides[currentSlide];
  slideCanvas.innerHTML = isBDTemplate() ? renderBDSlideHTML(slide, true) : renderSlideHTML(slide, true);
  slideCounter.textContent = `Slide ${currentSlide + 1} van ${slides.length}`;

  // Bind editable fields
  slideCanvas.querySelectorAll('[contenteditable]').forEach(el => {
    el.addEventListener('blur', () => {
      const field = el.getAttribute('data-field');
      const index = el.getAttribute('data-index');
      if (field === 'items' && index !== null) {
        slide.data.items[parseInt(index)] = el.textContent;
      } else {
        slide.data[field] = el.textContent;
      }
      renderThumbs();
    });
  });
}

function renderThumbs() {
  slideThumbs.innerHTML = '';
  slides.forEach((slide, i) => {
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
      del.addEventListener('click', (e) => {
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
    inner.innerHTML = isBDTemplate() ? renderBDSlideHTML(slide, false) : renderSlideHTML(slide, false);
    const scale = 0.18;
    inner.style.transform = `scale(${scale})`;
    inner.style.width = (1 / scale * 100) + '%';
    inner.style.height = (1 / scale * 100) + '%';
    thumb.appendChild(inner);

    thumb.addEventListener('click', () => {
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

prevSlideBtn.addEventListener('click', () => {
  if (currentSlide > 0) {
    currentSlide--;
    renderCurrentSlide();
    renderThumbs();
  }
});

nextSlideBtn.addEventListener('click', () => {
  if (currentSlide < slides.length - 1) {
    currentSlide++;
    renderCurrentSlide();
    renderThumbs();
  }
});

addSlideBtn.addEventListener('click', () => {
  slideTypePicker.classList.toggle('open');
});

document.querySelectorAll('.slide-type-option').forEach(btn => {
  btn.addEventListener('click', () => {
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
  let text = '';
  sources.forEach((source, i) => {
    text += `\n--- Bron ${i + 1}: ${source.name} ---\n`;
    if (source.content) {
      // Limit to 8000 chars per source to stay within token limits
      const trimmed = source.content.length > 8000
        ? source.content.substring(0, 8000) + '\n[... ingekort ...]'
        : source.content;
      text += trimmed + '\n';
    } else {
      text += `(Bestandstype: ${source.type}, ${formatBytes(source.size)} - inhoud niet leesbaar als tekst)\n`;
    }
  });
  return text;
}

function buildPrompt() {
  const templateName = getSelectedTemplate();
  const sourcesText = getSourcesText();
  const userPrompt = document.querySelector('.prompt-row .input').value.trim();
  const bd = isBDTemplate();

  const bdSystem = `Je bent een presentatie-generator voor de Belastingdienst (Rijkshuisstijl).
Je maakt professionele slide-presentaties op basis van bronmateriaal.

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
- Schrijf in helder, zakelijk Nederlands
- Houd slides beknopt: max 3-4 zinnen body-tekst per slide
- Wissel af tussen slide-typen voor visuele variatie
- Elk slide-type heeft een "section" veld (kort label, bijv. "Aanleiding", "Analyse", "Voorstel")
- content slides: body is HTML-tekst (gebruik <strong> voor nadruk)
- Gebruik de bronnen als basis voor de inhoud`;

  const defaultSystem = `Je bent een presentatie-generator. Je maakt professionele slide-presentaties op basis van bronmateriaal.

Je MOET antwoorden met ALLEEN valid JSON, geen markdown, geen uitleg, geen tekst ervoor of erna.

Het JSON-formaat is:
{
  "slides": [
    {
      "type": "cover",
      "data": { "title": "...", "date": "..." }
    },
    {
      "type": "content",
      "data": { "title": "...", "items": ["...", "...", "...", "..."] }
    },
    {
      "type": "text",
      "data": { "title": "...", "paragraph1": "...", "paragraph2": "..." }
    },
    {
      "type": "quote-right",
      "data": { "quote": "...", "author": "— Naam, Functie" }
    }
  ]
}

Beschikbare slide types: cover, content, text, quote-right, quote-left
- De eerste slide MOET type "cover" zijn
- Genereer 5-8 slides
- content slides hebben 3-5 items
- Schrijf in het Nederlands
- Maak de content professioneel en zakelijk
- Gebruik de bronnen als basis voor de inhoud`;

  const system = bd ? bdSystem : defaultSystem;

  let userMessage = `Template type: ${templateName}\n`;
  if (userPrompt) {
    userMessage += `\nAanvullende instructie: ${userPrompt}\n`;
  }
  if (sources.length > 0) {
    userMessage += `\nBronmateriaal:\n${sourcesText}`;
  } else {
    userMessage += `\nEr zijn geen bronnen toegevoegd. Genereer een voorbeeld-presentatie passend bij het template type.`;
  }
  userMessage += `\n\nGenereer nu de presentatie als JSON.`;

  return { system, userMessage };
}

async function callClaudeAPI(system, userMessage) {
  const apiKey = getApiKey();
  const proxyUrl = 'proxy.php';

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
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error('Ongeldige API key. Controleer je key via het sleutel-icoon rechtsboven.');
    }
    throw new Error(errorData.error?.message || errorData.error || `API fout (${response.status})`);
  }

  const data = await response.json();

  // Extract text from Claude response
  const textBlock = data.content?.find(b => b.type === 'text');
  if (!textBlock) {
    throw new Error('Geen tekst ontvangen van de API.');
  }

  return textBlock.text;
}

function parseSlideJSON(text) {
  // Try to extract JSON from the response
  let jsonStr = text.trim();

  // Remove markdown code fences if present
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);
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
  const existing = generatingOverlay.querySelector('.generating-error');
  if (existing) existing.remove();

  const spinner = generatingOverlay.querySelector('.generating-spinner');
  if (spinner) spinner.style.display = 'none';

  generatingOverlay.querySelector('.generating-title').textContent = 'Genereren mislukt';

  const errorEl = document.createElement('div');
  errorEl.className = 'generating-error';
  errorEl.textContent = message;

  const retryBtn = document.createElement('button');
  retryBtn.className = 'btn primary';
  retryBtn.textContent = 'Opnieuw proberen';
  retryBtn.style.marginTop = '12px';
  retryBtn.addEventListener('click', () => {
    startGeneration();
  });

  const content = generatingOverlay.querySelector('.generating-content');
  content.appendChild(errorEl);
  content.appendChild(retryBtn);
}

function resetOverlay() {
  const spinner = generatingOverlay.querySelector('.generating-spinner');
  if (spinner) spinner.style.display = '';
  generatingOverlay.querySelector('.generating-title').textContent = 'Presentatie genereren...';
  const existing = generatingOverlay.querySelector('.generating-error');
  if (existing) existing.remove();
  const retryBtn = generatingOverlay.querySelector('.btn.primary');
  if (retryBtn && retryBtn.textContent === 'Opnieuw proberen') retryBtn.remove();
  updateProgress(0, 'Bronnen analyseren');
}

async function startGeneration() {
  if (isGenerating) return;

  // Check API key
  if (!getApiKey()) {
    openApiKeyDialog();
    return;
  }

  isGenerating = true;
  resetOverlay();
  showOverlay(true);

  try {
    updateProgress(15, 'Bronnen analyseren...');
    const { system, userMessage } = buildPrompt();

    updateProgress(30, 'Presentatie genereren via Claude...');
    const responseText = await callClaudeAPI(system, userMessage);

    updateProgress(70, 'Slides opbouwen...');
    const slideData = parseSlideJSON(responseText);

    updateProgress(90, 'Presentatie laden...');

    // Build slides from API response
    slides = slideData.map(s => {
      const validTypes = ['cover', 'content', 'text', 'quote-right', 'quote-left'];
      const type = validTypes.includes(s.type) ? s.type : 'text';
      return createSlide(type, s.data);
    });

    if (slides.length === 0) {
      slides = [createSlide('cover')];
    }

    currentSlide = 0;
    updateProgress(100, 'Klaar!');

    // Short delay to show 100% before hiding overlay
    await new Promise(r => setTimeout(r, 500));

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
generateBtn.addEventListener('click', () => {
  hasGenerated = false;
  startGeneration();
});

/* ── File Upload ── */
fileButton.addEventListener('click', () => {
  fileInput.click();
});

pasteButton.addEventListener('click', () => {
  pasteBox.classList.toggle('active');
  if (pasteBox.classList.contains('active')) {
    const textarea = pasteBox.querySelector('textarea');
    textarea.focus();
  }
});

// Save pasted text as source
pasteBox.querySelector('textarea').addEventListener('blur', function () {
  const text = this.value.trim();
  if (text) {
    const existing = sources.find(s => s.id === 'pasted-text');
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

uploadDrop.addEventListener('click', (event) => {
  if (event.target !== fileButton && event.target !== pasteButton) {
    fileInput.click();
  }
});

fileInput.addEventListener('change', (event) => {
  if (event.target.files.length > 0) {
    addFiles(event.target.files);
    fileInput.value = '';
  }
});

['dragenter', 'dragover'].forEach((eventName) => {
  uploadDrop.addEventListener(eventName, (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadDrop.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  uploadDrop.addEventListener(eventName, (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadDrop.classList.remove('dragover');
  });
});

uploadDrop.addEventListener('drop', (event) => {
  if (event.dataTransfer.files.length > 0) {
    addFiles(event.dataTransfer.files);
  }
});

/* ── Init ── */
renderTemplates();
renderSources();
