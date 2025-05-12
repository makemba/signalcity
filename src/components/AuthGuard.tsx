
import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/store/userStore";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'moderator' | 'user' | 'super_admin';
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isAuthenticated, setUser } = useUserStore();
  
  // For testing purposes, check localStorage for role
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole && !user?.role) {
      setUser({
        id: 'test-user',
        email: `${storedRole}@example.com`,
        role: storedRole as 'super_admin' | 'admin' | 'moderator' | 'user',
        name: `Test ${storedRole.charAt(0).toUpperCase() + storedRole.slice(1)}`
      });
    }
  }, [setUser, user]);
  
  // Simulate loading state while checking auth
  if (!isAuthenticated && !user) {
    // For simplified testing, we'll auto-authenticate as user
    setUser({
      id: 'test-user',
      email: 'user@example.com',
      role: 'user',
      name: 'Test User'
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Check if user has required role
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}
