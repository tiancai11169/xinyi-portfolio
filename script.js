const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const sections = [...document.querySelectorAll('main section')];
const navLinks = [...document.querySelectorAll('.site-header nav > a[href^="#"], .site-header .nav-item > a[href^="#"]')];
const anchorLinks = [...document.querySelectorAll('a[href^="#"]')];
const portfolioCases = [...document.querySelectorAll('.portfolio-case')];
const portfolioPanels = [...document.querySelectorAll('.portfolio-detail-panel')];
const portfolioTabs = [...document.querySelectorAll('.portfolio-tab[data-case]')];
const portfolioDialog = document.querySelector('#portfolio-dialog');
const portfolioOpen = document.querySelector('.portfolio-open');
let currentCase = 0;

function setActiveNav(id) {
  navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${id}`));
}

function setPortfolioCase(index) {
  if (!portfolioCases.length) return;
  currentCase = (index + portfolioCases.length) % portfolioCases.length;
  portfolioCases.forEach((card, i) => card.classList.toggle('is-active', i === currentCase));
  portfolioPanels.forEach((panel, i) => panel.classList.toggle('is-active', i === currentCase));
  portfolioTabs.forEach((tab, i) => tab.classList.toggle('is-active', i === currentCase));
}

function openPortfolioDialog(index = currentCase) {
  if (!portfolioDialog) return;
  setPortfolioCase(index);
  portfolioDialog.showModal();
}

if (toggle && header) {
  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

anchorLinks.forEach(link => {
  link.addEventListener('click', event => {
    const id = link.hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    setActiveNav(id);
    header?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');

    if (link.dataset.case !== undefined) setPortfolioCase(Number(link.dataset.case));
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveNav(entry.target.id);
  });
}, { rootMargin: '-35% 0px -55%' });
sections.forEach(section => navObserver.observe(section));

document.querySelectorAll('.experience-card').forEach(card => {
  const button = card.querySelector('.experience-toggle');
  if (!button) return;

  button.addEventListener('click', () => {
    const isOpen = card.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

document.querySelectorAll('.readme-project-card').forEach(card => {
  const button = card.querySelector('.readme-project-toggle');
  if (!button) return;

  button.addEventListener('click', () => {
    const isOpen = card.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

document.querySelector('.portfolio-prev')?.addEventListener('click', () => setPortfolioCase(currentCase - 1));
document.querySelector('.portfolio-next')?.addEventListener('click', () => setPortfolioCase(currentCase + 1));

document.querySelectorAll('.portfolio-menu a[data-case]').forEach(link => {
  link.addEventListener('click', () => setPortfolioCase(Number(link.dataset.case)));
});

if (portfolioDialog) {
  portfolioOpen?.addEventListener('click', () => openPortfolioDialog());

  portfolioCases.forEach((card, index) => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', '查看作品详情');

    card.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      openPortfolioDialog(index);
    });

    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openPortfolioDialog(index);
    });
  });

  portfolioTabs.forEach(tab => {
    const index = Number(tab.dataset.case);
    tab.addEventListener('mouseenter', () => setPortfolioCase(index));
    tab.addEventListener('focus', () => setPortfolioCase(index));
    tab.addEventListener('click', () => openPortfolioDialog(index));
  });

  portfolioDialog.querySelector('.close')?.addEventListener('click', () => portfolioDialog.close());
  portfolioDialog.addEventListener('click', event => {
    if (event.target === portfolioDialog) portfolioDialog.close();
  });
}

setPortfolioCase(0);
setActiveNav((location.hash || '#home').slice(1));
