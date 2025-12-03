-- Create storage bucket for photos
-- Run this in Supabase SQL Editor

-- Note: Storage buckets are typically created via the Supabase dashboard
-- or using the Supabase client. This SQL is for reference.

-- If using Supabase client to create bucket:
-- const { data, error } = await supabase.storage.createBucket('photos', {
--   public: false,
--   fileSizeLimit: 10485760, // 10MB
--   allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
-- })

-- Storage policies (run these after creating the bucket in dashboard):

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to own folder" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to read their own files
CREATE POLICY "Users can read own files" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Service role has full access
CREATE POLICY "Service role has full access" ON storage.objects
  FOR ALL
  USING (auth.role() = 'service_role');
