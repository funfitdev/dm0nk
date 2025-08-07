-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for note types
CREATE TYPE note_type AS ENUM ('text', 'markdown', 'birthdays', 'spaced_rep_suite', 'checklist', 'trip', 'journal', 'bookmarks');

-- Create notes table
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    title VARCHAR(255) NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    type note_type NOT NULL DEFAULT 'text',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on type for faster queries
CREATE INDEX idx_notes_type ON notes(type);

-- Create index on created_at for sorting
CREATE INDEX idx_notes_created_at ON notes (created_at DESC);

-- Create index on JSONB data for faster JSON queries
CREATE INDEX idx_notes_data_gin ON notes USING GIN (data);