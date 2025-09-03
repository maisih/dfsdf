import { useInvitationAuth } from '@/contexts/InvitationAuthContext';
import { Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useInvitationAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function RoleProtectedRoute({ children, allowedRoles, redirectTo = "/" }: RoleProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useInvitationAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const role = (user?.role || '').toLowerCase();
  const allowed = allowedRoles.map(r => r.toLowerCase());
  if (!allowed.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
