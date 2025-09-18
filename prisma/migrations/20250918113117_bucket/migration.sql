-- ================================
-- Storage Bucket Setup
-- ================================

-- Remove all objects in the "posts" bucket first
DELETE FROM storage.objects WHERE bucket_id = 'posts';

-- Remove the "posts" bucket itself
DELETE FROM storage.buckets WHERE id = 'posts' CASCADE;

-- Recreate the "posts" bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

-- Allow any authenticated user to read objects from the posts bucket
CREATE POLICY "Authenticated users can read posts bucket"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'posts'
  AND auth.role() = 'authenticated'
);

-- Allow only Admins to insert into the post bucket
CREATE POLICY "Only Admins can insert into post bucket"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'posts'
  AND public.role() = 'Admin'
);

-- Allow only Admins to update objects in the post bucket
CREATE POLICY "Only Admins can update post objects"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'posts'
  AND public.role() = 'Admin'
)
WITH CHECK (
  bucket_id = 'posts'
  AND public.role() = 'Admin'
);

-- Allow only Admins to delete objects from the post bucket
CREATE POLICY "Only Admins can delete post objects"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'posts'
  AND public.role() = 'Admin'
);
