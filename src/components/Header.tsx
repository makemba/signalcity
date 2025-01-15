import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Bell, User, Home, BarChart2, Shield, Settings, Volume2 } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900 flex items-center">
            <Bell className="h-6 w-6 mr-2 text-primary" />
            Report Helper Hub
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
            <Link to="/">
              <Button variant="ghost" className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Accueil</span>
              </Button>
            </Link>
            
            <Link to="/signaler">
              <Button variant="ghost" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Signaler</span>
              </Button>
            </Link>

            <Link to="/analyse-sonore">
              <Button variant="ghost" className="flex items-center">
                <Volume2 className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Analyse Sonore</span>
              </Button>
            </Link>

            <Link to="/statistics">
              <Button variant="ghost" className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Statistiques</span>
              </Button>
            </Link>

            <Link to="/supervision">
              <Button variant="ghost" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Supervision</span>
              </Button>
            </Link>

            <Link to="/profil">
              <Button variant="ghost" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Profil</span>
              </Button>
            </Link>

            <Link to="/admin">
              <Button variant="ghost" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Admin</span>
              </Button>
            </Link>

            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Déconnexion</span>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}