
import { useNavigate } from "react-router-dom";
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

export default function Header() {
  const navigate = useNavigate();
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
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
      {navigationItems.map(({ icon: Icon, label, path }) => (
        <Button
          key={path}
          variant="ghost"
          className={`w-full md:w-auto justify-start md:justify-center transition-colors hover:bg-primary/10 ${
            location.pathname === path ? 'bg-primary/5 text-primary font-medium' : ''
          }`}
          onClick={() => {
            navigate(path);
          }}
        >
          <Icon className="h-4 w-4 md:mr-2" />
          <span className="md:hidden lg:inline">{label}</span>
        </Button>
      ))}
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
            {!isMobile && (
              <Button
                variant="ghost"
                className="ml-6 font-medium text-primary hover:bg-primary/10"
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            )}
          </div>

          {isMobile ? (
            <div className="flex items-center gap-2">
              <NotificationsPopover />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-primary/20">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-2">
                    {renderNavigationItems()}
                    <Button
                      variant="outline"
                      className="w-full justify-start border-primary/20 hover:bg-primary/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {renderNavigationItems()}
              <div className="h-6 w-px bg-gray-200" />
              <NotificationsPopover />
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-primary/20 hover:bg-primary/10"
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
