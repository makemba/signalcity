
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
          </div>

          {isMobile ? (
            <div className="flex items-center gap-2">
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
