
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'moderator' | 'user' | 'super_admin';
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }

        // Si super_admin stocké en localStorage, autoriser l'accès
        const userRole = localStorage.getItem('userRole');
        const isImpersonating = localStorage.getItem('isImpersonating') === 'true';
        
        if (userRole === 'super_admin' || isImpersonating) {
          setIsLoading(false);
          return;
        }

        // Si un rôle spécifique est requis, vérifier les autorisations
        if (requiredRole) {
          // Ici, vous devriez vérifier si l'utilisateur a le rôle requis
          // Pour cet exemple, on ne fait pas de vérification supplémentaire
          // En production, vous devriez interroger votre base de données
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/auth");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === "SIGNED_OUT") {
        localStorage.removeItem('userRole');
        localStorage.removeItem('isImpersonating');
        localStorage.removeItem('impersonatedRole');
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
