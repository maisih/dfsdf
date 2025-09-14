import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthRequest {
  action: 'validate_invitation' | 'create_account' | 'authenticate' | 'revoke_session';
  code?: string;
  email?: string;
  password?: string;
  fullName?: string;
  fingerprint?: string;
  sessionToken?: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    companyId: string;
  };
  sessionToken?: string;
  expiresAt?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, code, email, password, fullName, fingerprint, sessionToken }: AuthRequest = await req.json();

    console.log(`Auth action: ${action}`);

    switch (action) {
      case 'validate_invitation': {
        if (!code) {
          return Response.json(
            { success: false, error: 'Invitation code is required' },
            { headers: corsHeaders, status: 400 }
          );
        }

        // Validate invitation code
        const { data: invitation, error: inviteError } = await supabase
          .from('invitation_codes')
          .select('*')
          .eq('code', code)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (inviteError || !invitation) {
          return Response.json(
            { success: false, error: 'Invalid or expired invitation code' },
            { headers: corsHeaders, status: 400 }
          );
        }

        if (invitation.max_uses && invitation.current_uses >= invitation.max_uses) {
          return Response.json(
            { success: false, error: 'Invitation code has reached maximum uses' },
            { headers: corsHeaders, status: 400 }
          );
        }

        return Response.json(
          { 
            success: true, 
            invitation: {
              role: invitation.role,
              companyId: invitation.company_id
            }
          },
          { headers: corsHeaders }
        );
      }

      case 'create_account': {
        if (!code || !email || !password || !fullName) {
          return Response.json(
            { success: false, error: 'All fields are required' },
            { headers: corsHeaders, status: 400 }
          );
        }

        // First validate the invitation
        const { data: invitation, error: inviteError } = await supabase
          .from('invitation_codes')
          .select('*')
          .eq('code', code)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (inviteError || !invitation) {
          return Response.json(
            { success: false, error: 'Invalid or expired invitation code' },
            { headers: corsHeaders, status: 400 }
          );
        }

        // Create Supabase user account
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            role: invitation.role,
            company_id: invitation.company_id
          }
        });

        if (authError || !authData.user) {
          console.error('Auth error:', authError);
          return Response.json(
            { success: false, error: authError?.message || 'Failed to create user account' },
            { headers: corsHeaders, status: 400 }
          );
        }

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            full_name: fullName,
            role: invitation.role,
            company_id: invitation.company_id
          });

        if (profileError) {
          console.error('Profile error:', profileError);
        }

        // Create secure session
        const sessionToken = crypto.randomUUID() + '-' + Date.now();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        const { error: sessionError } = await supabase
          .from('user_sessions')
          .insert({
            user_id: authData.user.id,
            session_token: sessionToken,
            invitation_code: code,
            role: invitation.role,
            company_id: invitation.company_id,
            fingerprint,
            expires_at: expiresAt.toISOString()
          });

        if (sessionError) {
          console.error('Session error:', sessionError);
        }

        // Update invitation usage
        await supabase
          .from('invitation_codes')
          .update({
            current_uses: invitation.current_uses + 1,
            used_at: new Date().toISOString(),
            created_user_id: authData.user.id
          })
          .eq('id', invitation.id);

        // Log audit event
        await supabase
          .from('audit_logs')
          .insert({
            user_id: authData.user.id,
            event_type: 'user_created_from_invitation',
            event_details: {
              invitation_code: code,
              email: email
            }
          });

        return Response.json(
          {
            success: true,
            user: {
              id: authData.user.id,
              email: authData.user.email!,
              fullName,
              role: invitation.role,
              companyId: invitation.company_id
            },
            sessionToken,
            expiresAt: expiresAt.toISOString()
          },
          { headers: corsHeaders }
        );
      }

      case 'authenticate': {
        if (!sessionToken) {
          return Response.json(
            { success: false, error: 'Session token is required' },
            { headers: corsHeaders, status: 400 }
          );
        }

        // Validate session
        const { data: session, error: sessionError } = await supabase
          .from('user_sessions')
          .select(`
            *,
            profiles!inner(*)
          `)
          .eq('session_token', sessionToken)
          .gt('expires_at', new Date().toISOString())
          .is('revoked_at', null)
          .single();

        if (sessionError || !session) {
          return Response.json(
            { success: false, error: 'Invalid or expired session' },
            { headers: corsHeaders, status: 401 }
          );
        }

        // Update last activity
        await supabase
          .from('user_sessions')
          .update({ last_activity: new Date().toISOString() })
          .eq('session_token', sessionToken);

        return Response.json(
          {
            success: true,
            user: {
              id: session.user_id,
              email: session.profiles.user_id, // We'll need to get this from auth.users
              fullName: session.profiles.full_name,
              role: session.role,
              companyId: session.company_id
            },
            expiresAt: session.expires_at
          },
          { headers: corsHeaders }
        );
      }

      case 'revoke_session': {
        if (!sessionToken) {
          return Response.json(
            { success: false, error: 'Session token is required' },
            { headers: corsHeaders, status: 400 }
          );
        }

        // Revoke session
        const { error: revokeError } = await supabase
          .from('user_sessions')
          .update({ revoked_at: new Date().toISOString() })
          .eq('session_token', sessionToken);

        if (revokeError) {
          console.error('Revoke error:', revokeError);
        }

        return Response.json(
          { success: true },
          { headers: corsHeaders }
        );
      }

      default:
        return Response.json(
          { success: false, error: 'Invalid action' },
          { headers: corsHeaders, status: 400 }
        );
    }

  } catch (error) {
    console.error('Auth function error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { headers: corsHeaders, status: 500 }
    );
  }
});