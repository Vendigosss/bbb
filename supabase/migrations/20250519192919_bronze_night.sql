/*
  # Add missing profile for existing user
  
  1. Changes
    - Insert profile record for existing user if missing
*/

DO $$
BEGIN
  INSERT INTO public.profiles (id)
  SELECT id FROM auth.users
  WHERE id NOT IN (SELECT id FROM public.profiles)
  ON CONFLICT (id) DO NOTHING;
END $$;