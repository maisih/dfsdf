-- Add policy to allow project deletion for testing
CREATE POLICY "Allow project deletion for testing" 
ON public.projects 
FOR DELETE 
USING (true);