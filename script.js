const BLOCK_PRICES = {
    netherite: 40000,
    lapis: 50000,
    gold: 30000,
    diamond: 20000,
    emerald: 10000
};

const CookieManager = {
    set(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    remove(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

const pseudoForm = document.getElementById('pseudoForm');
const playerInfo = document.getElementById('playerInfo');
const stackersTool = document.getElementById('stackersTool');
const enchantsTool = document.getElementById('enchantsTool');
const itemsTool = document.getElementById('itemsTool');
const economyTool = document.getElementById('economyTool');
const pseudoInput = document.getElementById('pseudoInput');
const savePseudo = document.getElementById('savePseudo');
const changePseudo = document.getElementById('changePseudo');
const playerName = document.getElementById('playerName');
const playerAvatar = document.getElementById('playerAvatar');
const blockType = document.getElementById('blockType');
const blockQuantity = document.getElementById('blockQuantity');
const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('resultsSection');
const totalPrice = document.getElementById('totalPrice');
const payCommand = document.getElementById('payCommand');
const sellCommand = document.getElementById('sellCommand');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

const navButtons = document.querySelectorAll('[data-tool]');
const tools = {
    stackers: stackersTool,
    enchants: enchantsTool,
    items: itemsTool,
    economy: economyTool
};

let currentPlayer = null;
let currentTool = 'stackers';

function init() {
    const savedPseudo = CookieManager.get('firstsky_pseudo');
    if (savedPseudo) {
        setPlayer(savedPseudo);
    }
    savePseudo.addEventListener('click', handleSavePseudo);
    changePseudo.addEventListener('click', handleChangePseudo);
    calculateBtn.addEventListener('click', handleCalculate);
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTool(btn.dataset.tool));
    });
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', handleCopy);
    });
    pseudoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSavePseudo();
    });
    blockQuantity.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCalculate();
    });
}

function setPlayer(pseudo) {
    currentPlayer = pseudo;
    playerName.textContent = pseudo;
    const avatarUrl = `https://mc-heads.net/avatar/${pseudo}/64`;
    playerAvatar.src = avatarUrl;
    playerAvatar.onerror = () => {
        playerAvatar.src = 'https://mc-heads.net/avatar/steve/64';
    };
    pseudoForm.classList.add('hidden');
    playerInfo.classList.remove('hidden');
    showCurrentTool();
    CookieManager.set('firstsky_pseudo', pseudo);
}

function switchTool(toolName) {
    Object.values(tools).forEach(tool => tool.classList.add('hidden'));
    navButtons.forEach(btn => {
        if (btn.dataset.tool === toolName) {
            btn.className = btn.className.replace('nav-inactive', 'nav-active');
        } else {
            btn.className = btn.className.replace('nav-active', 'nav-inactive');
        }
    });
    currentTool = toolName;
    if (currentPlayer) {
        showCurrentTool();
    }
}

function showCurrentTool() {
    if (tools[currentTool]) {
        tools[currentTool].classList.remove('hidden');
    }
}

function handleSavePseudo() {
    const pseudo = pseudoInput.value.trim();
    if (!pseudo) {
        showToast('Veuillez entrer un pseudo valide!', 'error');
        return;
    }
    if (pseudo.length < 3 || pseudo.length > 16) {
        showToast('Le pseudo doit faire entre 3 et 16 caractères!', 'error');
        return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(pseudo)) {
        showToast('Le pseudo ne peut contenir que des lettres, chiffres et underscores!', 'error');
        return;
    }
    setPlayer(pseudo);
    showToast(`Bienvenue ${pseudo}!`, 'success');
    pseudoInput.value = '';
}

function handleChangePseudo() {
    currentPlayer = null;
    playerInfo.classList.add('hidden');
    Object.values(tools).forEach(tool => tool.classList.add('hidden'));
    pseudoForm.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    CookieManager.remove('firstsky_pseudo');
}

function handleCalculate() {
    const selectedBlock = blockType.value;
    const quantity = parseInt(blockQuantity.value);
    if (!selectedBlock) {
        showToast('Veuillez sélectionner un type de bloc!', 'error');
        return;
    }
    if (!quantity || quantity <= 0) {
        showToast('Veuillez entrer une quantité valide!', 'error');
        return;
    }
    const unitPrice = BLOCK_PRICES[selectedBlock];
    const total = unitPrice * quantity;
    const formattedPrice = formatPrice(total);
    totalPrice.textContent = formattedPrice;
    payCommand.value = `/pay ${currentPlayer} ${total}`;
    sellCommand.value = `/zah sell ${total}`;
    resultsSection.classList.remove('hidden');
    showToast('Calcul effectué!', 'success');
}

function formatPrice(price) {
    if (price >= 1000000000000) {
        return (price / 1000000000000).toFixed(1).replace('.0', '') + 'T';
    } else if (price >= 1000000000) {
        return (price / 1000000000).toFixed(1).replace('.0', '') + 'B';
    } else if (price >= 1000000) {
        return (price / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (price >= 1000) {
        return (price / 1000).toFixed(1).replace('.0', '') + 'K';
    } else {
        return price.toLocaleString();
    }
}

async function handleCopy(e) {
    const targetId = e.target.dataset.target;
    const targetElement = document.getElementById(targetId);
    try {
        await navigator.clipboard.writeText(targetElement.value);
        showToast('Commande copiée!', 'success');
    } catch (err) {
        targetElement.select();
        document.execCommand('copy');
        showToast('Commande copiée!', 'success');
    }
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    const alertClass = type === 'error' ? 'alert-error' : 'alert-success';
    const alert = toast.querySelector('.alert');
    alert.className = `alert ${alertClass}`;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
