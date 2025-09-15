-- Add description column to restaurants table
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing restaurants with empty description
UPDATE restaurants SET description = '' WHERE description IS NULL;
