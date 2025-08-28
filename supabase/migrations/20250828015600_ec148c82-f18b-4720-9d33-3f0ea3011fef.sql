-- Add policy to allow task creation for testing
CREATE POLICY "Allow task creation for testing" 
ON public.tasks 
FOR INSERT 
WITH CHECK (true);