
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, BarChart2, Shield, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavigationItem {
  icon: React.ElementType;
  label: string;
  path: string;
  primary?: boolean;
}

export const navigationItems: NavigationItem[] = [
  { icon: Bell, label: "Signaler", path: "/report-incident" },
  { icon: Volume2, label: "Analyse Sonore", path: "/noise-analysis" },
  { icon: BarChart2, label: "Statistiques", path: "/statistics" },
  { icon: Shield, label: "Supervision", path: "/supervision" },
];

export const NavigationItems = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
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
};
