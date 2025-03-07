
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { DashboardNavigation } from "@/components/DashboardNavigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, User, Settings, LogOut } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
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
        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 lg:hidden",
            isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsMobileOpen(false)}
        />
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-lg transition-transform duration-300 ease-in-out lg:hidden",
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
            "hidden lg:flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex h-16 items-center px-6 border-b justify-between">
            {!isCollapsed && <Logo />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8"
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
                <Button variant="ghost" size="sm" asChild className="justify-start">
                  <Link to="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(true)}
              className="mr-2 h-8 w-8 lg:hidden"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationsPopover />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/user-profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
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
