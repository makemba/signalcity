
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "./Logo";
import NotificationsPopover from "./NotificationsPopover";
import { cn } from "@/lib/utils";
import { NavigationItems } from "./header/NavigationItems";
import { UserMenu } from "./header/UserMenu";
import { MobileMenu } from "./header/MobileMenu";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

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
              
              <MobileMenu />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <NavigationItems />
              
              <div className="h-6 mx-2 w-px bg-gray-200" />
              
              <NotificationsPopover />
              
              <UserMenu />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
