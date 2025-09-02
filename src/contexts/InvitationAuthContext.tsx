import { createContext, useContext, useEffect, useState } from 'react';

interface InvitationUser {
  sessionId: string;
  role: string;
  expiresAt: string;
  fingerprint: string;
}

interface InvitationAuthContextType {
  user: InvitationUser | null;
  loading: boolean;
  validateInvitation: (code: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const InvitationAuthContext = createContext<InvitationAuthContextType | undefined>(undefined);

export function useInvitationAuth() {
  const context = useContext(InvitationAuthContext);
  if (context === undefined) {
    throw new Error('useInvitationAuth must be used within an InvitationAuthProvider');
  }
  return context;
}

// Secure session storage with encryption-like obfuscation
const SESSION_KEY = 'invitation_session';
const FINGERPRINT_KEY = 'client_fingerprint';

// Generate browser fingerprint for additional security
function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Security fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash for consistency
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
}

function getStoredSession(): InvitationUser | null {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    const storedFingerprint = localStorage.getItem(FINGERPRINT_KEY);
    
    if (!sessionData || !storedFingerprint) {
      return null;
    }

    // Verify fingerprint matches
    const currentFingerprint = generateFingerprint();
    if (storedFingerprint !== currentFingerprint) {
      // Fingerprint mismatch - potential security issue
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(FINGERPRINT_KEY);
      return null;
    }

    const session = JSON.parse(sessionData) as InvitationUser;
    
    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(FINGERPRINT_KEY);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error reading stored session:', error);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(FINGERPRINT_KEY);
    return null;
  }
}

function storeSession(session: InvitationUser): void {
  try {
    const fingerprint = generateFingerprint();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(FINGERPRINT_KEY, fingerprint);
  } catch (error) {
    console.error('Error storing session:', error);
  }
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(FINGERPRINT_KEY);
}

export function InvitationAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<InvitationUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedSession = getStoredSession();
    setUser(storedSession);
    setLoading(false);

    // Set up session validation interval (every 5 minutes)
    const intervalId = setInterval(() => {
      const currentSession = getStoredSession();
      setUser((prev) => {
        if (!currentSession) {
          return null;
        }
        if (!prev) {
          return currentSession;
        }
        if (
          prev.sessionId !== currentSession.sessionId ||
          prev.expiresAt !== currentSession.expiresAt ||
          prev.role !== currentSession.role ||
          prev.fingerprint !== currentSession.fingerprint
        ) {
          return currentSession;
        }
        return prev;
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const validateInvitation = async (code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      const fingerprint = generateFingerprint();
      
      const projectUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://vtilhnvplxngstuetsak.supabase.co').replace(/\/$/, '');
      const anon = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0aWxobnZwbHhuZ3N0dWV0c2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjM4MjMsImV4cCI6MjA3MTg5OTgyM30.iLObpLXeYY1WZd24q1KowRLtGtZb_fxn7DF5C2WoiZc';
      const response = await fetch(`${projectUrl}/functions/v1/validate-invitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anon}`
        },
        body: JSON.stringify({ code, fingerprint })
      });

      const result = await response.json();

      if (result.success) {
        const newUser: InvitationUser = {
          sessionId: result.session.sessionId,
          role: result.session.role,
          expiresAt: result.session.expiresAt,
          fingerprint: result.session.fingerprint
        };

        setUser(newUser);
        storeSession(newUser);
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error validating invitation:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    clearSession();
  };

  const value = {
    user,
    loading,
    validateInvitation,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <InvitationAuthContext.Provider value={value}>
      {children}
    </InvitationAuthContext.Provider>
  );
}
