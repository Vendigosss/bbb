/*
  # Storage setup for user avatars
  
  1. Creates a new storage bucket for avatars
  2. Makes the bucket publicly accessible
  3. Sets up RLS policies for:
    - Public read access
    - Authenticated user upload
    - User avatar management
*/

-- Create storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'Avatar storage', true)
on conflict (id) do nothing;

-- Create security policies
do $$
begin
  -- Public read access for avatars
  create policy "Public read access for avatars"
    on storage.objects for select
    using ( bucket_id = 'avatars' );

  -- Allow authenticated users to upload avatars
  create policy "Users can upload avatars"
    on storage.objects for insert
    to authenticated
    with check (
      bucket_id = 'avatars'
      and (storage.foldername(name))[1] = 'avatars'
      and position(auth.uid()::text in name) > 0
    );

  -- Allow users to update their avatars
  create policy "Users can update own avatars"
    on storage.objects for update
    to authenticated
    using (
      bucket_id = 'avatars'
      and position(auth.uid()::text in name) > 0
    );

  -- Allow users to delete their avatars
  create policy "Users can delete own avatars"
    on storage.objects for delete
    to authenticated
    using (
      bucket_id = 'avatars'
      and position(auth.uid()::text in name) > 0
    );
end $$;