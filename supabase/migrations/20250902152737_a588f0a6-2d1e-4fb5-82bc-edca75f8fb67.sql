-- CRITICAL SECURITY FIX: Replace public RLS policies with proper access control

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow viewing all projects" ON public.projects;
DROP POLICY IF EXISTS "Allow project creation for testing" ON public.projects;
DROP POLICY IF EXISTS "Allow project updates for testing" ON public.projects;
DROP POLICY IF EXISTS "Allow project deletion for testing" ON public.projects;

DROP POLICY IF EXISTS "Allow all access to team_members for testing" ON public.team_members;
DROP POLICY IF EXISTS "Allow all access to expenses for testing" ON public.expenses;
DROP POLICY IF EXISTS "Allow all access to materials for testing" ON public.materials;
DROP POLICY IF EXISTS "Allow all access to tasks for testing" ON public.tasks;

-- PROJECTS: Only project members can access
CREATE POLICY "Project members can view projects"
ON public.projects
FOR SELECT
USING (
  id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Engineers can create projects"
ON public.projects
FOR INSERT  
WITH CHECK (get_user_role_safe(auth.uid()) = 'engineer'::user_role);

CREATE POLICY "Project members can update projects"
ON public.projects
FOR UPDATE
USING (
  id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Engineers can delete projects"
ON public.projects
FOR DELETE
USING (get_user_role_safe(auth.uid()) = 'engineer'::user_role);

-- TEAM MEMBERS: Only project members can access
CREATE POLICY "Project members can view team members"
ON public.team_members
FOR SELECT
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can add team members"
ON public.team_members
FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can update team members"
ON public.team_members
FOR UPDATE
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can delete team members"
ON public.team_members
FOR DELETE
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

-- EXPENSES: Only project members can access
CREATE POLICY "Project members can view expenses"
ON public.expenses
FOR SELECT
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can create expenses"
ON public.expenses
FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
  AND recorded_by = auth.uid()
);

CREATE POLICY "Project members can update expenses"
ON public.expenses
FOR UPDATE
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can delete expenses"
ON public.expenses
FOR DELETE
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

-- MATERIALS: Only project members can access
CREATE POLICY "Project members can view materials"
ON public.materials
FOR SELECT
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can create materials"
ON public.materials
FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
  AND ordered_by = auth.uid()
);

CREATE POLICY "Project members can update materials"
ON public.materials
FOR UPDATE
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can delete materials"
ON public.materials
FOR DELETE
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

-- TASKS: Only project members can access
CREATE POLICY "Project members can view tasks"
ON public.tasks
FOR SELECT
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can create tasks"
ON public.tasks
FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Project members can update tasks"
ON public.tasks
FOR UPDATE
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can delete tasks"
ON public.tasks
FOR DELETE
USING (
  project_id IN (
    SELECT project_id 
    FROM project_members 
    WHERE user_id = auth.uid()
  )
);

-- Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', 'User'),
    'worker'::user_role
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();