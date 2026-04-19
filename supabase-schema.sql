-- ============================================================
-- PowerSync Load Shedding App — Supabase Schema
-- ============================================================
-- Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor).
-- This creates all tables and seeds them with initial data.
-- No destructive operations — safe to run on a fresh project.
-- ============================================================


-- ------------------------------------------------------------
-- 1. REGIONS TABLE
-- ------------------------------------------------------------
-- Stores geographic regions/areas that experience load shedding.

CREATE TABLE IF NOT EXISTS regions (
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  zone  TEXT NOT NULL,
  stage INTEGER NOT NULL DEFAULT 1
);

-- Seed regions (matches existing hardcoded data in lib/data.ts)
INSERT INTO regions (id, name, zone, stage) VALUES
  ('r1', 'Downtown Central',     'Zone A', 2),
  ('r2', 'Northern Heights',     'Zone A', 4),
  ('r3', 'Riverside District',   'Zone B', 3),
  ('r4', 'Industrial Park',      'Zone B', 5),
  ('r5', 'Westside Gardens',     'Zone C', 2),
  ('r6', 'Eastbrook Valley',     'Zone C', 4),
  ('r7', 'Southgate Community',  'Zone D', 3),
  ('r8', 'Hillcrest Area',       'Zone D', 6)
ON CONFLICT (id) DO NOTHING;


-- ------------------------------------------------------------
-- 2. OUTAGE SCHEDULES TABLE
-- ------------------------------------------------------------
-- Stores power cut schedules per region.

CREATE TABLE IF NOT EXISTS outage_schedules (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  region_id   TEXT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
  region_name TEXT NOT NULL,
  start_time  TEXT NOT NULL,
  end_time    TEXT NOT NULL,
  date        TEXT NOT NULL,
  stage       INTEGER NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for common query patterns
CREATE INDEX IF NOT EXISTS idx_schedules_date ON outage_schedules(date);
CREATE INDEX IF NOT EXISTS idx_schedules_region ON outage_schedules(region_id);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON outage_schedules(status);


-- ------------------------------------------------------------
-- 3. APP SETTINGS TABLE
-- ------------------------------------------------------------
-- Key-value store for global app configuration.

CREATE TABLE IF NOT EXISTS app_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default current stage
INSERT INTO app_settings (key, value) VALUES
  ('current_stage', '4')
ON CONFLICT (key) DO NOTHING;


-- ------------------------------------------------------------
-- 4. NOTIFICATIONS TABLE
-- ------------------------------------------------------------
-- Stores notifications shown to users in the header dropdown.

CREATE TABLE IF NOT EXISTS notifications (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title     TEXT NOT NULL,
  message   TEXT NOT NULL,
  type      TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  read      BOOLEAN NOT NULL DEFAULT false
);

-- Seed notifications (matches existing hardcoded data)
INSERT INTO notifications (id, title, message, type, timestamp, read) VALUES
  ('n1', 'Stage 4 Activated',
   'Load shedding has been escalated to Stage 4 across all zones.',
   'warning', now(), false),
  ('n2', 'Schedule Updated',
   'New outage schedule published for your region.',
   'info', now() - INTERVAL '2 hours', false),
  ('n3', 'Outage Complete',
   'Power has been restored in Downtown Central.',
   'success', now() - INTERVAL '5 hours', true)
ON CONFLICT (id) DO NOTHING;


-- ------------------------------------------------------------
-- 5. DAILY STATS TABLE
-- ------------------------------------------------------------
-- Stores daily aggregate statistics for the analytics chart.

CREATE TABLE IF NOT EXISTS daily_stats (
  date             TEXT PRIMARY KEY,
  total_outages    INTEGER NOT NULL,
  total_hours      INTEGER NOT NULL,
  affected_regions INTEGER NOT NULL
);

-- Seed 7 days of stats (relative dates computed from now())
INSERT INTO daily_stats (date, total_outages, total_hours, affected_regions) VALUES
  (to_char(now() - INTERVAL '6 days', 'Mon DD'), 24, 72, 6),
  (to_char(now() - INTERVAL '5 days', 'Mon DD'), 18, 54, 5),
  (to_char(now() - INTERVAL '4 days', 'Mon DD'), 32, 96, 8),
  (to_char(now() - INTERVAL '3 days', 'Mon DD'), 28, 84, 7),
  (to_char(now() - INTERVAL '2 days', 'Mon DD'), 22, 66, 6),
  (to_char(now() - INTERVAL '1 day',  'Mon DD'), 26, 78, 7),
  (to_char(now(),                      'Mon DD'), 20, 60, 5)
ON CONFLICT (date) DO NOTHING;


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Enable RLS on all tables. These policies allow public read
-- access via the anon key. Write access should be restricted
-- to authenticated admin users in Phase 5 (Auth).
-- For now, we allow full access for development.
-- ============================================================

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE outage_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
DROP POLICY IF EXISTS "Allow public read on regions" ON regions;
CREATE POLICY "Allow public read on regions"
  ON regions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on outage_schedules" ON outage_schedules;
CREATE POLICY "Allow public read on outage_schedules"
  ON outage_schedules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on app_settings" ON app_settings;
CREATE POLICY "Allow public read on app_settings"
  ON app_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on notifications" ON notifications;
CREATE POLICY "Allow public read on notifications"
  ON notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on daily_stats" ON daily_stats;
CREATE POLICY "Allow public read on daily_stats"
  ON daily_stats FOR SELECT USING (true);

-- Temporary full write access for development (restrict in Phase 5)
DROP POLICY IF EXISTS "Allow public insert on outage_schedules" ON outage_schedules;
CREATE POLICY "Allow public insert on outage_schedules"
  ON outage_schedules FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on outage_schedules" ON outage_schedules;
CREATE POLICY "Allow public update on outage_schedules"
  ON outage_schedules FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on outage_schedules" ON outage_schedules;
CREATE POLICY "Allow public delete on outage_schedules"
  ON outage_schedules FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public update on app_settings" ON app_settings;
CREATE POLICY "Allow public update on app_settings"
  ON app_settings FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on app_settings" ON app_settings;
CREATE POLICY "Allow public insert on app_settings"
  ON app_settings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on notifications" ON notifications;
CREATE POLICY "Allow public update on notifications"
  ON notifications FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on notifications" ON notifications;
CREATE POLICY "Allow public insert on notifications"
  ON notifications FOR INSERT WITH CHECK (true);
