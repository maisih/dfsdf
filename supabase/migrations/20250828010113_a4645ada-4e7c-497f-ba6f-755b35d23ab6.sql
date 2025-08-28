-- Add cost column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN cost NUMERIC;