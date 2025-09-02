import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvitationAuth } from '@/contexts/InvitationAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Building2, Shield, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitationCode, setInvitationCode] = useState('');
  const { validateInvitation } = useInvitationAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInvitationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!invitationCode.trim()) {
      setError('Please enter an invitation code');
      setIsLoading(false);
      return;
    }

    const { success, error: validationError } = await validateInvitation(invitationCode.trim());
    
    if (success) {
      toast({
        title: "Access granted!",
        description: "Welcome to Construction Manager.",
      });
      navigate('/');
    } else {
      setError(validationError || 'Invalid invitation code');
      toast({
        variant: "destructive",
        title: "Access denied",
        description: validationError || 'Invalid invitation code',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Building2 className="h-12 w-12 text-primary" />
              <Shield className="h-6 w-6 text-accent absolute -top-1 -right-1 bg-background rounded-full p-1" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Construction Manager</h1>
          <p className="text-muted-foreground mt-2">Secure access with invitation code</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Secure Access</CardTitle>
            </div>
            <CardDescription>
              Enter your invitation code to access the construction management system.
              This ensures secure and authorized access to project data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleInvitationSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invitation-code">Invitation Code</Label>
                <Input
                  id="invitation-code"
                  name="invitationCode"
                  type="text"
                  placeholder="Enter your invitation code (e.g., ENG2024)"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                  required
                  disabled={isLoading}
                  className="text-center text-lg font-mono"
                  maxLength={20}
                />
              </div>
              
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4" />
                  <strong>Security Features:</strong>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• Encrypted session validation</li>
                  <li>• Rate limiting protection</li>
                  <li>• Browser fingerprint verification</li>
                  <li>• Automatic session expiry</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Validating...' : 'Access System'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Need an invitation code?</p>
              <p>Contact your project administrator.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}