
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Bell, User, Home, BarChart2, Shield, Settings, Volume2, Menu } from "lucide-react";
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

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const navigationItems = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: Bell, label: "Signaler", path: "/report-incident" },
    { icon: Volume2, label: "Analyse Sonore", path: "/noise-analysis" },
    { icon: BarChart2, label: "Statistiques", path: "/statistics" },
    { icon: Shield, label: "Supervision", path: "/supervision" },
    { icon: User, label: "Profil", path: "/user-profile" },
    { icon: Settings, label: "Admin", path: "/super-admin-dashboard" },
  ];

  const renderNavigationItems = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-1">
      {navigationItems.map(({ icon: Icon, label, path }) => (
        <Button
          key={path}
          variant="ghost"
          className={cn(
            "w-full md:w-auto justify-start md:justify-center transition-colors",
            location.pathname === path 
              ? "bg-primary/10 text-primary font-medium" 
              : "hover:bg-primary/5"
          )}
          onClick={() => navigate(path)}
        >
          <Icon className="h-4 w-4 md:mr-2" />
          <span className="md:hidden lg:inline">{label}</span>
        </Button>
      ))}
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="mr-4">
              <Logo />
            </div>
            
            {!isMobile && (
              <div className="hidden md:flex items-center">
                <Button
                  variant="ghost"
                  className={cn(
                    "font-medium transition-colors",
                    location.pathname === "/" 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-primary/5"
                  )}
                  onClick={() => navigate("/")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Accueil
                </Button>
              </div>
            )}
          </div>

          {isMobile ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative" 
                onClick={() => navigate("/")}
              >
                <Home className="h-5 w-5 text-primary" />
              </Button>
              
              <NotificationsPopover />
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-primary/5 hover:bg-primary/10"
                  >
                    <Menu className="h-5 w-5 text-primary" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80vw] sm:w-[350px] border-l-primary/20">
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
                        className="w-full justify-start border-primary/20 text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <div className="hidden md:flex items-center">
              {renderNavigationItems()}
              <div className="h-6 mx-2 w-px bg-gray-200" />
              <NotificationsPopover />
              <Button
                variant="outline"
                onClick={handleLogout}
                className="ml-2 border-primary/20 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Déconnexion</span>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
