
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/userStore";

export const adminItems = [
  { icon: User, label: "Profil", path: "/user-profile" },
  { icon: Settings, label: "Admin", path: "/super-admin-dashboard" },
];

export const UserMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, clearUser } = useUserStore();

  const currentRole = user?.role || 'user';
  const userEmail = user?.email || 'user@example.com';
  const userName = user?.name || 'Utilisateur';
  const userInitials = (userName?.substring(0, 2) || 'US').toUpperCase();

  const handleLogout = async () => {
    try {
      // Clear user from store
      clearUser();
      
      // For compatibility, also clear localStorage
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
        >
          <Avatar className="h-7 w-7 border-2 border-blue-100">
            <AvatarFallback className="bg-blue-600 text-white text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline font-medium text-sm">
            {currentRole === 'super_admin' ? 'Super Admin' : 
             currentRole === 'admin' ? 'Admin' :
             currentRole === 'moderator' ? 'Modérateur' : userName}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Mon compte</p>
          <p className="text-xs text-muted-foreground">{userEmail}</p>
        </div>
        <DropdownMenuSeparator />
        {adminItems.map(({ icon: Icon, label, path }) => (
          <DropdownMenuItem 
            key={path}
            className="cursor-pointer"
            onClick={() => navigate(path)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
