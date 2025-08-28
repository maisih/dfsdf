-- Fix remaining foreign key constraints for materials, signals, photos, and documents tables
-- These tables have user_id references that need to be nullable for now

-- Materials table
ALTER TABLE public.materials DROP CONSTRAINT IF EXISTS materials_ordered_by_fkey;
ALTER TABLE public.materials ALTER COLUMN ordered_by DROP NOT NULL;

-- Signals table  
ALTER TABLE public.signals DROP CONSTRAINT IF EXISTS signals_reported_by_fkey;
ALTER TABLE public.signals DROP CONSTRAINT IF EXISTS signals_resolved_by_fkey;
ALTER TABLE public.signals ALTER COLUMN reported_by DROP NOT NULL;

-- Photos table
ALTER TABLE public.photos DROP CONSTRAINT IF EXISTS photos_uploaded_by_fkey;
ALTER TABLE public.photos ALTER COLUMN uploaded_by DROP NOT NULL;

-- Documents table
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_uploaded_by_fkey;

-- Tasks table - additional cleanup
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_created_by_fkey;
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey;

-- Expenses table - additional cleanup  
ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS expenses_recorded_by_fkey;