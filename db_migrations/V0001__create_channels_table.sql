
CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY,
    tgstat_id VARCHAR(255),
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(255),
    tme_link VARCHAR(500),
    tgstat_url VARCHAR(500),
    description TEXT,
    subscribers INTEGER,
    created_at DATE,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    language VARCHAR(100),
    country VARCHAR(100),
    category VARCHAR(255),
    tags TEXT,
    posts_per_day DECIMAL(10,2),
    avg_views INTEGER,
    contacts TEXT,
    status VARCHAR(50) DEFAULT 'active'
);

CREATE INDEX idx_channels_name ON channels(name);
CREATE INDEX idx_channels_category ON channels(category);
CREATE INDEX idx_channels_status ON channels(status);
