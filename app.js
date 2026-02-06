const generateBtn = document.getElementById('generateBtn');
const previewTitle = document.querySelector('.cover-title');
const templateAccordion = document.getElementById('templateAccordion');
const uploadDrop = document.getElementById('uploadDrop');
const fileInput = document.getElementById('fileInput');
const fileButton = document.getElementById('fileButton');
const sourceList = document.getElementById('sourceList');
const sourceEmpty = document.getElementById('sourceEmpty');

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

function renderTemplates() {
  templateAccordion.innerHTML = '';
  templatesByCategory.forEach((group, groupIndex) => {
    const details = document.createElement('details');
    details.className = 'template-group';
    details.open = groupIndex === 0;

    const summary = document.createElement('summary');
    summary.textContent = group.label;
    const summaryNote = document.createElement('span');
    summaryNote.textContent = `${group.templates.length} templates`;
    summary.appendChild(summaryNote);
    details.appendChild(summary);

    const list = document.createElement('div');
    list.className = 'template-list';

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
  });
  updatePreviewTitle(templatesByCategory[0].templates[0].name);
}

function selectTemplate(button) {
  document.querySelectorAll('.template-card').forEach((card) => {
    card.classList.remove('active');
  });
  button.classList.add('active');
  updatePreviewTitle(button.dataset.template);
}

function updatePreviewTitle(templateName) {
  if (!previewTitle) return;
  previewTitle.textContent = `${templateName} ${
    templateName === 'Projectupdate' || templateName === 'Resultaten' || templateName === 'Voorstel'
      ? 'Presentatie'
      : templateName === 'Proces' || templateName === 'Statistieken' || templateName === 'Tijdlijn'
        ? 'Infographic'
        : 'Rapportage'
  }`;
}

generateBtn.addEventListener('click', () => {
  generateBtn.textContent = 'Genereren...';
  setTimeout(() => {
    generateBtn.textContent = 'Genereren';
  }, 900);
});

fileButton.addEventListener('click', () => {
  fileInput.click();
});

uploadDrop.addEventListener('click', (event) => {
  if (event.target !== fileButton) {
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

renderTemplates();
renderSources();
