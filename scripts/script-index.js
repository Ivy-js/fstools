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

  const el = document.getElementById('typewriter');
  if (el) {
    const texts = [
        "Calcule tes stackers, crédits, XP et plus encore !",
        "Optimise ton expérience sur FirstSky !",
        "Vive /pw Castle",
    ];
    let i = 0, j = 0, isDeleting = false;
    el.textContent = '';
    let textNode = document.createTextNode('');
    let cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    cursor.style.display = 'inline-block';
    cursor.style.animation = 'blink-cursor 0.8s steps(1) infinite';
    el.appendChild(textNode);
    el.appendChild(cursor);
    function type() {
      if (i >= texts.length) i = 0;
      let currentText = texts[i];
      let display = isDeleting ? currentText.substring(0, j--) : currentText.substring(0, j++);
      textNode.nodeValue = display;
      cursor.style.visibility = (isDeleting || j <= currentText.length) ? 'visible' : 'hidden';
      if (!isDeleting && j === currentText.length + 1) {
        isDeleting = true;
        setTimeout(type, 1500);
      } else if (isDeleting && j === 0) {
        isDeleting = false;
        i++;
        setTimeout(type, 500);
      } else {
        setTimeout(type, isDeleting ? 40 : 90);
      }
    }
    const style = document.createElement('style');
    style.innerHTML = `
      .typewriter-cursor {
        color: #a855f7;
        font-weight: bold;
        margin-left: 2px;
        animation: blink-cursor 0.8s steps(1) infinite;
      }
      @keyframes blink-cursor {
        0%,100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    type();
  }
});
