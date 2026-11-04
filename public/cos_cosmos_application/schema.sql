-- Proposed schema only; no database or recurring collector is provisioned.
PRAGMA foreign_keys = ON;
CREATE TABLE accounts (id TEXT PRIMARY KEY, platform TEXT NOT NULL, native_id TEXT, handle TEXT NOT NULL, verified_at TEXT, UNIQUE(platform,native_id));
CREATE TABLE posts (id TEXT PRIMARY KEY, account_id TEXT NOT NULL REFERENCES accounts(id), platform TEXT NOT NULL, native_id TEXT, canonical_url TEXT NOT NULL UNIQUE, published_at TEXT, published_date TEXT, published_precision TEXT NOT NULL, format TEXT NOT NULL, discovered_at TEXT NOT NULL, availability TEXT NOT NULL DEFAULT 'observed', UNIQUE(platform,native_id));
CREATE TABLE collection_runs (id TEXT PRIMARY KEY, adapter TEXT NOT NULL, started_at TEXT NOT NULL, finished_at TEXT, status TEXT NOT NULL, cursor_before TEXT, cursor_after TEXT, errors_json TEXT, access_scope TEXT);
CREATE TABLE post_versions (id TEXT PRIMARY KEY, post_id TEXT NOT NULL REFERENCES posts(id), observed_at TEXT NOT NULL, text_hash TEXT NOT NULL, text TEXT, completeness TEXT NOT NULL, evidence_ref TEXT, run_id TEXT REFERENCES collection_runs(id), UNIQUE(post_id,text_hash));
-- observed_at: ISO UTC timestamp when known; day-only imports retain a date
-- with observed_precision='day'. Never invent a midnight collection time.
CREATE TABLE metric_observations (id TEXT PRIMARY KEY, post_id TEXT NOT NULL REFERENCES posts(id), observed_at TEXT NOT NULL, observed_precision TEXT NOT NULL, method TEXT NOT NULL, metric_key TEXT NOT NULL, metric_definition_version TEXT NOT NULL, value INTEGER, availability_reason TEXT, run_id TEXT NOT NULL REFERENCES collection_runs(id), evidence_ref TEXT, CHECK(value IS NULL OR value>=0), UNIQUE(post_id,run_id,metric_key));
CREATE INDEX metric_history ON metric_observations(post_id,metric_key,method,observed_at);
CREATE TABLE reviews (id TEXT PRIMARY KEY, post_id TEXT NOT NULL REFERENCES posts(id), kind TEXT NOT NULL, proposed_value TEXT, status TEXT NOT NULL, reviewer TEXT, decided_at TEXT, evidence_ref TEXT, rule_or_model_version TEXT);
CREATE TABLE campaigns (id TEXT PRIMARY KEY, name TEXT NOT NULL, definition TEXT);
CREATE TABLE campaign_posts (campaign_id TEXT NOT NULL REFERENCES campaigns(id), post_id TEXT NOT NULL REFERENCES posts(id), review_id TEXT REFERENCES reviews(id), PRIMARY KEY(campaign_id,post_id));
