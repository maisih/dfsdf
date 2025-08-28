-- Temporarily drop the foreign key constraint until we implement proper authentication
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_created_by_fkey;

-- Make sure created_by can be null for testing
ALTER TABLE public.projects ALTER COLUMN created_by DROP NOT NULL;