import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Report Helper Hub
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/statistics">
              <Button variant="ghost">Statistiques</Button>
            </Link>
            <Link to="/supervision">
              <Button variant="ghost">Supervision</Button>
            </Link>
            <Link to="/admin">
              <Button variant="ghost">Administration</Button>
            </Link>
            <Link to="/manager">
              <Button variant="ghost">Gestion</Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="ml-4"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}