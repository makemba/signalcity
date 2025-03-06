
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart3, Bell, FileText, Headphones, 
  LayoutDashboard, Map, Settings, 
  Users, Volume2, Database, 
  BrainCircuit 
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface DashboardNavigationProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

export function DashboardNavigation({ collapsed, setCollapsed }: DashboardNavigationProps) {
  return (
    <ScrollArea
      className={cn(
        "flex-1 overflow-auto",
        collapsed && "flex items-center justify-center"
      )}
    >
      <nav className="flex flex-col gap-2 py-4 px-2">
        <NavItem
          to="/super-admin-dashboard"
          icon={LayoutDashboard}
          label="Tableau de bord"
          collapsed={collapsed}
        />
        <NavItem
          to="/report-incident"
          icon={Bell}
          label="Signaler un incident"
          collapsed={collapsed}
        />
        <NavItem
          to="/supervision"
          icon={Map}
          label="Supervision"
          collapsed={collapsed}
        />
        <NavItem
          to="/team-supervision"
          icon={Users}
          label="Équipes"
          collapsed={collapsed}
        />
        <NavItem
          to="/noise-analysis"
          icon={Volume2}
          label="Analyse sonore"
          collapsed={collapsed}
        />
        <NavItem
          to="/statistics"
          icon={BarChart3}
          label="Statistiques"
          collapsed={collapsed}
        />
        <NavItem
          to="/hotspot-analysis"
          icon={Map}
          label="Points chauds"
          collapsed={collapsed}
        />
        <NavItem
          to="/report-analytics"
          icon={FileText}
          label="Analyse de rapports"
          collapsed={collapsed}
        />
        <NavItem
          to="/innovative-analytics"
          icon={BrainCircuit}
          label="Analyses avancées"
          collapsed={collapsed}
          isNew
        />
        <NavItem
          to="/sync-incidents"
          icon={Database}
          label="Synchronisation"
          collapsed={collapsed}
        />
        <NavItem
          to="/support"
          icon={Headphones}
          label="Support"
          collapsed={collapsed}
        />
        <NavItem
          to="/user-profile"
          icon={Settings}
          label="Paramètres"
          collapsed={collapsed}
        />
      </nav>
    </ScrollArea>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed?: boolean;
  isNew?: boolean;
}

function NavItem({ to, icon: Icon, label, collapsed, isNew }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          collapsed && "justify-center"
        )
      }
    >
      <Icon className="h-4 w-4" />
      {!collapsed && (
        <div className="flex items-center">
          <span>{label}</span>
          {isNew && (
            <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800">
              Nouveau
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
}
