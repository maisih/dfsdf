-- Temporary fix: Allow public access for testing purposes
-- WARNING: This removes security - only use for development/testing

-- Allow public read/write access to tasks
DROP POLICY IF EXISTS "Project members can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Workers can update assigned tasks" ON public.tasks;
DROP POLICY IF EXISTS "Engineers can manage tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow task creation for testing" ON public.tasks;
CREATE POLICY "Allow all access to tasks for testing" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

-- Allow public access to team_members  
DROP POLICY IF EXISTS "Project members can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Engineers can manage team members" ON public.team_members;
CREATE POLICY "Allow all access to team_members for testing" ON public.team_members FOR ALL USING (true) WITH CHECK (true);

-- Allow public access to materials
DROP POLICY IF EXISTS "Project members can view materials" ON public.materials;  
DROP POLICY IF EXISTS "Engineers can manage materials" ON public.materials;
CREATE POLICY "Allow all access to materials for testing" ON public.materials FOR ALL USING (true) WITH CHECK (true);

-- Allow public access to expenses
DROP POLICY IF EXISTS "Project members can view expenses" ON public.expenses;
DROP POLICY IF EXISTS "Engineers can manage expenses" ON public.expenses;  
CREATE POLICY "Allow all access to expenses for testing" ON public.expenses FOR ALL USING (true) WITH CHECK (true);