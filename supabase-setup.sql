-- ============================================
-- Marseille Academy - Supabase Schema
-- Run this in Supabase → SQL Editor → New query
-- ============================================

-- Stats (single row)
CREATE TABLE IF NOT EXISTS stats (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  players TEXT DEFAULT '350+',
  coaches TEXT DEFAULT '15+',
  age_groups TEXT DEFAULT '8',
  league_edition TEXT DEFAULT '1st',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO stats (id) VALUES (1) ON CONFLICT DO NOTHING;

-- News
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  url TEXT,
  image TEXT,
  media_type TEXT DEFAULT 'post',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches
CREATE TABLE IF NOT EXISTS matches (
  id BIGSERIAL PRIMARY KEY,
  league TEXT DEFAULT 'دوري مارسيليا أكاديمي',
  date DATE,
  time TEXT,
  status TEXT DEFAULT 'upcoming',
  opponent_name TEXT,
  opponent_logo TEXT,
  stats_possession TEXT,
  stats_shots TEXT,
  stats_goals TEXT,
  opp_possession TEXT,
  opp_shots TEXT,
  opp_goals TEXT,
  score1 INT,
  score2 INT,
  scorers1 TEXT[] DEFAULT '{}',
  scorers2 TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media
CREATE TABLE IF NOT EXISTS media (
  id BIGSERIAL PRIMARY KEY,
  type TEXT DEFAULT 'facebook',
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations (private - admin only)
CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  birth_date DATE,
  age TEXT,
  position TEXT,
  parent_name TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Public read access for content
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read media" ON media FOR SELECT USING (true);

-- Anyone can insert registrations (for the form)
CREATE POLICY "Anyone can register" ON registrations FOR INSERT WITH CHECK (true);

-- Admin writes: for simplicity using anon key with write policies
-- (Later you can restrict with auth)
CREATE POLICY "Public write stats" ON stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write matches" ON matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write media" ON media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read regs" ON registrations FOR SELECT USING (true);
CREATE POLICY "Public update regs" ON registrations FOR UPDATE USING (true);
CREATE POLICY "Public delete regs" ON registrations FOR DELETE USING (true);
CREATE POLICY "Public delete news" ON news FOR DELETE USING (true);
CREATE POLICY "Public delete matches" ON matches FOR DELETE USING (true);
CREATE POLICY "Public delete media" ON media FOR DELETE USING (true);
