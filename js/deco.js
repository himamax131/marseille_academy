// Football decorative elements - unique per page
(function() {
  const ballSVG = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#333" stroke-width="2"/>
      <path d="M50 2 L60 30 L90 30 L68 50 L78 80 L50 62 L22 80 L32 50 L10 30 L40 30 Z" fill="#222" opacity="0.85"/>
      <circle cx="50" cy="50" r="12" fill="#222"/>
    </svg>`;

  const playerSVG = `
    <svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="18" r="12" fill="#00A8E8"/>
      <path d="M25 32 Q40 28 55 32 L58 70 L48 70 L48 55 L32 55 L32 70 L22 70 Z" fill="#00A8E8"/>
      <path d="M22 70 L18 110 L28 110 L32 75 Z" fill="#0A1628"/>
      <path d="M58 70 L62 110 L52 110 L48 75 Z" fill="#0A1628"/>
      <path d="M55 40 L75 55 L70 62 L52 48 Z" fill="#00A8E8"/>
    </svg>`;

  const goalSVG = `
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="110" height="70" fill="none" stroke="#00A8E8" stroke-width="3"/>
      <line x1="5" y1="5" x2="5" y2="75" stroke="#00A8E8" stroke-width="4"/>
      <line x1="115" y1="5" x2="115" y2="75" stroke="#00A8E8" stroke-width="4"/>
      <path d="M5 40 Q60 20 115 40" fill="none" stroke="#00A8E8" stroke-width="1.5" opacity="0.5"/>
      <path d="M5 55 Q60 40 115 55" fill="none" stroke="#00A8E8" stroke-width="1.5" opacity="0.4"/>
    </svg>`;

  const trophySVG = `
    <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 15 H60 V40 Q60 55 40 60 Q20 55 20 40 Z" fill="#FFD700" stroke="#E6A800" stroke-width="2"/>
      <path d="M20 20 Q5 20 5 35 Q5 45 20 42" fill="none" stroke="#FFD700" stroke-width="3"/>
      <path d="M60 20 Q75 20 75 35 Q75 45 60 42" fill="none" stroke="#FFD700" stroke-width="3"/>
      <rect x="35" y="60" width="10" height="15" fill="#FFD700"/>
      <rect x="25" y="75" width="30" height="8" rx="2" fill="#FFD700"/>
      <circle cx="40" cy="35" r="8" fill="#E6A800" opacity="0.5"/>
    </svg>`;

  const whistleSVG = `
    <svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="35" cy="30" rx="28" ry="20" fill="#00A8E8"/>
      <circle cx="25" cy="28" r="8" fill="#0A1628"/>
      <rect x="55" y="22" width="20" height="14" rx="4" fill="#00A8E8"/>
      <circle cx="70" cy="29" r="5" fill="#0A1628"/>
    </svg>`;

  function addDeco(parent, html, className, style) {
    const el = document.createElement('div');
    el.className = 'football-deco ' + className;
    el.style.cssText = style;
    el.innerHTML = html;
    parent.appendChild(el);
  }

  function init() {
    const page = location.pathname.split('/').pop() || 'index.html';

    // Common subtle pitch lines on main sections
    document.querySelectorAll('section, .hero').forEach(sec => {
      if (!sec.querySelector('.pitch-lines')) {
        const pl = document.createElement('div');
        pl.className = 'pitch-lines';
        sec.insertBefore(pl, sec.firstChild);
      }
    });

    if (page.includes('index') || page === '' || page === '/') {
      // Home: floating balls + player
      addDeco(document.body, ballSVG, 'deco-ball', 'width:70px;height:70px;top:15%;left:5%;');
      addDeco(document.body, ballSVG, 'deco-ball-bounce', 'width:45px;height:45px;top:60%;right:8%;animation-delay:1s;');
      addDeco(document.body, playerSVG, 'deco-player', 'width:60px;height:90px;bottom:10%;left:8%;opacity:0.1;');
      addDeco(document.body, trophySVG, 'deco-glow', 'width:55px;height:70px;top:25%;right:5%;');
    }
    else if (page.includes('matches')) {
      // Matches: goals + balls
      addDeco(document.body, goalSVG, 'deco-glow', 'width:140px;height:90px;top:20%;left:3%;');
      addDeco(document.body, goalSVG, 'deco-glow', 'width:140px;height:90px;top:20%;right:3%;transform:scaleX(-1);animation-delay:2s;');
      addDeco(document.body, ballSVG, 'deco-ball-bounce', 'width:50px;height:50px;bottom:15%;left:50%;transform:translateX(-50%);');
      addDeco(document.body, whistleSVG, 'deco-glow', 'width:60px;height:45px;top:70%;right:10%;');
    }
    else if (page.includes('media')) {
      // Media: balls rolling
      addDeco(document.body, ballSVG, 'deco-ball-roll', 'width:55px;height:55px;top:30%;left:4%;');
      addDeco(document.body, ballSVG, 'deco-ball', 'width:40px;height:40px;bottom:20%;right:6%;animation-delay:1.5s;');
      addDeco(document.body, playerSVG, 'deco-player', 'width:50px;height:75px;top:55%;left:3%;opacity:0.1;');
    }
    else if (page.includes('register')) {
      // Register: kit vibes + ball
      addDeco(document.body, ballSVG, 'deco-ball-bounce', 'width:60px;height:60px;top:18%;right:6%;');
      addDeco(document.body, trophySVG, 'deco-glow', 'width:50px;height:65px;bottom:12%;left:5%;');
      addDeco(document.body, playerSVG, 'deco-player', 'width:55px;height:85px;top:40%;left:3%;opacity:0.1;');
    }
    else if (page.includes('admin')) {
      // Admin: subtle only
      addDeco(document.body, ballSVG, 'deco-ball', 'width:40px;height:40px;bottom:5%;right:3%;opacity:0.08;');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
