BEGIN (implicit) PRAGMA main.table_...info("locations")

CREATE TABLE locations (
    id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    latitude INTEGER NOT NULL,
    longitude INTEGER,
    PRIMARY KEY (id)
    FOREIGN KEY (user_id) REFERENCES users (id)
);

COMMIT;
