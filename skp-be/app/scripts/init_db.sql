BEGIN (implicit)
PRAGMA main.table_...info("users")
PRAGMA main.table_...info("locations")

CREATE TABLE IF NOT EXISTS users (
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
);

CREATE TABLE IF NOT EXISTS locations (
    id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    latitude INTEGER NOT NULL,
    longitude INTEGER,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id) FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create Routine Categories table
CREATE TABLE IF NOT EXISTS routine_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50) NOT NULL, -- e.g., "#FF6B6B"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create Routines table
CREATE TABLE IF NOT EXISTS routines (
    id SERIAL PRIMARY KEY,
    care_recipient_id INT NOT NULL,
    caregiver_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    detail TEXT,
    notifications_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_routines_care_recipient FOREIGN KEY (care_recipient_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_routines_caregiver FOREIGN KEY (caregiver_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_routines_category FOREIGN KEY (category_id) 
        REFERENCES routine_categories(id) ON DELETE CASCADE
);

-- Create Routine Settings table
CREATE TABLE IF NOT EXISTS routine_settings (
    id SERIAL PRIMARY KEY,
    routine_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    interval INT NOT NULL, -- in minutes
    repeat_type VARCHAR(50) DEFAULT 'ONCE' NOT NULL, -- ONCE, DAILY, WEEKLY, MONTHLY, CUSTOM
    day_of_week INT[], -- PostgreSQL Array type for [1,2,3,...,7]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_settings_routine FOREIGN KEY (routine_id) 
        REFERENCES routines(id) ON DELETE CASCADE
);

-- Create Routine Schedules table
CREATE TABLE IF NOT EXISTS routine_schedules (
    id SERIAL PRIMARY KEY,
    routine_id INT NOT NULL,    
    setting_id INT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL, -- PENDING, SKIPPED, COMPLETED, UNCONFIRMED
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_schedules_routine FOREIGN KEY (routine_id) 
        REFERENCES routines(id) ON DELETE CASCADE,
    CONSTRAINT fk_schedules_setting FOREIGN KEY (setting_id) 
        REFERENCES routine_settings(id) ON DELETE CASCADE
);

-- Create Indexes for performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_routines_caregiver ON routines(caregiver_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_routines_care_recipient ON routines(care_recipient_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_schedules_date ON routine_schedules(CAST(start_time AS DATE)) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_schedules_status ON routine_schedules(status) WHERE deleted_at IS NULL;

COMMIT;