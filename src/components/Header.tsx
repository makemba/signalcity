import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Bell, User, Home, BarChart2, Shield, Settings, Volume2 } from "lucide-react";
import Logo from "./Logo";

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
          <Logo />
          
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
            <Button variant="ghost" className="flex items-center" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Accueil</span>
            </Button>
            
            <Button variant="ghost" className="flex items-center" onClick={() => navigate("/signaler")}>
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Signaler</span>
            </Button>

            <Button variant="ghost" className="flex items-center" onClick={() => navigate("/analyse-sonore")}>
              <Volume2 className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Analyse Sonore</span>
            </Button>

            <Button variant="ghost" className="flex items-center" onClick={() => navigate("/statistics")}>
              <BarChart2 className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Statistiques</span>
            </Button>

            <Button variant="ghost" className="flex items-center" onClick={() => navigate("/supervision")}>
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Supervision</span>
            </Button>

            <Button variant="ghost" className="flex items-center" onClick={() => navigate("/profil")}>
              <User className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Profil</span>
            </Button>

            <Button variant="ghost" className="flex items-center" onClick={() => navigate("/admin")}>
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Admin</span>
            </Button>

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