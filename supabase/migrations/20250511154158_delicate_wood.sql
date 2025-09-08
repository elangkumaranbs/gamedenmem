/*
  # Add play datetime tracking

  1. Changes
    - Add `play_date` column to `play_history` table to track when members played
    - Set default value to current timestamp
    - Backfill existing records with current timestamp

  2. Notes
    - Using timestamptz to store date and time with timezone information
    - Default value ensures new records always have a timestamp
*/

-- Add play_date column with default value
ALTER TABLE play_history 
ADD COLUMN IF NOT EXISTS play_date timestamptz DEFAULT now();

-- Update existing records to have a timestamp
UPDATE play_history 
SET play_date = created_at 
WHERE play_date IS NULL;