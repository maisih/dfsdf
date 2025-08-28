-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  name TEXT NOT NULL,
  profession TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  role TEXT DEFAULT 'worker',
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members
CREATE POLICY "Project members can view team members" 
ON public.team_members 
FOR SELECT 
USING (project_id IN ( 
  SELECT project_members.project_id
  FROM project_members
  WHERE (project_members.user_id = auth.uid())
));

CREATE POLICY "Engineers can manage team members" 
ON public.team_members 
FOR ALL 
USING (get_user_role_safe(auth.uid()) = 'engineer'::user_role);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();