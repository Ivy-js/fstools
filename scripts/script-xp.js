// Script pour xp.html harmonisé avec stackers.html

document.addEventListener('DOMContentLoaded', () => {
  // DaisyUI dark/light mode toggle
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

  // Pseudo/avatar logic (partagé avec stackers)
  const pseudoSection = document.getElementById('pseudoSection');
  const mainTool = document.getElementById('mainTool');
  const pseudoInput = document.getElementById('pseudoInput');
  const savePseudo = document.getElementById('savePseudo');
  const playerAvatar = document.getElementById('playerAvatar');
  const playerName = document.getElementById('playerName');
  const changePseudo = document.getElementById('changePseudo');

  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000);
  }

  function setPseudo(pseudo) {
    localStorage.setItem('firstsky_pseudo', pseudo);
    pseudoSection.classList.add('hidden');
    mainTool.classList.remove('hidden');
    playerName.textContent = pseudo;
    playerAvatar.src = `https://mc-heads.net/avatar/${pseudo}/128`;
  }
  function resetPseudo() {
    localStorage.removeItem('firstsky_pseudo');
    mainTool.classList.add('hidden');
    pseudoSection.classList.remove('hidden');
    pseudoInput.value = '';
  }
  savePseudo.addEventListener('click', () => {
    const pseudo = pseudoInput.value.trim();
    if (!pseudo || pseudo.length < 3 || pseudo.length > 16 || !/^[a-zA-Z0-9_]+$/.test(pseudo)) {
      showToast('Pseudo invalide !');
      return;
    }
    setPseudo(pseudo);
  });
  pseudoInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') savePseudo.click();
  });
  changePseudo.addEventListener('click', resetPseudo);
  // On load, check pseudo
  const pseudo = localStorage.getItem('firstsky_pseudo');
  if (pseudo) setPseudo(pseudo);
  else {
    pseudoSection.classList.remove('hidden');
    mainTool.classList.add('hidden');
  }

  // XP calculator logic
  const xpForm = document.getElementById('xpForm');
  const xpInput = document.getElementById('xpInput');
  const results = document.getElementById('results');
  const xpResult = document.getElementById('xpResult');
  const sellCommand = document.getElementById('sellCommand');
  const payCommand = document.getElementById('payCommand');

  function getXpPrice(xp) {
    if (xp >= 10000000) return { palier: '10M', prix: 10000000000 };
    if (xp >= 1000000) return { palier: '1M', prix: 1000000000 };
    if (xp >= 1000) return { palier: '1k', prix: 1000000 };
    return { palier: '1', prix: 1000 };
  }

  function formatPrice(val) {
    if (val >= 1e12) return (val/1e12).toFixed(1).replace('.0', '')+'T';
    if (val >= 1e9) return (val/1e9).toFixed(1).replace('.0','')+'B';
    if (val >= 1e6) return (val/1e6).toFixed(1).replace('.0','')+'M';
    if (val >= 1e3) return (val/1e3).toFixed(1).replace('.0','')+'k';
    return val.toLocaleString();
  }

  xpForm.addEventListener('submit', e => {
    e.preventDefault();
    const xp = parseInt(xpInput.value);
    if (!xp || xp < 1) {
      showToast('Entre une valeur d\'XP valide !');
      results.classList.add('hidden');
      return;
    }
    const { palier, prix } = getXpPrice(xp);
    document.getElementById('totalPrice').textContent = formatPrice(prix);
    document.getElementById('payCommand').value = `/pay <joueur> ${prix}`;
    document.getElementById('sellCommand').value = `/zah sell ${prix}`;
    results.classList.remove('hidden');
  });

  // Copier/coller comme stackers
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      const target = document.getElementById(btn.dataset.target);
      try {
        await navigator.clipboard.writeText(target.value);
        showToast('Copié !');
      } catch {
        showToast('Erreur de copie');
      }
    });
  });
});
