CREATE TABLE IF NOT EXISTS devices (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL,
  subscription TEXT NOT NULL,
  preferences TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  last_key TEXT,
  last_test INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS devices_enabled ON devices(enabled, id);
