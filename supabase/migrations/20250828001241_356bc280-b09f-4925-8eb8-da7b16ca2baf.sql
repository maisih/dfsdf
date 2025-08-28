-- Fix the foreign key constraint issue by making created_by nullable
-- and removing any invalid foreign key constraints

-- First, let's see what constraints exist
SELECT conname, contype, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.projects'::regclass;