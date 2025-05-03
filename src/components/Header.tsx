
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LogOut, Bell, User, Home, BarChart2, Shield, Settings, Volume2, Menu, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "./Logo";
import NotificationsPopover from "./NotificationsPopover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
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

  const navigationItems = [
    { icon: Home, label: "Accueil", path: "/", primary: true },
    { icon: Bell, label: "Signaler", path: "/report-incident" },
    { icon: Volume2, label: "Analyse Sonore", path: "/noise-analysis" },
    { icon: BarChart2, label: "Statistiques", path: "/statistics" },
    { icon: Shield, label: "Supervision", path: "/supervision" },
  ];

  const adminItems = [
    { icon: User, label: "Profil", path: "/user-profile" },
    { icon: Settings, label: "Admin", path: "/super-admin-dashboard" },
  ];

  const renderNavigationItems = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-1">
      {navigationItems.map(({ icon: Icon, label, path, primary }) => {
        const isActive = location.pathname === path;
        return (
          <Button
            key={path}
            variant={primary ? (isActive ? "default" : "secondary") : "ghost"}
            size={isMobile ? "sm" : "default"}
            className={cn(
              "w-full md:w-auto justify-start md:justify-center transition-all duration-200",
              isActive 
                ? primary 
                  ? "shadow-md" 
                  : "bg-blue-50 text-blue-600 font-medium shadow-sm"
                : primary 
                  ? ""
                  : "hover:bg-blue-50 hover:text-blue-600"
            )}
            onClick={() => navigate(path)}
          >
            <Icon className={cn("h-4 w-4", isMobile ? "mr-2" : "md:mr-2")} />
            <span className={primary ? "" : "md:hidden lg:inline"}>{label}</span>
          </Button>
        );
      })}
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="mr-4">
              <Logo />
            </div>
            
            {!isMobile && (
              <Button
                variant="default"
                className={cn(
                  "font-medium bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md",
                  location.pathname === "/" 
                    ? "bg-blue-700 hover:bg-blue-800" 
                    : ""
                )}
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            )}
          </div>

          {isMobile ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="default" 
                size="icon"
                className={cn("relative shadow-md bg-blue-600 hover:bg-blue-700", 
                  location.pathname === "/" ? "bg-blue-700 hover:bg-blue-800" : "")}
                onClick={() => navigate("/")}
              >
                <Home className="h-5 w-5" />
              </Button>
              
              <NotificationsPopover />
              
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
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-1">
                    {renderNavigationItems()}
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
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              {renderNavigationItems()}
              
              <div className="h-6 mx-2 w-px bg-gray-200" />
              
              <NotificationsPopover />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Avatar className="h-7 w-7 border-2 border-blue-100">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        RH
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline font-medium text-sm">Compte</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">Mon compte</p>
                    <p className="text-xs text-muted-foreground">admin@example.com</p>
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
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
