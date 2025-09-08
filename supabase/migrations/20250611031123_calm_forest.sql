/*
  # Setup Admin User Role

  1. Changes
    - Clean up any existing admin role references
    - Ensure the role assignment logic works with gamedenoffiz@gmail.com
    - Add function to automatically assign admin role to the correct email

  2. Notes
    - The admin user will be created when they sign up with gamedenoffiz@gmail.com
    - This migration ensures the system is ready for the new admin email
*/

-- Function to automatically assign admin role to specific email
CREATE OR REPLACE FUNCTION assign_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user email is the admin email
  IF NEW.email = 'gamedenoffiz@gmail.com' THEN
    -- Insert admin role
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
  ELSE
    -- Insert user role
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically assign roles on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION assign_admin_role();