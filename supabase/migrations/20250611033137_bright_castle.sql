/*
  # Remove RLS policies and authentication system

  1. Changes
    - Drop all RLS policies from all tables
    - Disable RLS on all tables
    - Drop authentication-related functions and triggers
    - Drop user_roles table

  2. Notes
    - Policies must be dropped before functions they depend on
    - Triggers must be dropped before functions they depend on
    - This removes all authentication requirements
*/

-- Drop triggers first (before dropping functions they depend on)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop all policies from members table (these depend on is_admin function)
DROP POLICY IF EXISTS "Admins can manage all members" ON members;
DROP POLICY IF EXISTS "Users can only read members" ON members;
DROP POLICY IF EXISTS "Allow authenticated users to read members" ON members;
DROP POLICY IF EXISTS "Allow authenticated users to insert members" ON members;
DROP POLICY IF EXISTS "Allow authenticated users to update members" ON members;
DROP POLICY IF EXISTS "Allow authenticated users to delete members" ON members;

-- Drop all policies from play_history table (these depend on is_admin function)
DROP POLICY IF EXISTS "Admins can manage all play history" ON play_history;
DROP POLICY IF EXISTS "Users cannot access play history" ON play_history;
DROP POLICY IF EXISTS "Allow authenticated users to read play history" ON play_history;
DROP POLICY IF EXISTS "Allow authenticated users to insert play history" ON play_history;
DROP POLICY IF EXISTS "Allow authenticated users to update play history" ON play_history;
DROP POLICY IF EXISTS "Allow authenticated users to delete play history" ON play_history;

-- Drop all policies from user_roles table
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;

-- Now drop role-related functions (after policies that depend on them are gone)
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS get_user_role(uuid);
DROP FUNCTION IF EXISTS assign_admin_role();

-- Disable RLS on all tables
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE play_history DISABLE ROW LEVEL SECURITY;

-- Drop user_roles table entirely since we're not using Supabase auth
DROP TABLE IF EXISTS user_roles;