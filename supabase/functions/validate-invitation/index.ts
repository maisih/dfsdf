import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvitationValidationRequest {
  code: string;
  fingerprint?: string;
}

interface InvitationSession {
  sessionId: string;
  code: string;
  role: string;
  expiresAt: string;
  fingerprint: string;
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { attempts: number; lastAttempt: number }>();

// Active sessions store (in production, use Redis or similar)  
const sessionStore = new Map<string, InvitationSession>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { code, fingerprint } = await req.json() as InvitationValidationRequest;

    if (!code) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invitation code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `${clientIP}:${code}`;
    
    // Rate limiting: Max 5 attempts per hour per IP+code combination
    const now = Date.now();
    const rateLimit = rateLimitStore.get(rateLimitKey);
    
    if (rateLimit) {
      const hourAgo = now - (60 * 60 * 1000);
      if (rateLimit.lastAttempt > hourAgo && rateLimit.attempts >= 5) {
        return new Response(
          JSON.stringify({ success: false, error: 'Too many attempts. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      if (rateLimit.lastAttempt <= hourAgo) {
        rateLimit.attempts = 1;
      } else {
        rateLimit.attempts++;
      }
      rateLimit.lastAttempt = now;
    } else {
      rateLimitStore.set(rateLimitKey, { attempts: 1, lastAttempt: now });
    }

    // Validate invitation code with database
    const { data: invitation, error } = await supabaseClient
      .from('invitation_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .single();

    if (error || !invitation) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid invitation code' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invitation code has expired' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if invitation has reached max uses
    if (invitation.current_uses >= invitation.max_uses) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invitation code has been fully used' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate secure session
    const sessionId = crypto.randomUUID();
    const sessionFingerprint = fingerprint || crypto.randomUUID();
    
    // Create session with 24 hour expiry
    const sessionExpiresAt = new Date(now + (24 * 60 * 60 * 1000)).toISOString();
    
    const session: InvitationSession = {
      sessionId,
      code: invitation.code,
      role: invitation.role,
      expiresAt: sessionExpiresAt,
      fingerprint: sessionFingerprint
    };

    // Store session (in production, use secure storage like Redis)
    sessionStore.set(sessionId, session);

    // Update invitation usage
    await supabaseClient
      .from('invitation_codes')
      .update({ 
        current_uses: invitation.current_uses + 1,
        used_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    // Clear rate limit on successful validation
    rateLimitStore.delete(rateLimitKey);

    return new Response(
      JSON.stringify({ 
        success: true, 
        session: {
          sessionId,
          role: invitation.role,
          expiresAt: sessionExpiresAt,
          fingerprint: sessionFingerprint
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error validating invitation:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Export session validation function for other edge functions
export async function validateSession(sessionId: string, fingerprint?: string): Promise<InvitationSession | null> {
  const session = sessionStore.get(sessionId);
  
  if (!session) {
    return null;
  }

  // Check session expiry
  if (new Date(session.expiresAt) < new Date()) {
    sessionStore.delete(sessionId);
    return null;
  }

  // Verify fingerprint if provided
  if (fingerprint && session.fingerprint !== fingerprint) {
    return null;
  }

  return session;
}