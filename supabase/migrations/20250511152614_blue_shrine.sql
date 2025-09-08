/*
  # Create members and play history tables

  1. New Tables
    - `members` - Stores membership information
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `full_name` (text)
      - `card_number` (text, unique)
      - `phone` (text)
      - `email` (text)
    - `play_history` - Tracks each time a member plays
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `member_id` (uuid, foreign key)
      - `play_date` (timestamp)
      - `is_free_play` (boolean)

  2. Security
    - RLS disabled as per requirements
*/

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  full_name text NOT NULL,
  card_number text NOT NULL UNIQUE,
  phone text NOT NULL,
  email text NOT NULL
);

-- Create play history table
CREATE TABLE IF NOT EXISTS play_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  member_id uuid NOT NULL REFERENCES members(id),
  play_date timestamptz DEFAULT now(),
  is_free_play boolean DEFAULT false
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS play_history_member_id_idx ON play_history(member_id);