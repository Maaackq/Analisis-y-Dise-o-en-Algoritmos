CREATE TABLE IF NOT EXISTS nodes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  type TEXT NOT NULL DEFAULT 'waypoint',
  description TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS edges (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  distance REAL NOT NULL CHECK(distance >= 0),
  time REAL NOT NULL CHECK(time >= 0),
  cost REAL NOT NULL CHECK(cost >= 0),
  bidirectional INTEGER NOT NULL DEFAULT 1,
  label TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(source_id) REFERENCES nodes(id) ON DELETE CASCADE,
  FOREIGN KEY(target_id) REFERENCES nodes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS algorithm_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  algorithm TEXT NOT NULL,
  origin_id TEXT,
  destination_id TEXT,
  weight_key TEXT NOT NULL,
  total_cost REAL,
  visited_count INTEGER,
  execution_ms REAL,
  result_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_edges_source ON edges(source_id);
CREATE INDEX IF NOT EXISTS idx_edges_target ON edges(target_id);
CREATE INDEX IF NOT EXISTS idx_runs_created_at ON algorithm_runs(created_at DESC);
