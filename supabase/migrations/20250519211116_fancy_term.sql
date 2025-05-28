/*
  # Fix profile creation trigger and policies
  
  1. Changes
    - Drop and recreate profile creation trigger with better error handling
    - Add policy to allow profile creation for new users
    - Set function security to DEFINER for proper permissions
*/

-- First, drop the existing trigger and function
DROP TRIGGER IF EXISTS create_profile_after_signup ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile_for_user();

-- Recreate the function with better error handling and SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER create_profile_after_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_user();

-- Add policy to allow profile creation for new users
DROP POLICY IF EXISTS "Allow profile creation for new users" ON public.profiles;
CREATE POLICY "Allow profile creation for new users"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);