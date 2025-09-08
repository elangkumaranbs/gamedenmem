/*
  # Add member validity tracking

  1. Changes
    - Add `validity_start` column to track when membership starts
    - Add `validity_end` column to track when membership expires
    - Set default values:
      - validity_start: current timestamp when member is created
      - validity_end: 6 months from validity_start
    - Update existing members to have validity dates

  2. Notes
    - Using timestamptz to store dates with timezone information
    - Default validity period is 6 months
    - Existing members will get validity from their creation date
*/

-- Add validity columns
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS validity_start timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS validity_end timestamptz DEFAULT now() + interval '6 months';

-- Update existing members
UPDATE members 
SET 
  validity_start = created_at,
  validity_end = created_at + interval '6 months'
WHERE validity_start IS NULL OR validity_end IS NULL;