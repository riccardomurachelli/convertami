// theme.js
function setTheme(isDark) {
    const body = document.body;
    const button = document.querySelector('.theme-toggle');
    if (isDark) {
      body.classList.add('dark-mode');
      button.textContent = 'Modalità Chiara';
    } else {
      body.classList.remove('dark-mode');
      button.textContent = 'Modalità Scura';
    }
  }
  
  function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    setTheme(isDark);
  }
  
  function applyThemeOnLoad() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme === null) {
      // Se nessuna preferenza salvata, usa il tema del browser
      setTheme(prefersDark);
    } else {
      setTheme(savedTheme === 'true');
    }
  }
  
  // Applica il tema al caricamento della pagina
  document.addEventListener('DOMContentLoaded', applyThemeOnLoad);