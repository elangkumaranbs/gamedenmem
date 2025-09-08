/*
  # Remove RLS policies and disable RLS

  1. Changes
    - Remove all RLS policies from members table
    - Remove all RLS policies from play_history table
    - Disable RLS on both tables
*/

-- Remove policies from members table
DROP POLICY IF EXISTS "Allow authenticated users to read members" ON members;
DROP POLICY IF EXISTS "Allow authenticated users to insert members" ON members;
DROP POLICY IF EXISTS "Allow authenticated users to update members" ON members;
DROP POLICY IF EXISTS "Allow authenticated users to delete members" ON members;

-- Remove policies from play_history table
DROP POLICY IF EXISTS "Allow authenticated users to read play history" ON play_history;
DROP POLICY IF EXISTS "Allow authenticated users to insert play history" ON play_history;
DROP POLICY IF EXISTS "Allow authenticated users to update play history" ON play_history;
DROP POLICY IF EXISTS "Allow authenticated users to delete play history" ON play_history;

-- Disable RLS on tables
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE play_history DISABLE ROW LEVEL SECURITY;