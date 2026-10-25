// ============================================
// Marseille Academy - Main Scripts
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  // Init Supabase if configured
  if (typeof initSupabase === 'function') {
    const ok = await initSupabase();
    if (ok && typeof loadFromSupabase === 'function') {
      await loadFromSupabase();
    }
  }

  const loader = document.querySelector('.loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 1000);

  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  createParticles();
  setupReveal();
  renderStats();
  renderNews();
  renderMatches();
  renderMedia();
});

function createParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.animationDuration = (12 + Math.random() * 18) + 's';
    container.appendChild(p);
  }
}

function setupReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
  }, { threshold: 0.12 });
  reveals.forEach(el => obs.observe(el));
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return dateStr; }
}

function renderStats() {
  const data = getData();
  const s = data.stats || {};
  const map = {
    'stat-players': s.players || '350+',
    'stat-coaches': s.coaches || '15+',
    'stat-ages': s.ageGroups || '8',
    'stat-league': s.leagueEdition || '1st'
  };
  Object.keys(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = map[id];
  });
}

function renderNews() {
  const container = document.getElementById('news-container');
  if (!container) return;
  const data = getData();
  const news = (data.news || []).sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!news.length) {
    container.innerHTML = '<p class="text-center" style="color:var(--gray)">لا توجد أخبار حالياً</p>';
    return;
  }

  container.innerHTML = news.map(item => {
    const hasImage = item.image && item.image.length > 10;
    const isVideo = item.mediaType === 'video';
    
    return `
    <a href="${item.url || 'https://www.facebook.com/MarseilleAcademy'}" target="_blank" rel="noopener" class="news-card reveal" style="text-decoration:none;color:inherit;display:block">
      <div class="news-image ${hasImage ? 'has-img' : ''}">
        ${hasImage 
          ? `<img src="${item.image}" alt="${item.title}" loading="lazy">` 
          : `<div class="news-placeholder-icon">${isVideo ? '▶️' : '📱'}</div>`}
        <div class="news-fb-badge">${isVideo ? 'فيديو' : 'فيسبوك'}</div>
        ${isVideo ? '<div class="play-overlay">▶</div>' : ''}
      </div>
      <div class="news-body">
        <div class="news-date">${formatDate(item.date)}</div>
        <h3 class="news-title">${item.title}</h3>
        <p class="news-excerpt">${item.excerpt || ''}</p>
        <span class="news-link">عرض المنشور الكامل ←</span>
      </div>
    </a>`;
  }).join('');
  setupReveal();
}

function renderMatches() {
  const container = document.getElementById('matches-container');
  if (!container) return;
  const data = getData();
  const matches = (data.matches || []).sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!matches.length) {
    container.innerHTML = '<p class="text-center" style="color:var(--gray)">لا توجد مباريات حالياً</p>';
    return;
  }

  const academyLogo = 'assets/logo-official.png';

  container.innerHTML = matches.map(m => {
    const statusClass = m.status === 'live' ? 'status-live' : m.status === 'finished' ? 'status-finished' : 'status-upcoming';
    const statusText = m.status === 'live' ? 'مباشر 🔴' : m.status === 'finished' ? 'انتهت' : 'قادمة';
    const scoreDisplay = (m.status === 'finished' || m.status === 'live')
      ? `<div class="score"><span>${m.score1 ?? 0}</span><span class="score-divider">-</span><span>${m.score2 ?? 0}</span></div>`
      : `<div class="score" style="font-size:1.5rem;color:var(--gray)">VS</div>`;

    const oppLogo = m.opponent?.logo
      ? `<img src="${m.opponent.logo}" alt="${m.opponent.name}">`
      : '⚽';

    // Scorers
    const scorers1 = (m.scorers1 || []).filter(Boolean);
    const scorers2 = (m.scorers2 || []).filter(Boolean);
    const scorers1Html = scorers1.length
      ? `<div class="scorers-list">${scorers1.map(s => `<span class="scorer">⚽ ${s}</span>`).join('')}</div>`
      : '';
    const scorers2Html = scorers2.length
      ? `<div class="scorers-list">${scorers2.map(s => `<span class="scorer">⚽ ${s}</span>`).join('')}</div>`
      : '';

    const liveClass = m.status === 'live' ? 'status-is-live' : '';
    const liveBanner = m.status === 'live'
      ? `<div class="live-banner"><span class="live-dot"></span> مباشر الآن — تابع المباراة</div>`
      : '';

    return `
      <div class="match-card match-pitch ${liveClass} reveal">
        <div class="pitch-bg"></div>
        ${liveBanner}
        <div class="match-header">
          <div class="match-info">
            <span class="match-league">${m.league || 'دوري مارسيليا أكاديمي'}</span>
            <span class="match-date">${formatDate(m.date)} • ${m.time || ''}</span>
          </div>
          <span class="match-status ${statusClass}">${statusText}</span>
        </div>
        <div class="match-teams">
          <div class="team">
            <div class="team-logo"><img src="${academyLogo}" alt="Marseille Academy"></div>
            <div class="team-name">مارسيليا أكاديمي</div>
            ${scorers1Html}
            <div class="team-stats">
              <span class="stat-badge">استحواذ: <strong>${m.stats?.possession || '-'}</strong></span>
              <span class="stat-badge">تسديدات: <strong>${m.stats?.shots || '-'}</strong></span>
              <span class="stat-badge">أهداف: <strong>${m.stats?.goals || '-'}</strong></span>
            </div>
          </div>
          <div class="match-score">
            ${scoreDisplay}
            <div class="match-time">${m.time || ''}</div>
          </div>
          <div class="team">
            <div class="team-logo">${oppLogo}</div>
            <div class="team-name">${m.opponent?.name || 'الفريق المنافس'}</div>
            ${scorers2Html}
            <div class="team-stats">
              <span class="stat-badge">استحواذ: <strong>${m.oppStats?.possession || '-'}</strong></span>
              <span class="stat-badge">تسديدات: <strong>${m.oppStats?.shots || '-'}</strong></span>
              <span class="stat-badge">أهداف: <strong>${m.oppStats?.goals || '-'}</strong></span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  setupReveal();
}

function renderMedia() {
  const container = document.getElementById('media-container');
  if (!container) return;
  const data = getData();
  const media = (data.media || []).sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!media.length) {
    container.innerHTML = '<p class="text-center" style="color:var(--gray)">لا توجد وسائط حالياً</p>';
    return;
  }

  container.innerHTML = media.map(item => `
    <a href="${item.url}" target="_blank" rel="noopener" class="media-card reveal" style="text-decoration:none;color:inherit;display:block">
      <div class="media-embed">
        <div class="media-placeholder">
          <span style="font-size:3.5rem">${item.type === 'video' ? '🎬' : '📱'}</span>
          <span class="media-type-badge">${item.type === 'video' ? 'فيديو' : 'منشور فيسبوك'}</span>
          <p style="margin-top:0.8rem;font-size:0.95rem;color:var(--accent)">اضغط للمشاهدة على فيسبوك ←</p>
        </div>
      </div>
      <div class="media-body">
        <h3 class="media-title">${item.title}</h3>
        <p class="media-desc">${item.description || ''}</p>
        <div class="media-date">${formatDate(item.date)}</div>
      </div>
    </a>
  `).join('');
  setupReveal();
}
