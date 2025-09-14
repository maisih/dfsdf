import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Shield, Users, Clock } from 'lucide-react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [invitation, setInvitation] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('invitation');
  const navigate = useNavigate();
  const { validateInvitation, createAccount, signIn } = useSecureAuth();
  const { toast } = useToast();

  const handleInvitationValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await validateInvitation(invitationCode);
      if (result.success) {
        setInvitation(result.invitation);
        setActiveTab('register');
        toast({
          title: 'Invitation Valid',
          description: `Ready to create your ${result.invitation.role} account.`,
        });
      } else {
        setError(result.error || 'Invalid invitation code');
        toast({
          title: 'Invalid Invitation',
          description: result.error || 'Please check your invitation code.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await createAccount(invitationCode, email, password, fullName);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Failed to create account');
        toast({
          title: 'Account Creation Failed',
          description: result.error || 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Sign in failed');
        toast({
          title: 'Sign In Failed',
          description: result.error || 'Please check your credentials.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">SiteFlow Master</CardTitle>
          <CardDescription>
            Secure construction management platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="invitation">Invitation</TabsTrigger>
              <TabsTrigger value="register" disabled={!invitation}>Register</TabsTrigger>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
            </TabsList>
            
            <TabsContent value="invitation" className="space-y-4">
              <form onSubmit={handleInvitationValidation} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter invitation code"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    disabled={loading}
                    className="text-center font-mono"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !invitationCode.trim()}
                >
                  {loading ? 'Validating...' : 'Validate Invitation'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              {invitation && (
                <div className="text-sm text-center text-muted-foreground mb-4">
                  Creating <span className="font-medium text-primary">{invitation.role}</span> account
                </div>
              )}
              <form onSubmit={handleAccountCreation} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <Input
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !email || !password || !fullName}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !email || !password}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <Shield className="h-6 w-6 text-primary" />
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium">Secure Access</div>
                  <div>Encrypted sessions</div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-6 w-6 text-primary" />
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium">Team Access</div>
                  <div>Role-based</div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Clock className="h-6 w-6 text-primary" />
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium">Auto-logout</div>
                  <div>Security timeout</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center text-xs text-muted-foreground">
              Need an invitation code? Contact your project administrator.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}