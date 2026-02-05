const tabs = document.querySelectorAll('.tab');
const templateGrid = document.getElementById('templateGrid');
const generateBtn = document.getElementById('generateBtn');
const previewTitle = document.querySelector('.cover-title');

const templatesByCategory = {
  rapportage: [
    { name: 'Gebruikerstest', meta: 'Cover + managementsamenvatting' },
    { name: 'Onderzoeksrapport', meta: 'Methodiek + bevindingen' },
    { name: 'Evaluatie', meta: 'Doelstellingen + conclusies' },
  ],
  presentatie: [
    { name: 'Projectupdate', meta: 'Voortgang + besluitpunten' },
    { name: 'Resultaten', meta: 'KPI dashboards + highlights' },
    { name: 'Voorstel', meta: 'Aanpak + impact' },
  ],
  infographic: [
    { name: 'Proces', meta: 'Stappen + rollen' },
    { name: 'Statistieken', meta: 'Data in visuele blokken' },
    { name: 'Tijdlijn', meta: 'Fases + mijlpalen' },
  ],
};

function renderTemplates(category) {
  templateGrid.innerHTML = '';
  templatesByCategory[category].forEach((template, index) => {
    const button = document.createElement('button');
    button.className = 'template-card' + (index === 0 ? ' active' : '');
    button.dataset.template = template.name;
    button.innerHTML = `
      <div class="template-label">${template.name}</div>
      <div class="template-meta">${template.meta}</div>
    `;
    button.addEventListener('click', () => selectTemplate(button));
    templateGrid.appendChild(button);
  });
  updatePreviewTitle(templatesByCategory[category][0].name);
}

function selectTemplate(button) {
  document.querySelectorAll('.template-card').forEach((card) => {
    card.classList.remove('active');
  });
  button.classList.add('active');
  updatePreviewTitle(button.dataset.template);
}

function updatePreviewTitle(templateName) {
  previewTitle.textContent = `${templateName} ${
    templateName === 'Projectupdate' || templateName === 'Resultaten' || templateName === 'Voorstel'
      ? 'Presentatie'
      : templateName === 'Proces' || templateName === 'Statistieken' || templateName === 'Tijdlijn'
        ? 'Infographic'
        : 'Rapportage'
  }`;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    renderTemplates(tab.dataset.tab);
  });
});

generateBtn.addEventListener('click', () => {
  generateBtn.textContent = 'Genereren...';
  setTimeout(() => {
    generateBtn.textContent = 'Genereer eerste versie';
  }, 900);
});

renderTemplates('rapportage');
