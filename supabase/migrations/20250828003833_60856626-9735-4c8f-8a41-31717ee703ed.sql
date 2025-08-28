-- Create daily_logs table for tracking daily activities
CREATE TABLE public.daily_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weather TEXT,
  work_performed TEXT,
  laborers INTEGER DEFAULT 0,
  operators INTEGER DEFAULT 0,
  supervisors INTEGER DEFAULT 0,
  equipment_used TEXT,
  deliveries TEXT,
  issues TEXT,
  logged_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Project members can view daily logs"
ON public.daily_logs
FOR SELECT
USING (project_id IN (
  SELECT project_members.project_id
  FROM project_members
  WHERE project_members.user_id = auth.uid()
));

CREATE POLICY "Project members can create daily logs"
ON public.daily_logs
FOR INSERT
WITH CHECK (project_id IN (
  SELECT project_members.project_id
  FROM project_members
  WHERE project_members.user_id = auth.uid()
));

CREATE POLICY "Engineers can manage daily logs"
ON public.daily_logs
FOR ALL
USING (get_user_role_safe(auth.uid()) = 'engineer'::user_role);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_logs_updated_at
BEFORE UPDATE ON public.daily_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();