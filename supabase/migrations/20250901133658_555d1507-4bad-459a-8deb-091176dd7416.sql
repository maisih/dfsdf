-- Create storage policies for documents bucket
CREATE POLICY "Project members can upload documents to documents bucket"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Project members can view documents in documents bucket" 
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents'
  AND (
    -- Owner can always access
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Project members can access if they're part of the project
    (storage.foldername(name))[1] IN (
      SELECT d.project_id::text
      FROM documents d
      JOIN project_members pm ON pm.project_id = d.project_id
      WHERE pm.user_id = auth.uid()
      AND d.file_path = name
    )
  )
);

CREATE POLICY "Project members can delete their own documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);