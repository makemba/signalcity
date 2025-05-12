
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

export default function Auth() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  // Rediriger si déjà connecté
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      navigate('/');
    }
  }, [navigate]);

  // Function to login as different roles for testing
  const handleRoleLogin = (role: 'super_admin' | 'admin' | 'moderator' | 'user') => {
    // Set in Zustand store
    setUser({
      id: `test-${role}`,
      email: `${role}@example.com`,
      role: role,
      name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`
    });
    
    // For backward compatibility, also set in localStorage
    localStorage.setItem('userRole', role);
    localStorage.setItem('isImpersonating', 'false');
    
    toast.success(`Connecté en tant que ${role}`);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <Shield className="h-12 w-12 text-primary mb-4" />
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Report Helper Hub
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 mb-6">
            Mode test simplifié - Sélectionnez un rôle pour continuer
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => handleRoleLogin('super_admin')} 
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Connexion Super Admin
          </Button>
          
          <Button 
            onClick={() => handleRoleLogin('admin')} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Connexion Admin
          </Button>
          
          <Button 
            onClick={() => handleRoleLogin('moderator')} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Connexion Modérateur
          </Button>
          
          <Button 
            onClick={() => handleRoleLogin('user')} 
            className="w-full"
          >
            Connexion Utilisateur Standard
          </Button>
          
          <Button 
            onClick={() => handleRoleLogin('admin')} 
            variant="secondary" 
            className="w-full"
          >
            Connexion Automatique (Admin)
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p className="text-xs text-gray-500 mt-4">
            Mode test - Pas besoin de mot de passe
          </p>
        </div>
      </Card>
    </div>
  );
};
