-- Drop indexes
DROP INDEX IF EXISTS idx_notes_data_gin;

DROP INDEX IF EXISTS idx_notes_created_at;

DROP INDEX IF EXISTS idx_notes_type;

-- Drop notes table
DROP TABLE IF EXISTS notes;

-- Drop enum type
DROP TYPE IF EXISTS note_type;

-- Drop UUID extension (be careful with this in production)
-- DROP EXTENSION IF EXISTS "uuid-ossp";