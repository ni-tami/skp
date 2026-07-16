CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('caregiver','recipient')),
    display_name TEXT DEFAULT '',
    expo_push_token TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available','busy')),
);

CREATE TABLE IF NOT EXISTS locations (
    id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    latitude INTEGER NOT NULL,
    longitude INTEGER,
    PRIMARY KEY (id) FOREIGN KEY (user_id) REFERENCES users (id)
);
