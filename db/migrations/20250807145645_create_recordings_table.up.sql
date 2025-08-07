-- Create recordings table
CREATE TABLE recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    filename VARCHAR(255) NOT NULL UNIQUE,
    original_filename VARCHAR(255),
    file_size BIGINT,
    duration INTEGER DEFAULT 0, -- Duration in seconds
    mime_type VARCHAR(100) DEFAULT 'audio/wav',
    file_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for efficient sorting
CREATE INDEX idx_recordings_created_at ON recordings (created_at DESC);

-- Create index on filename for efficient lookups
CREATE INDEX idx_recordings_filename ON recordings (filename);