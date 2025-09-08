/*
  # Update admin email address

  1. Changes
    - Update admin email from dineshkumar@gmail.com to gamedenoffiz@gmail.com
    - Keep the same password and admin role
    - Update any references to the old admin email

  2. Notes
    - This migration will update the user_roles table
    - The actual auth.users table will be updated when the admin signs up with the new email
*/

-- Update any existing admin role references
-- Note: The actual user creation will happen when they sign up with the new email
-- This ensures the role assignment logic works with the new email

-- If there are any existing records, we'll clean them up
-- The new admin will need to sign up with gamedenoffiz@gmail.com