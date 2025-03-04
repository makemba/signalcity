import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Loader2, AlertTriangle, Shield, UserCheck } from "lucide-react";
import type { AuthError } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");

  useEffect(() => {
    console.log("Auth component mounted");
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/");
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (session) {
        navigate("/");
      }
      if (event === "SIGNED_OUT") {
        setErrorMessage("");
        setAttempts(0);
        setIsBlocked(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (attempts >= 5) {
      setIsBlocked(true);
      setTimeout(() => {
        setIsBlocked(false);
        setAttempts(0);
      }, 300000); // 5 minutes
    }
  }, [attempts]);

  const getErrorMessage = (error: AuthError) => {
    setAttempts(prev => prev + 1);
    setLastAttempt(new Date());

    switch (error.message) {
      case "Invalid login credentials":
        return "Email ou mot de passe incorrect.";
      case "Email not confirmed":
        return "Veuillez vérifier votre email avant de vous connecter.";
      case "Too many requests":
        return "Trop de tentatives. Veuillez réessayer plus tard.";
      case "Email link is invalid or has expired":
        return "Le lien de connexion est invalide ou a expiré.";
      case "Password should be at least 6 characters":
        return "Le mot de passe doit contenir au moins 6 caractères.";
      default:
        return "Une erreur est survenue. Veuillez réessayer.";
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clé secrète d'administrateur (à remplacer par une vérification plus sécurisée en production)
    const ADMIN_SECRET_KEY = "master_admin_2024";
    
    if (adminKey !== ADMIN_SECRET_KEY) {
      setErrorMessage("Clé d'administrateur invalide");
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });
      
      if (error) throw error;

      // Marquer l'utilisateur comme super_admin dans la session
      if (data.user) {
        // Dans une vraie application, vous devriez vérifier ce rôle dans la base de données
        // et ne pas le stocker dans le localStorage comme ici
        localStorage.setItem('userRole', 'super_admin');
        localStorage.setItem('isImpersonating', 'false');
        toast.success("Connecté en tant que Super Admin");
        navigate("/admin-dashboard");
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      setErrorMessage(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <Shield className="h-12 w-12 text-primary mb-4" />
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Report Helper Hub
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Votre plateforme de signalement sécurisée
          </p>
          
          {!isAdminLogin && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setIsAdminLogin(true)}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Connexion Administrateur
            </Button>
          )}
          
          {isAdminLogin && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setIsAdminLogin(false)}
            >
              Retour à la connexion standard
            </Button>
          )}
        </div>

        {isBlocked && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Compte temporairement bloqué</AlertTitle>
            <AlertDescription>
              Trop de tentatives de connexion. Veuillez réessayer dans 5 minutes.
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {lastAttempt && attempts > 2 && !isBlocked && (
          <Alert>
            <AlertDescription>
              Dernière tentative: {lastAttempt.toLocaleTimeString()}. 
              {5 - attempts} tentatives restantes.
            </AlertDescription>
          </Alert>
        )}

        {!isAdminLogin ? (
          <div className="mt-8">
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                style: {
                  button: {
                    background: '#1E3A8A',
                    color: 'white',
                    borderRadius: '0.375rem',
                  },
                  anchor: {
                    color: '#1E3A8A',
                  },
                  container: {
                    color: '#374151',
                  },
                },
              }}
              theme="light"
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Email",
                    password_label: "Mot de passe",
                    button_label: "Se connecter",
                    loading_button_label: "Connexion en cours...",
                    social_provider_text: "Continuer avec {{provider}}",
                    link_text: "Vous avez déjà un compte ? Connectez-vous",
                  },
                  sign_up: {
                    email_label: "Email",
                    password_label: "Mot de passe",
                    button_label: "S'inscrire",
                    loading_button_label: "Inscription en cours...",
                    social_provider_text: "S'inscrire avec {{provider}}",
                    link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
                  },
                  magic_link: {
                    button_label: "Envoyer le lien magique",
                    loading_button_label: "Envoi du lien en cours...",
                  },
                  forgotten_password: {
                    button_label: "Réinitialiser le mot de passe",
                    loading_button_label: "Envoi des instructions...",
                  },
                },
              }}
            />
          </div>
        ) : (
          <form onSubmit={handleAdminLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="admin-email">Email Administrateur</Label>
                <Input 
                  id="admin-email" 
                  type="email" 
                  value={adminEmail} 
                  onChange={(e) => setAdminEmail(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Mot de passe</Label>
                <Input 
                  id="admin-password" 
                  type="password" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="admin-key">Clé Super Admin</Label>
                <Input 
                  id="admin-key" 
                  type="password" 
                  value={adminKey} 
                  onChange={(e) => setAdminKey(e.target.value)} 
                  required 
                  placeholder="Entrez la clé secrète"
                />
              </div>
            </div>
            <Alert className="my-4">
              <AlertTitle>Identifiants Super Admin de test</AlertTitle>
              <AlertDescription>
                <p><strong>Email:</strong> admin@example.com</p>
                <p><strong>Mot de passe:</strong> password123</p>
                <p><strong>Clé secrète:</strong> master_admin_2024</p>
              </AlertDescription>
            </Alert>
            <Button type="submit" className="w-full">
              Connexion Super Admin
            </Button>
          </form>
        )}

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            En vous connectant, vous acceptez nos{" "}
            <a href="/terms" className="font-medium text-primary hover:text-primary/80">
              conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="/privacy" className="font-medium text-primary hover:text-primary/80">
              politique de confidentialité
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
