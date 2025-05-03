
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { DashboardNavigation } from "@/components/DashboardNavigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, User, Settings, LogOut, Home } from "lucide-react";
import Logo from "@/components/Logo";
import { useLocation, Link } from "react-router-dom";
import NotificationsPopover from "@/components/NotificationsPopover";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnecté avec succès",
        description: "Vous avez été déconnecté de votre compte"
      });
    } catch (error) {
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive"
      });
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Tableau de bord";
      case "/supervision":
        return "Supervision des opérations";
      case "/equipes":
        return "Gestion des équipes";
      case "/statistics":
        return "Statistiques";
      case "/points-chauds":
        return "Analyse des points chauds";
      case "/analytics":
        return "Analyse des rapports";
      case "/noise-analysis":
        return "Analyse sonore";
      default:
        return "Tableau de bord";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex flex-1">
        {/* Mobile Sidebar Overlay */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-all duration-300 lg:hidden",
            isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsMobileOpen(false)}
        />
        
        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r shadow-lg transition-transform duration-300 ease-in-out lg:hidden",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center px-6 border-b">
            <Logo />
          </div>
          <DashboardNavigation collapsed={false} />
        </div>

        {/* Desktop Sidebar */}
        <div
          className={cn(
            "hidden lg:flex flex-col border-r bg-white transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex h-16 items-center px-6 border-b justify-between">
            {!isCollapsed && <Logo size="sm" />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 text-gray-500 hover:text-blue-600"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
          <DashboardNavigation collapsed={isCollapsed} setCollapsed={setIsCollapsed} />
          
          <div className="mt-auto p-4 border-t">
            {!isCollapsed && (
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="justify-start text-blue-600 border-blue-100 hover:bg-blue-50"
                >
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-6 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(true)}
              className="mr-2 h-8 w-8 lg:hidden"
            >
              <Menu className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationsPopover />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8 ring-2 ring-white ring-offset-2 ring-offset-blue-50">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-blue-600 text-white">CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-lg border-gray-100">
                  <DropdownMenuItem asChild>
                    <Link to="/user-profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
