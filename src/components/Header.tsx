import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
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
          </div>
        </nav>
      </div>
    </header>
  );
}