// Script pour credits.html (placeholder DaisyUI + dark mode)
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.checked = theme === 'dark';
  }
  themeToggle.addEventListener('change', () => {
    setTheme(themeToggle.checked ? 'dark' : 'light');
  });
  setTheme(localStorage.getItem('theme') || 'dark');

  // Gestion pseudo/avatar Minecraft (partagé avec stackers via localStorage)
  const pseudoSection = document.getElementById('pseudoSection');
  const mainTool = document.getElementById('mainTool');
  const pseudoInput = document.getElementById('pseudoInput');
  const savePseudo = document.getElementById('savePseudo');
  const playerAvatar = document.getElementById('playerAvatar');
  const playerName = document.getElementById('playerName');
  const changePseudo = document.getElementById('changePseudo');

  function setPseudo(pseudo) {
    localStorage.setItem('firstsky_pseudo', pseudo);
    pseudoSection.classList.add('hidden');
    mainTool.classList.remove('hidden');
    playerName.textContent = pseudo;
    playerAvatar.src = `https://mc-heads.net/avatar/${pseudo}/80`;
  }
  function resetPseudo() {
    localStorage.removeItem('firstsky_pseudo');
    mainTool.classList.add('hidden');
    pseudoSection.classList.remove('hidden');
    pseudoInput.value = '';
  }
  savePseudo?.addEventListener('click', () => {
    const pseudo = pseudoInput.value.trim();
    if (!pseudo || pseudo.length < 3 || pseudo.length > 16 || !/^[a-zA-Z0-9_]+$/.test(pseudo)) {
      pseudoInput.classList.add('input-error');
      setTimeout(() => pseudoInput.classList.remove('input-error'), 1000);
      return;
    }
    setPseudo(pseudo);
  });
  pseudoInput?.addEventListener('keypress', e => {
    if (e.key === 'Enter') savePseudo.click();
  });
  changePseudo?.addEventListener('click', resetPseudo);
  // On load, check pseudo
  const pseudo = localStorage.getItem('firstsky_pseudo');
  if (pseudo) setPseudo(pseudo);

  // Logique du calculateur de crédits
  const form = document.getElementById('creditsForm');
  const prixCredit = document.getElementById('prixCredit');
  const nbCredits = document.getElementById('nbCredits');
  const resultat = document.getElementById('resultatCredits');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const prix = parseFloat(prixCredit.value);
    const nb = parseInt(nbCredits.value);
    if (isNaN(prix) || isNaN(nb) || prix <= 0 || nb <= 0) {
      resultat.textContent = 'Veuillez entrer des valeurs valides.';
      resultat.classList.remove('hidden', 'text-success');
      resultat.classList.add('text-error');
      return;
    }
    const total = prix * nb;
    resultat.textContent = `Coût total : ${total.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}M`;
    resultat.classList.remove('hidden', 'text-error');
    resultat.classList.add('text-success');
  });
});
