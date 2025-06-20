// Script pour stackers.html
// Trie les blocs par prix croissant et gère le calculateur

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

  // Stackers triés par prix croissant
  const PRICES = [
    { value: 'emerald', label: '💚 Émeraude (10,000 $/u)', price: 10000 },
    { value: 'diamond', label: '💎 Diamant (20,000 $/u)', price: 20000 },
    { value: 'gold', label: '💛 Or (30,000 $/u)', price: 30000 },
    { value: 'netherite', label: '💎 Netherite (40,000 $/u)', price: 40000 },
    { value: 'lapis', label: '💙 Lapis (50,000 $/u)', price: 50000 }
  ];

  // Remplir dynamiquement le select
  const blockType = document.getElementById('blockType');
  if (blockType) {
    blockType.innerHTML = '<option value="">Choisir un bloc...</option>' +
      PRICES.map(b => `<option value="${b.value}">${b.label}</option>`).join('');
  }

  // Pseudo logic
  const pseudoSection = document.getElementById('pseudoSection');
  const mainTool = document.getElementById('mainTool');
  const pseudoInput = document.getElementById('pseudoInput');
  const savePseudo = document.getElementById('savePseudo');
  const playerAvatar = document.getElementById('playerAvatar');
  const playerName = document.getElementById('playerName');
  const changePseudo = document.getElementById('changePseudo');
  const blockQty = document.getElementById('blockQty');
  const calcForm = document.getElementById('calcForm');
  const results = document.getElementById('results');
  const totalPrice = document.getElementById('totalPrice');
  const payCommand = document.getElementById('payCommand');
  const sellCommand = document.getElementById('sellCommand');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(msg) {
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

  // Calculateur
  function getPrice(val) {
    const found = PRICES.find(b => b.value === val);
    return found ? found.price : 0;
  }
  function formatPrice(val) {
    if (val >= 1e12) return (val/1e12).toFixed(1).replace('.0', '')+'T';
    if (val >= 1e9) return (val/1e9).toFixed(1).replace('.0','')+'B';
    if (val >= 1e6) return (val/1e6).toFixed(1).replace('.0','')+'M';
    if (val >= 1e3) return (val/1e3).toFixed(1).replace('.0','')+'k';
    return val.toLocaleString();
  }
  calcForm.addEventListener('submit', e => {
    e.preventDefault();
    const type = blockType.value;
    const qty = parseInt(blockQty.value);
    const pseudo = localStorage.getItem('firstsky_pseudo');
    if (!type || !qty || qty < 1) {
      showToast('Remplis tous les champs !');
      return;
    }
    const total = getPrice(type) * qty;
    totalPrice.textContent = formatPrice(total);
    payCommand.value = `/pay ${pseudo} ${total}`;
    sellCommand.value = `/zah sell ${total}`;
    results.classList.remove('hidden');
  });
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
