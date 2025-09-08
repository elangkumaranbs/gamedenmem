/*
  # Enable RLS and add security policies

  1. Security Changes
    - Enable RLS on members table
    - Enable RLS on play_history table
    - Add policies for members table:
      - Authenticated users can read all members
      - Only authenticated users can insert/update/delete members
    - Add policies for play_history table:
      - Authenticated users can read all play history
      - Only authenticated users can insert/update/delete play history

  2. Notes
    - All operations require authentication
    - No public access allowed
    - Policies ensure data security while maintaining functionality
*/

-- Enable RLS on tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_history ENABLE ROW LEVEL SECURITY;

-- Policies for members table
CREATE POLICY "Allow authenticated users to read members"
  ON members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert members"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update members"
  ON members
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete members"
  ON members
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for play_history table
CREATE POLICY "Allow authenticated users to read play history"
  ON play_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert play history"
  ON play_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update play history"
  ON play_history
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete play history"
  ON play_history
  FOR DELETE
  TO authenticated
  USING (true);