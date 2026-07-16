BEGIN (implicit)
PRAGMA main.table_...info("users")
PRAGMA main.table_...info("locations")

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('caregiver','recipient')),
    display_name TEXT DEFAULT '',
    expo_push_token TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    status TEXT DEFAULT 'available' CHECK (status IN ('available','busy')),
    -- geofence
    home_lat DOUBLE PRECISION,
    home_lng DOUBLE PRECISION,
    home_radius_in_m DOUBLE PRECISION,
    -- last known position
    last_lat DOUBLE PRECISION,
    last_lng DOUBLE PRECISION,
    last_accuracy DOUBLE PRECISION,
    last_seen_at TIMESTAMP,
    geofence_state TEXT CHECK (
        geofence_state IN ('inside', 'outside')
        OR geofence_state IS NULL
    ),
);

CREATE TABLE connections (
    id INTEGER NOT NULL,
    caregiver_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    code VARCHAR(8) NOT NULL,
    accepted BOOLEAN,
    created_at DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY(caregiver_id) REFERENCES users (id),
    FOREIGN KEY(recipient_id) REFERENCES users (id)
);

CREATE UNIQUE INDEX idx_connections_code ON connections (code);

COMMIT;