// ============================================
// Marseille Academy - Data Layer
// Supports localStorage + Supabase
// ============================================

const DEFAULT_DATA = {
  stats: {
    players: "350+",
    coaches: "15+",
    ageGroups: "8",
    leagueEdition: "1st"
  },
  news: [
    {
      id: 1,
      title: "مارسيليا أكاديمي.. أكثر من مجرد أكاديمية",
      excerpt: "شاهد أحدث فيديو من الأكاديمية",
      url: "https://www.facebook.com/reel/1109602422045044",
      image: "",
      mediaType: "video",
      date: "2026-10-25"
    },
    {
      id: 2,
      title: "نهائي دوري مارسيليا أكاديمي – النسخة الأولى",
      excerpt: "ختام ملحمي للنسخة الأولى من دوري الأكاديمية بمشاركة أقوى الفرق واللاعبين الموهوبين",
      url: "https://www.facebook.com/MarseilleAcademy",
      image: "",
      mediaType: "video",
      date: "2026-10-25"
    },
    {
      id: 3,
      title: "نجوم برؤية ⭐ Stars With Vision",
      excerpt: "مجموعة من ألمع نجوم الأكاديمية يظهرون مهارات استثنائية في التدريبات",
      url: "https://www.facebook.com/MarseilleAcademy",
      image: "",
      mediaType: "post",
      date: "2026-06-08"
    }
  ],
  matches: [],
  media: [
    {
      id: 1,
      type: "video",
      title: "فيديو الأكاديمية الرسمي",
      description: "مارسيليا أكاديمي.. أكثر من مجرد أكاديمية",
      url: "https://www.facebook.com/reel/1109602422045044",
      date: "2026-10-25"
    },
    {
      id: 2,
      type: "facebook",
      title: "صفحة مارسيليا أكاديمي على فيسبوك",
      description: "تابع كل الأخبار والتدريبات والمباريات",
      url: "https://www.facebook.com/MarseilleAcademy",
      date: "2026-10-20"
    },
    {
      id: 3,
      type: "video",
      title: "نهائي دوري الأكاديمية",
      description: "أفضل لحظات النهائي – النسخة الأولى",
      url: "https://www.facebook.com/MarseilleAcademy",
      date: "2026-10-25"
    }
  ],
  registrations: []
};

// ---------- localStorage helpers ----------
function getLocalData() {
  const stored = localStorage.getItem('marseilleAcademyData');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      return { ...DEFAULT_DATA, ...data, stats: { ...DEFAULT_DATA.stats, ...(data.stats || {}) } };
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveLocalData(data) {
  localStorage.setItem('marseilleAcademyData', JSON.stringify(data));
}

// ---------- Unified API ----------
function getData() {
  return getLocalData();
}

function saveData(data) {
  saveLocalData(data);
  // If Supabase is active, also sync key tables (fire-and-forget)
  if (typeof USE_SUPABASE !== 'undefined' && USE_SUPABASE && supabaseClient) {
    syncToSupabase(data).catch(console.error);
  }
}

async function syncToSupabase(data) {
  if (!supabaseClient) return;
  // Stats
  await supabaseClient.from('stats').upsert({
    id: 1,
    players: data.stats?.players,
    coaches: data.stats?.coaches,
    age_groups: data.stats?.ageGroups,
    league_edition: data.stats?.leagueEdition
  });
}

// Load from Supabase on startup (replaces local if available)
async function loadFromSupabase() {
  if (!supabaseClient) return null;
  try {
    const [statsRes, newsRes, matchesRes, mediaRes, regsRes] = await Promise.all([
      supabaseClient.from('stats').select('*').eq('id', 1).single(),
      supabaseClient.from('news').select('*').order('date', { ascending: false }),
      supabaseClient.from('matches').select('*').order('date', { ascending: false }),
      supabaseClient.from('media').select('*').order('date', { ascending: false }),
      supabaseClient.from('registrations').select('*').order('created_at', { ascending: false })
    ]);

    const data = getLocalData();

    if (statsRes.data) {
      data.stats = {
        players: statsRes.data.players || data.stats.players,
        coaches: statsRes.data.coaches || data.stats.coaches,
        ageGroups: statsRes.data.age_groups || data.stats.ageGroups,
        leagueEdition: statsRes.data.league_edition || data.stats.leagueEdition
      };
    }
    if (newsRes.data) {
      data.news = newsRes.data.map(n => ({
        id: n.id,
        title: n.title,
        excerpt: n.excerpt,
        url: n.url,
        image: n.image,
        mediaType: n.media_type,
        date: n.date
      }));
    }
    if (matchesRes.data) {
      data.matches = matchesRes.data.map(m => ({
        id: m.id,
        league: m.league,
        date: m.date,
        time: m.time,
        status: m.status,
        opponent: { name: m.opponent_name, logo: m.opponent_logo },
        stats: { possession: m.stats_possession, shots: m.stats_shots, goals: m.stats_goals },
        oppStats: { possession: m.opp_possession, shots: m.opp_shots, goals: m.opp_goals },
        score1: m.score1,
        score2: m.score2,
        scorers1: m.scorers1 || [],
        scorers2: m.scorers2 || []
      }));
    }
    if (mediaRes.data) {
      data.media = mediaRes.data.map(m => ({
        id: m.id,
        type: m.type,
        title: m.title,
        description: m.description,
        url: m.url,
        date: m.date
      }));
    }
    if (regsRes.data) {
      data.registrations = regsRes.data.map(r => ({
        id: r.id,
        playerName: r.player_name,
        birthDate: r.birth_date,
        age: r.age,
        position: r.position,
        parentName: r.parent_name,
        phone: r.phone,
        address: r.address,
        notes: r.notes,
        paymentMethod: r.payment_method,
        status: r.status,
        createdAt: r.created_at
      }));
    }

    saveLocalData(data);
    return data;
  } catch (e) {
    console.error('Load from Supabase failed', e);
    return null;
  }
}

// Save a single registration to Supabase
async function saveRegistrationToSupabase(reg) {
  if (!supabaseClient) return;
  await supabaseClient.from('registrations').insert({
    player_name: reg.playerName,
    birth_date: reg.birthDate,
    age: reg.age,
    position: reg.position,
    parent_name: reg.parentName,
    phone: reg.phone,
    address: reg.address,
    notes: reg.notes,
    payment_method: reg.paymentMethod,
    status: reg.status || 'pending'
  });
}

// Auth (still local for now)
function checkAuth() {
  return sessionStorage.getItem('marseilleAdminAuth') === 'true';
}

function login(username, password) {
  if (username === 'hima' && password === '1234') {
    sessionStorage.setItem('marseilleAdminAuth', 'true');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem('marseilleAdminAuth');
}
