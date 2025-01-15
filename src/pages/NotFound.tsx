import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          La page que vous recherchez n'existe pas.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="inline-flex items-center"
        >
          <Home className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}