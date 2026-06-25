const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
if (toggle) toggle.addEventListener('click', () => { const open = header.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });

const sections = [...document.querySelectorAll('main section')];
const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
function showPanel(id) {
  const targetId = id || 'home';
  sections.forEach(section => {
    const active = section.id === targetId;
    section.classList.toggle('panel-active', active);
    if (active) section.querySelectorAll('.reveal').forEach(el => el.classList.add('show'));
  });
  navLinks.forEach(link => link.classList.toggle('active', link.hash === '#' + targetId));
  header.classList.remove('open');
  if (location.hash !== '#' + targetId) history.replaceState(null, '', '#' + targetId);
}
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const id = link.hash.slice(1);
    if (!document.getElementById(id)) return;
    event.preventDefault();
    showPanel(id);
    if (link.dataset.case) setPortfolioCase(Number(link.dataset.case));
  });
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); }), { threshold: .14 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const dialog = document.querySelector('#note-dialog');
if (dialog) {
  const dialogText = dialog.querySelector('.dialog-text');
  document.querySelectorAll('.note-card').forEach(card => card.addEventListener('click', () => { dialogText.textContent = card.dataset.note; dialog.showModal(); }));
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
}

document.querySelectorAll('.experience-card').forEach(card => {
  const toggleButton = card.querySelector('.experience-toggle');
  if (!toggleButton) return;
  toggleButton.addEventListener('click', () => {
    const isOpen = card.classList.toggle('is-open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });
});

const notebookDialog = document.querySelector('#notebook-dialog');
const openNotebook = document.querySelector('.open-notebook');
if (notebookDialog && openNotebook) {
  openNotebook.addEventListener('click', () => notebookDialog.showModal());
  notebookDialog.querySelector('.close').addEventListener('click', () => notebookDialog.close());
  notebookDialog.addEventListener('click', e => { if (e.target === notebookDialog) notebookDialog.close(); });
}

let currentCase = 0;
const portfolioCases = [...document.querySelectorAll('.portfolio-case')];
const portfolioPanels = [...document.querySelectorAll('.portfolio-detail-panel')];
function setPortfolioCase(index) {
  if (!portfolioCases.length) return;
  currentCase = (index + portfolioCases.length) % portfolioCases.length;
  portfolioCases.forEach((card, i) => card.classList.toggle('is-active', i === currentCase));
  portfolioPanels.forEach((panel, i) => panel.classList.toggle('is-active', i === currentCase));
}
document.querySelector('.portfolio-prev')?.addEventListener('click', () => setPortfolioCase(currentCase - 1));
document.querySelector('.portfolio-next')?.addEventListener('click', () => setPortfolioCase(currentCase + 1));

document.querySelectorAll('.portfolio-menu a[data-case]').forEach(link => {
  link.addEventListener('click', () => setPortfolioCase(Number(link.dataset.case)));
});
const portfolioDialog = document.querySelector('#portfolio-dialog');
const portfolioOpen = document.querySelector('.portfolio-open');
if (portfolioDialog && portfolioOpen) {
  portfolioOpen.addEventListener('click', () => portfolioDialog.showModal());
  portfolioDialog.querySelector('.close').addEventListener('click', () => portfolioDialog.close());
  portfolioDialog.addEventListener('click', e => { if (e.target === portfolioDialog) portfolioDialog.close(); });
}

showPanel((location.hash || '#home').slice(1));
