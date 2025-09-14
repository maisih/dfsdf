-- Phase 1: Create secure session management and audit logging tables

-- Create user_sessions table for persistent session management
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  invitation_code TEXT,
  role user_role NOT NULL,
  company_id UUID,
  fingerprint TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create audit_logs table for security event tracking
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, 
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions"
ON public.user_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Engineers can view sessions within their company"
ON public.user_sessions
FOR SELECT
USING (
  get_user_role_safe(auth.uid()) = 'engineer'::user_role
  AND company_id IN (
    SELECT profiles.company_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "System can manage sessions"
ON public.user_sessions
FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for audit_logs  
CREATE POLICY "Engineers can view audit logs within their company"
ON public.audit_logs
FOR SELECT
USING (
  get_user_role_safe(auth.uid()) = 'engineer'::user_role
  AND EXISTS (
    SELECT 1 FROM public.user_sessions us
    WHERE us.id = session_id
    AND us.company_id IN (
      SELECT profiles.company_id 
      FROM profiles 
      WHERE profiles.user_id = auth.uid()
    )
  )
);

-- Create indexes for performance
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions(expires_at);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.user_sessions 
  WHERE expires_at < now() OR revoked_at IS NOT NULL;
END;
$$;

-- Create function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_user_id UUID,
  p_session_id UUID,
  p_event_type TEXT,
  p_event_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id, session_id, event_type, event_details, 
    ip_address, user_agent
  ) VALUES (
    p_user_id, p_session_id, p_event_type, p_event_details,
    p_ip_address, p_user_agent
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Update invitation_codes table to link with Supabase users
ALTER TABLE public.invitation_codes 
ADD COLUMN IF NOT EXISTS created_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create function to handle invitation-based user creation
CREATE OR REPLACE FUNCTION public.create_user_from_invitation(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_invitation_code TEXT,
  p_fingerprint TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation_rec invitation_codes%ROWTYPE;
  new_user_id UUID;
  session_rec user_sessions%ROWTYPE;
  result JSONB;
BEGIN
  -- Validate invitation code
  SELECT * INTO invitation_rec
  FROM invitation_codes 
  WHERE code = p_invitation_code
  AND expires_at > now()
  AND (max_uses IS NULL OR current_uses < max_uses);
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invitation code');
  END IF;
  
  -- Create Supabase user account
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
  ) VALUES (
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    jsonb_build_object(
      'full_name', p_full_name,
      'role', invitation_rec.role::text,
      'company_id', invitation_rec.company_id::text
    )
  ) RETURNING id INTO new_user_id;
  
  -- Create profile
  INSERT INTO public.profiles (
    user_id, full_name, role, company_id
  ) VALUES (
    new_user_id, p_full_name, invitation_rec.role, invitation_rec.company_id
  );
  
  -- Update invitation usage
  UPDATE invitation_codes 
  SET 
    current_uses = current_uses + 1,
    used_at = now(),
    created_user_id = new_user_id
  WHERE id = invitation_rec.id;
  
  -- Create session
  INSERT INTO public.user_sessions (
    user_id, session_token, invitation_code, role, company_id,
    fingerprint, expires_at
  ) VALUES (
    new_user_id,
    encode(gen_random_bytes(32), 'base64'),
    p_invitation_code,
    invitation_rec.role,
    invitation_rec.company_id,
    p_fingerprint,
    now() + interval '30 days'
  ) RETURNING * INTO session_rec;
  
  -- Log audit event
  PERFORM log_audit_event(
    new_user_id,
    session_rec.id,
    'user_created_from_invitation',
    jsonb_build_object(
      'invitation_code', p_invitation_code,
      'email', p_email
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'user_id', new_user_id,
    'session_token', session_rec.session_token,
    'role', invitation_rec.role,
    'company_id', invitation_rec.company_id
  );
END;
$$;