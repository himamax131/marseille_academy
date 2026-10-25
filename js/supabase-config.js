// ============================================
// Supabase Configuration - Marseille Academy
// ============================================

const SUPABASE_URL = 'https://zblkxyxquuxgtujnnbil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibGt4eXhxdXV4Z3R1am5uYmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NjAwMzksImV4cCI6MjEwODUzNjAzOX0.wTB4hyWGwbAxmkgi85FKfom924ax3nq6e7ZA6gqfjPo';

// Enabled
const USE_SUPABASE = true;

// ============================================
let supabaseClient = null;

async function initSupabase() {
  if (!USE_SUPABASE || SUPABASE_URL.includes('YOUR_')) {
    console.log('Using localStorage (Supabase not configured)');
    return false;
  }
  try {
    if (typeof supabase === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
    }
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase connected ✓');
    return true;
  } catch (e) {
    console.error('Supabase init failed, using localStorage', e);
    return false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
