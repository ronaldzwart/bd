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
  if (!bytes && bytes !== 0) return '—';
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
    sub.textContent = `${source.type || 'Bestand'} · ${formatBytes(source.size)}`;
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
      }
    });

    item.appendChild(thumb);
    item.appendChild(info);
    item.appendChild(renameBtn);
    item.appendChild(removeBtn);
    sourceList.appendChild(item);
  });
}

function addFiles(fileList) {
  Array.from(fileList).forEach((file) => {
    const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(16).slice(2)}`;
    const source = {
      id,
      name: file.name,
      size: file.size,
      type: file.type ? file.type.split('/')[1]?.toUpperCase() : 'Bestand',
      label: getFileLabel(file),
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    };
    sources.unshift(source);
  });
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
    summaryChevron.textContent = '⌄';
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
    cover: { title: 'Titel van de presentatie', subtitle: 'Ondertitel of korte beschrijving', date: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) },
    content: { title: 'Onderwerp', items: ['Eerste punt van bespreking', 'Tweede punt met toelichting', 'Derde belangrijk punt', 'Vierde punt of conclusie'] },
    text: { title: 'Onderwerp', paragraph1: 'Hier kunt u een uitgebreide toelichting geven op het onderwerp. Deze tekst kan worden aangepast door erop te klikken.', paragraph2: 'Een tweede alinea met aanvullende informatie, context of achtergrond bij het onderwerp dat wordt gepresenteerd.' },
    'quote-right': { quote: 'Hier komt een inspirerend of belangrijk citaat dat relevant is voor de presentatie.', author: '— Naam Auteur, Functie' },
    'quote-left': { quote: 'Hier komt een inspirerend of belangrijk citaat dat relevant is voor de presentatie.', author: '— Naam Auteur, Functie' },
  };
  return { type, data: data || { ...defaults[type] }, id: Date.now() + Math.random() };
}

function renderSlideHTML(slide, editable) {
  const ce = editable ? 'contenteditable="true"' : '';
  const d = slide.data;
  const header = `<div class="slide-header-bar"><div class="slide-logo">${LOGO_SVG}</div></div>`;

  switch (slide.type) {
    case 'cover':
      return `<div class="slide-frame slide-cover">${header}<div class="slide-body"><div class="slide-cover-line"></div><div class="slide-cover-title" ${ce} data-field="title">${d.title}</div><div class="slide-cover-subtitle" ${ce} data-field="subtitle">${d.subtitle}</div><div class="slide-cover-date" ${ce} data-field="date">${d.date}</div></div></div>`;
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

function renderCurrentSlide() {
  if (slides.length === 0) return;
  const slide = slides[currentSlide];
  slideCanvas.innerHTML = renderSlideHTML(slide, true);
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
    inner.innerHTML = renderSlideHTML(slide, false);
    // Scale down the content
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

// Init slides when preview section becomes active
const origSwitchSection = switchSection;
switchSection = function(sectionKey) {
  origSwitchSection(sectionKey);
  if (sectionKey === 'preview' && slides.length === 0) {
    initSlides();
  }
};

/* ── Generate ── */
generateBtn.addEventListener('click', () => {
  generateBtn.classList.add('secondary');
  generateBtn.textContent = 'Genereer nogmaals';
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
