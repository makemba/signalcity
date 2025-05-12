
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import { NavigationItems } from "./NavigationItems";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export const MobileMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentRole = localStorage.getItem('userRole') || 'user';

  const handleLogout = async () => {
    try {
      // For testing, just clear localStorage and redirect
      localStorage.removeItem('userRole');
      localStorage.removeItem('isImpersonating');
      localStorage.removeItem('impersonatedRole');
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-blue-100 hover:bg-blue-50 shadow-sm"
        >
          <Menu className="h-5 w-5 text-blue-600" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80vw] sm:w-[350px] border-l-blue-100">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center">
            <Logo />
            <Badge className="ml-2">{currentRole}</Badge>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-1">
          <NavigationItems />
          <div className="pt-4 mt-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start border-red-100 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
