-- CRITICAL SECURITY FIX: Restrict profile visibility to protect user privacy
-- Replace the overly permissive "Users can view all profiles" policy

-- Drop the problematic policy that exposes all user data
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create secure profile visibility policies
-- Users can always see their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Users can see profiles of other users who are in the same projects
CREATE POLICY "Users can view project members profiles"
ON public.profiles
FOR SELECT
USING (
  user_id IN (
    SELECT DISTINCT pm.user_id
    FROM project_members pm
    WHERE pm.project_id IN (
      SELECT project_id
      FROM project_members
      WHERE user_id = auth.uid()
    )
  )
);

-- Engineers can view all profiles (for administrative purposes)
CREATE POLICY "Engineers can view all profiles"
ON public.profiles
FOR SELECT
USING (get_user_role_safe(auth.uid()) = 'engineer'::user_role);