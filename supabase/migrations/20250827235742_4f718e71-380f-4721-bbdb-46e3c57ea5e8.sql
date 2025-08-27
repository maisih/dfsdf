-- Temporary policy to allow project creation without authentication
-- This should be removed once proper authentication is implemented
CREATE POLICY "Allow project creation for testing" 
ON public.projects 
FOR INSERT 
WITH CHECK (true);

-- Also allow updates for testing
CREATE POLICY "Allow project updates for testing" 
ON public.projects 
FOR UPDATE 
USING (true);