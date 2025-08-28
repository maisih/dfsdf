-- Fix infinite recursion in project_members policies
-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Members can view project membership" ON public.project_members;

-- Create a simpler, non-recursive policy
CREATE POLICY "Users can view their own membership" 
ON public.project_members 
FOR SELECT 
USING (user_id = auth.uid());

-- Create policy for viewing other project members (if you're in the project)
CREATE POLICY "Members can view project team" 
ON public.project_members 
FOR SELECT 
USING (
  project_id IN (
    SELECT pm.project_id 
    FROM public.project_members pm 
    WHERE pm.user_id = auth.uid()
  )
);

-- Ensure users can be added to projects
CREATE POLICY "Allow project member insertion" 
ON public.project_members 
FOR INSERT 
WITH CHECK (true);

-- Fix the get_user_role function to prevent recursion
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE user_id = user_uuid LIMIT 1),
    'worker'::user_role
  );
$$;

-- Update projects policies to use the safe function
DROP POLICY IF EXISTS "Engineers can manage projects" ON public.projects;
CREATE POLICY "Engineers can manage projects" 
ON public.projects 
FOR ALL 
USING (get_user_role_safe(auth.uid()) = 'engineer'::user_role);

-- Also add a policy for creating initial user profiles
CREATE POLICY IF NOT EXISTS "Allow profile creation" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);