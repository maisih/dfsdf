import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecureUser {
  id: string;
  email: string;
  fullName: string;
  role: 'engineer' | 'worker' | 'visitor';
  companyId: string;
  sessionToken: string;
  expiresAt: string;
}

interface SecureAuthContextType {
  user: SecureUser | null;
  session: Session | null;
  loading: boolean;
  validateInvitation: (code: string) => Promise<{ success: boolean; error?: string; invitation?: any }>;
  createAccount: (code: string, email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export function useSecureAuth() {
  const context = useContext(SecureAuthContext);
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  return context;
}

// Generate browser fingerprint for security
function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 10, 10);
  const canvasFingerprint = canvas.toDataURL();
  
  const fingerprint = btoa(JSON.stringify({
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${screen.width}x${screen.height}`,
    canvas: canvasFingerprint.slice(-50),
    timestamp: Date.now()
  }));
  
  return fingerprint;
}

// Session storage utilities
const SESSION_KEY = 'secure_auth_session';
const FINGERPRINT_KEY = 'secure_auth_fingerprint';

function getStoredSession(): SecureUser | null {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    const storedFingerprint = localStorage.getItem(FINGERPRINT_KEY);
    
    if (!sessionData || !storedFingerprint) return null;
    
    const session = JSON.parse(sessionData);
    const currentFingerprint = generateFingerprint();
    
    // Verify fingerprint matches (basic security check)
    if (storedFingerprint !== currentFingerprint) {
      clearSession();
      return null;
    }
    
    // Check if session has expired
    if (new Date(session.expiresAt) <= new Date()) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error retrieving session:', error);
    clearSession();
    return null;
  }
}

function storeSession(user: SecureUser): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    localStorage.setItem(FINGERPRINT_KEY, generateFingerprint());
  } catch (error) {
    console.error('Error storing session:', error);
  }
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(FINGERPRINT_KEY);
}

export function SecureAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SecureUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize authentication state
  useEffect(() => {
    // Set up Supabase auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // If we have a Supabase session, try to get our secure session
          const storedUser = getStoredSession();
          if (storedUser) {
            // Validate the stored session with the backend
            try {
              const response = await supabase.functions.invoke('secure-auth', {
                body: {
                  action: 'authenticate',
                  sessionToken: storedUser.sessionToken
                }
              });

              if (response.data?.success) {
                setUser(storedUser);
              } else {
                clearSession();
                setUser(null);
              }
            } catch (error) {
              console.error('Session validation failed:', error);
              clearSession();
              setUser(null);
            }
          }
        } else {
          // No Supabase session, clear everything
          clearSession();
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Check if we have a stored secure session and try to restore it
        const storedUser = getStoredSession();
        if (storedUser) {
          // Try to validate with backend
          supabase.functions.invoke('secure-auth', {
            body: {
              action: 'authenticate',
              sessionToken: storedUser.sessionToken
            }
          }).then(response => {
            if (response.data?.success) {
              setUser(storedUser);
            } else {
              clearSession();
            }
            setLoading(false);
          }).catch(() => {
            clearSession();
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Periodic session validation (every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const response = await supabase.functions.invoke('secure-auth', {
          body: {
            action: 'authenticate',
            sessionToken: user.sessionToken
          }
        });

        if (!response.data?.success) {
          console.log('Session validation failed, signing out');
          await signOut();
        }
      } catch (error) {
        console.error('Session validation error:', error);
        await signOut();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  const validateInvitation = async (code: string) => {
    try {
      const response = await supabase.functions.invoke('secure-auth', {
        body: {
          action: 'validate_invitation',
          code
        }
      });

      return response.data || { success: false, error: 'Failed to validate invitation' };
    } catch (error) {
      console.error('Error validating invitation:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const createAccount = async (code: string, email: string, password: string, fullName: string) => {
    try {
      const fingerprint = generateFingerprint();
      
      const response = await supabase.functions.invoke('secure-auth', {
        body: {
          action: 'create_account',
          code,
          email,
          password,
          fullName,
          fingerprint
        }
      });

      if (response.data?.success) {
        const userData = response.data;
        const secureUser: SecureUser = {
          id: userData.user.id,
          email: userData.user.email,
          fullName: userData.user.fullName,
          role: userData.user.role,
          companyId: userData.user.companyId,
          sessionToken: userData.sessionToken,
          expiresAt: userData.expiresAt
        };

        // Store session and sign in to Supabase
        storeSession(secureUser);
        setUser(secureUser);

        // Sign in to Supabase for RLS policies to work
        await supabase.auth.signInWithPassword({ email, password });

        toast({
          title: 'Account created successfully',
          description: 'Welcome to SiteFlow Master!'
        });

        return { success: true };
      } else {
        return { success: false, error: response.data?.error || 'Failed to create account' };
      }
    } catch (error) {
      console.error('Error creating account:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // First sign in to Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Sign in failed' };
      }

      // Get the user's profile to create secure session
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, error: 'User profile not found' };
      }

      // Create secure session token
      const sessionToken = crypto.randomUUID() + '-' + Date.now();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      // Store session in database
      const { error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: data.user.id,
          session_token: sessionToken,
          role: profile.role,
          company_id: profile.company_id,
          fingerprint: generateFingerprint(),
          expires_at: expiresAt
        });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
      }

      const secureUser: SecureUser = {
        id: data.user.id,
        email: data.user.email!,
        fullName: profile.full_name || '',
        role: profile.role,
        companyId: profile.company_id || '',
        sessionToken,
        expiresAt
      };

      storeSession(secureUser);
      setUser(secureUser);

      toast({
        title: 'Signed in successfully',
        description: 'Welcome back!'
      });

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signOut = async () => {
    try {
      // Revoke session in backend
      if (user?.sessionToken) {
        await supabase.functions.invoke('secure-auth', {
          body: {
            action: 'revoke_session',
            sessionToken: user.sessionToken
          }
        });
      }

      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local storage
      clearSession();
      setUser(null);
      setSession(null);

      toast({
        title: 'Signed out successfully',
        description: 'See you next time!'
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local state even if backend call fails
      clearSession();
      setUser(null);
      setSession(null);
    }
  };

  const value = {
    user,
    session,
    loading,
    validateInvitation,
    createAccount,
    signIn,
    signOut,
    isAuthenticated: !!user && !!session
  };

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  );
}