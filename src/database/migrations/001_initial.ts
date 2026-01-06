export const initialSchema = `
-- Schema version tracking
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at TEXT DEFAULT (datetime('now'))
);

-- User settings and profile
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  user_name TEXT DEFAULT '',
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  sport_focus TEXT DEFAULT 'general',
  age_group TEXT DEFAULT 'adult' CHECK (age_group IN ('teen', 'adult')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Initialize settings with default values
INSERT OR IGNORE INTO settings (id) VALUES (1);

-- Habit groups for organization
CREATE TABLE IF NOT EXISTS habit_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Habits
CREATE TABLE IF NOT EXISTS habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'check',
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  group_id INTEGER REFERENCES habit_groups(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Habit completion tracking
CREATE TABLE IF NOT EXISTS habit_completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_date TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(habit_id, completed_date)
);

CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(habit_id, completed_date);

-- Checklists
CREATE TABLE IF NOT EXISTS checklists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  is_template INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Checklist items
CREATE TABLE IF NOT EXISTS checklist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  checklist_id INTEGER NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_completed INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_checklist_items ON checklist_items(checklist_id, sort_order);

-- Foods database
CREATE TABLE IF NOT EXISTS foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  calories INTEGER,
  protein REAL,
  carbs REAL,
  fat REAL,
  fiber REAL,
  serving_size TEXT,
  is_custom INTEGER DEFAULT 0
);

-- Meal ideas
CREATE TABLE IF NOT EXISTS meal_ideas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  description TEXT,
  prep_time INTEGER,
  is_favorite INTEGER DEFAULT 0
);

-- Meal ingredients junction table
CREATE TABLE IF NOT EXISTS meal_ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meal_id INTEGER NOT NULL REFERENCES meal_ideas(id) ON DELETE CASCADE,
  food_id INTEGER NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  quantity REAL,
  unit TEXT
);

-- Workout programs
CREATE TABLE IF NOT EXISTS workout_programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks INTEGER
);

-- Workout days within programs
CREATE TABLE IF NOT EXISTS workout_days (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_id INTEGER NOT NULL REFERENCES workout_programs(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  week_number INTEGER DEFAULT 1,
  focus_area TEXT
);

-- Individual exercises
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_day_id INTEGER NOT NULL REFERENCES workout_days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER,
  reps TEXT,
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  notes TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Workout completion tracking
CREATE TABLE IF NOT EXISTS workout_completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_day_id INTEGER NOT NULL REFERENCES workout_days(id) ON DELETE CASCADE,
  completed_date TEXT NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(workout_day_id, completed_date)
);

CREATE INDEX IF NOT EXISTS idx_workout_completions ON workout_completions(completed_date);

-- Favorite foods tracking
CREATE TABLE IF NOT EXISTS favorite_foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  food_id INTEGER NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(food_id)
);
`
