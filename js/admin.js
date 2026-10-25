// ============================================
// Marseille Academy - Admin Panel Logic
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof initSupabase === 'function') {
    const ok = await initSupabase();
    if (ok && typeof loadFromSupabase === 'function') {
      await loadFromSupabase();
    }
  }

  if (checkAuth()) showDashboard();

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value;
      const err = document.getElementById('login-error');
      if (login(u, p)) {
        showDashboard();
      } else {
        err.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        err.style.display = 'block';
      }
    });
  }

  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.panel).classList.add('active');
    });
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    logout();
    location.reload();
  });

  setupStatsForm();
  setupNewsForm();
  setupMatchForm();
  setupMediaForm();
});

function showDashboard() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('admin-dashboard').classList.add('active');
  loadStatsInputs();
  renderAdminLists();
}

function formatDate(d) {
  try { return new Date(d).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' }); }
  catch { return d; }
}

function loadStatsInputs() {
  const s = getData().stats || {};
  document.getElementById('stat-players-input').value = s.players || '';
  document.getElementById('stat-coaches-input').value = s.coaches || '';
  document.getElementById('stat-ages-input').value = s.ageGroups || '';
  document.getElementById('stat-league-input').value = s.leagueEdition || '';
}

function setupStatsForm() {
  document.getElementById('stats-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getData();
    data.stats = {
      players: document.getElementById('stat-players-input').value.trim() || '350+',
      coaches: document.getElementById('stat-coaches-input').value.trim() || '15+',
      ageGroups: document.getElementById('stat-ages-input').value.trim() || '8',
      leagueEdition: document.getElementById('stat-league-input').value.trim() || '1st'
    };
    saveData(data);
    alert('تم حفظ الإحصائيات ✓');
  });
}

function setupNewsForm() {
  document.getElementById('news-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = getData();
    data.news = data.news || [];

    let imageData = document.getElementById('news-image').value.trim();
    const fileInput = document.getElementById('news-image-file');
    if (fileInput && fileInput.files && fileInput.files[0]) {
      imageData = await readFileAsBase64(fileInput.files[0]);
    }

    data.news.unshift({
      id: Date.now(),
      title: document.getElementById('news-title').value.trim(),
      excerpt: document.getElementById('news-excerpt').value.trim(),
      url: document.getElementById('news-url').value.trim(),
      date: document.getElementById('news-date').value || new Date().toISOString().split('T')[0],
      image: imageData,
      mediaType: document.getElementById('news-mediatype')?.value || 'post'
    });
    saveData(data);
    e.target.reset();
    renderAdminLists();
    alert('تم إضافة الخبر ✓');
  });
}

function setupMatchForm() {
  document.getElementById('match-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = getData();
    data.matches = data.matches || [];

    let logoBase64 = '';
    const fileInput = document.getElementById('opp-logo');
    if (fileInput.files && fileInput.files[0]) {
      logoBase64 = await readFileAsBase64(fileInput.files[0]);
    }

    const editId = document.getElementById('match-form').dataset.editId;
    const matchObj = {
      id: editId ? parseInt(editId) : Date.now(),
      league: document.getElementById('match-league').value.trim() || 'دوري مارسيليا أكاديمي',
      date: document.getElementById('match-date').value,
      time: document.getElementById('match-time').value || '15:00',
      status: document.getElementById('match-status').value,
      opponent: {
        name: document.getElementById('opp-name').value.trim(),
        logo: logoBase64 || (editId ? (data.matches.find(x => x.id === parseInt(editId))?.opponent?.logo || '') : '')
      },
      stats: {
        possession: document.getElementById('ma-poss').value.trim() || '-',
        shots: document.getElementById('ma-shots').value.trim() || '-',
        goals: document.getElementById('ma-goals').value.trim() || '-'
      },
      oppStats: {
        possession: document.getElementById('opp-poss').value.trim() || '-',
        shots: document.getElementById('opp-shots').value.trim() || '-',
        goals: document.getElementById('opp-goals').value.trim() || '-'
      },
      score1: document.getElementById('score1').value ? parseInt(document.getElementById('score1').value) : null,
      score2: document.getElementById('score2').value ? parseInt(document.getElementById('score2').value) : null,
      scorers1: (document.getElementById('scorers1')?.value || '').split(/[,،]/).map(s => s.trim()).filter(Boolean),
      scorers2: (document.getElementById('scorers2')?.value || '').split(/[,،]/).map(s => s.trim()).filter(Boolean)
    };

    if (editId) {
      const idx = data.matches.findIndex(x => x.id === parseInt(editId));
      if (idx !== -1) data.matches[idx] = matchObj;
      delete document.getElementById('match-form').dataset.editId;
      const btn = document.querySelector('#match-form button[type="submit"]');
      if (btn) btn.textContent = 'إضافة المباراة';
      alert('تم حفظ التعديلات ✓');
    } else {
      data.matches.unshift(matchObj);
      alert('تم إضافة المباراة ✓');
    }
    saveData(data);
    e.target.reset();
    renderAdminLists();
  });
}

function readFileAsBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

function setupMediaForm() {
  document.getElementById('media-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getData();
    data.media = data.media || [];
    data.media.unshift({
      id: Date.now(),
      type: document.getElementById('media-type').value,
      title: document.getElementById('media-title').value.trim(),
      description: document.getElementById('media-desc').value.trim(),
      url: document.getElementById('media-url').value.trim(),
      date: document.getElementById('media-date').value || new Date().toISOString().split('T')[0]
    });
    saveData(data);
    e.target.reset();
    renderAdminLists();
    alert('تم إضافة الوسائط ✓');
  });
}


function setMatchStatus(id, status) {
  const data = getData();
  const m = (data.matches || []).find(x => x.id === id);
  if (m) {
    m.status = status;
    saveData(data);
    renderAdminLists();
    alert(status === 'live' ? 'المباراة أصبحت مباشرة الآن ✓' : 'تم تحديث الحالة ✓');
  }
}

function editMatch(id) {
  const data = getData();
  const m = (data.matches || []).find(x => x.id === id);
  if (!m) return;

  // Switch to matches tab
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-panel="panel-matches"]')?.classList.add('active');
  document.getElementById('panel-matches')?.classList.add('active');

  // Fill form
  document.getElementById('match-league').value = m.league || '';
  document.getElementById('match-status').value = m.status || 'upcoming';
  document.getElementById('match-date').value = m.date || '';
  document.getElementById('match-time').value = m.time || '';
  document.getElementById('opp-name').value = m.opponent?.name || '';
  document.getElementById('ma-poss').value = m.stats?.possession || '';
  document.getElementById('ma-shots').value = m.stats?.shots || '';
  document.getElementById('ma-goals').value = m.stats?.goals || '';
  document.getElementById('opp-poss').value = m.oppStats?.possession || '';
  document.getElementById('opp-shots').value = m.oppStats?.shots || '';
  document.getElementById('opp-goals').value = m.oppStats?.goals || '';
  document.getElementById('score1').value = m.score1 ?? '';
  document.getElementById('score2').value = m.score2 ?? '';
  document.getElementById('scorers1').value = (m.scorers1 || []).join('، ');
  document.getElementById('scorers2').value = (m.scorers2 || []).join('، ');

  // Store editing id
  document.getElementById('match-form').dataset.editId = id;

  // Change button text
  const btn = document.querySelector('#match-form button[type="submit"]');
  if (btn) btn.textContent = 'حفظ التعديلات';

  // Scroll to form
  document.getElementById('match-form').scrollIntoView({ behavior: 'smooth' });
}

function deleteItem(type, id) {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  const data = getData();
  data[type] = (data[type] || []).filter(item => item.id !== id);
  saveData(data);
  renderAdminLists();
}

function updateRegStatus(id, status) {
  const data = getData();
  const reg = (data.registrations || []).find(r => r.id === id);
  if (reg) {
    const wasConfirmed = reg.status === 'confirmed';
    reg.status = status;
    // When confirming a new player, increment the player count
    if (status === 'confirmed' && !wasConfirmed) {
      const current = parseInt(String(data.stats.players || '0').replace(/[^0-9]/g, ''), 10) || 0;
      data.stats.players = (current + 1) + '+';
      // Also try to update Supabase stats
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        supabaseClient.from('stats').upsert({
          id: 1,
          players: data.stats.players,
          coaches: data.stats.coaches,
          age_groups: data.stats.ageGroups,
          league_edition: data.stats.leagueEdition
        }).then(() => console.log('Stats updated in Supabase'));
      }
    }
    saveData(data);
    renderAdminLists();
    if (status === 'confirmed') alert('تم تأكيد اللاعب ✓ وعدد اللاعبين زاد 1');
  }
}

function renderAdminLists() {
  const data = getData();

  // News
  const newsList = document.getElementById('news-list');
  if (newsList) {
    newsList.innerHTML = !(data.news||[]).length ? '<p style="color:var(--gray)">لا توجد أخبار</p>' :
      data.news.map(n => `
        <div class="admin-item">
          <div class="admin-item-info">
            <strong>${n.title}</strong>
            <div style="color:var(--gray);font-size:0.85rem">${formatDate(n.date)} • <a href="${n.url}" target="_blank" style="color:var(--accent)">اللينك</a></div>
          </div>
          <div class="admin-item-actions">
            <button class="btn btn-sm btn-danger" onclick="deleteItem('news', ${n.id})">حذف</button>
          </div>
        </div>
      `).join('');
  }

  // Matches
  const matchesList = document.getElementById('matches-list');
  if (matchesList) {
    matchesList.innerHTML = !(data.matches||[]).length ? '<p style="color:var(--gray)">لا توجد مباريات</p>' :
      data.matches.map(m => {
        const statusLabel = m.status === 'live' ? '🔴 مباشر' : m.status === 'finished' ? 'انتهت' : 'قادمة';
        return `
        <div class="admin-item">
          <div class="admin-item-info">
            <strong>مارسيليا أكاديمي vs ${m.opponent?.name || '?'}</strong>
            <div style="color:var(--gray);font-size:0.85rem">${formatDate(m.date)} • ${statusLabel} ${m.score1 != null ? `• ${m.score1}-${m.score2}` : ''}</div>
          </div>
          <div class="admin-item-actions">
            ${m.status !== 'live' ? `<button class="btn btn-sm" style="background:rgba(239,68,68,0.2);color:#ef4444" onclick="setMatchStatus(${m.id},'live')">🔴 مباشر</button>` : `<button class="btn btn-sm" style="background:rgba(16,185,129,0.2);color:#10B981" onclick="setMatchStatus(${m.id},'finished')">إنهاء</button>`}
            <button class="btn btn-sm" style="background:rgba(0,168,232,0.2);color:var(--accent)" onclick="editMatch(${m.id})">تعديل</button>
            <button class="btn btn-sm btn-danger" onclick="deleteItem('matches', ${m.id})">حذف</button>
          </div>
        </div>`;
      }).join('');
  }

  // Media
  const mediaList = document.getElementById('media-list');
  if (mediaList) {
    mediaList.innerHTML = !(data.media||[]).length ? '<p style="color:var(--gray)">لا توجد وسائط</p>' :
      data.media.map(m => `
        <div class="admin-item">
          <div class="admin-item-info">
            <strong>${m.title}</strong>
            <div style="color:var(--gray);font-size:0.85rem">${m.type} • ${formatDate(m.date)}</div>
          </div>
          <div class="admin-item-actions">
            <button class="btn btn-sm btn-danger" onclick="deleteItem('media', ${m.id})">حذف</button>
          </div>
        </div>
      `).join('');
  }

  // Registrations (PRIVATE)
  const regsList = document.getElementById('regs-list');
  if (regsList) {
    const regs = data.registrations || [];
    if (!regs.length) {
      regsList.innerHTML = '<p style="color:var(--gray)">لا توجد طلبات تسجيل حالياً</p>';
    } else {
      regsList.innerHTML = regs.map(r => {
        const statusClass = r.status === 'paid' ? 'status-paid' : r.status === 'confirmed' ? 'status-confirmed' : 'status-pending';
        const statusText = r.status === 'paid' ? 'تم الدفع' : r.status === 'confirmed' ? 'تم التأكيد' : 'قيد الانتظار';
        const payText = r.paymentMethod === 'instapay' ? 'إنستا باي' : 'فودافون كاش';
        return `
          <div class="admin-item" style="flex-direction:column;align-items:stretch;gap:0.8rem">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem">
              <div>
                <strong style="font-size:1.1rem">${r.playerName}</strong>
                <span class="status-badge ${statusClass}" style="margin-right:0.8rem">${statusText}</span>
              </div>
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                ${r.status === 'pending' ? `<button class="btn btn-sm" style="background:rgba(16,185,129,0.2);color:#10B981" onclick="updateRegStatus(${r.id},'paid')">تم الدفع</button>` : ''}
                ${r.status !== 'confirmed' ? `<button class="btn btn-sm" style="background:rgba(0,168,232,0.2);color:var(--accent)" onclick="updateRegStatus(${r.id},'confirmed')">تأكيد اللاعب</button>` : ''}
                <button class="btn btn-sm btn-danger" onclick="deleteItem('registrations', ${r.id})">حذف</button>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.5rem;font-size:0.9rem;color:var(--gray)">
              <div>الهاتف: <strong style="color:var(--white)">${r.phone}</strong></div>
              <div>تاريخ الميلاد: <strong style="color:var(--white)">${r.birthDate || '-'}</strong></div>
              <div>السن: <strong style="color:var(--white)">${r.age || '-'}</strong></div>
              <div>الدفع: <strong style="color:var(--white)">${payText}</strong></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}
