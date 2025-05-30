function setTheme(isDark) {
  const body = document.body;
  const button = document.querySelector('.theme-toggle');
  body.classList.remove('animating');
  if (isDark) {
    body.classList.add('dark-mode');
    button.textContent = '☀️ Modalità Chiara';
  } else {
    body.classList.remove('dark-mode');
    button.textContent = '🌙 Modalità Scura';
  }
}

function toggleDarkMode(event) {
  const body = document.body;
  const isDark = !body.classList.contains('dark-mode');
  const { clientX: x, clientY: y } = event;
  body.style.setProperty('--x', `${x}px`);
  body.style.setProperty('--y', `${y}px`);
  body.classList.add('animating');
    body.classList.remove('animating');
    localStorage.setItem('darkMode', isDark);
    setTheme(isDark);
}

function applyThemeOnLoad() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('darkMode');
  setTheme(savedTheme === null ? prefersDark : savedTheme === 'true');
    setTimeout(() => {
      document.body.style.visibility = 'visible';
    }, 400);
}

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const body   = document.body;

  function updateSpacing() {
    const h = header.offsetHeight;
    // 1) variabile CSS su :root (html)
    document.documentElement.style.setProperty('--header-height', `${h}px`);
    // 2) fallback diretto su body
    body.style.paddingTop = `${h}px`;
  }

  // calcola subito
  updateSpacing();

  // dopo ogni transizione di padding dell’header
  header.addEventListener('transitionend', e => {
    if (e.propertyName === 'padding') updateSpacing();
  });

  // scroll: aggiungi/rimuovi shrink
  window.addEventListener('scroll', () => {
    header.classList.toggle('shrink', window.scrollY > 0);
  });
});
