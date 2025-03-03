
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Headphones,
  Home,
  LineChart,
  LogOut,
  MapPin,
  MessageSquare,
  Settings,
  ShieldAlert,
  User,
  Users,
  Volume2,
} from "lucide-react";

const menuItems = [
  {
    title: "Principal",
    items: [
      {
        title: "Tableau de bord",
        icon: Home,
        href: "/",
      },
      {
        title: "Supervision",
        icon: ShieldAlert,
        href: "/supervision",
      },
      {
        title: "Équipes",
        icon: Users,
        href: "/equipes",
      },
      {
        title: "Statistiques",
        icon: BarChart3,
        href: "/statistics",
      },
    ],
  },
  {
    title: "Analyse",
    items: [
      {
        title: "Points chauds",
        icon: MapPin,
        href: "/points-chauds",
      },
      {
        title: "Analyse de bruit",
        icon: Volume2,
        href: "/analyse-sonore",
      },
      {
        title: "Analyse des rapports",
        icon: LineChart,
        href: "/analytics",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Messages",
        icon: MessageSquare,
        href: "/messages",
        badge: 3,
      },
      {
        title: "Centre d'assistance",
        icon: Headphones,
        href: "/support",
      },
      {
        title: "Urgences",
        icon: AlertTriangle,
        href: "/urgence",
      },
    ],
  },
];

interface DashboardNavigationProps {
  className?: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

export function DashboardNavigation({
  className,
  collapsed = false,
  setCollapsed,
}: DashboardNavigationProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && !collapsed) {
        setCollapsed?.(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [collapsed, setCollapsed]);

  return (
    <div className={cn("py-4", className)}>
      <div className="px-3 py-2">
        {menuItems.map((section) => (
          <div key={section.title} className="py-2">
            {!collapsed && (
              <h3 className="mb-2 px-4 text-xs font-semibold text-gray-500">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <Button
                  key={item.href}
                  variant={location.pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "h-12 px-3" : "px-3"
                  )}
                  asChild
                >
                  <Link to={item.href} className="flex items-center">
                    <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
                    {!collapsed && (
                      <span className="overflow-hidden text-ellipsis">{item.title}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                collapsed ? "h-12 px-3" : "px-3"
              )}
              asChild
            >
              <Link to="/signaler" className="flex items-center">
                <AlertTriangle className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
                {!collapsed && <span>Signaler un incident</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                collapsed ? "h-12 px-3" : "px-3"
              )}
              asChild
            >
              <Link to="/profil" className="flex items-center">
                <User className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
                {!collapsed && <span>Mon profil</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                collapsed ? "h-12 px-3" : "px-3"
              )}
            >
              <LogOut className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>Déconnexion</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
