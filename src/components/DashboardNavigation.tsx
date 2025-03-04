
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BarChart,
  Bell,
  Building2,
  FileText,
  Home,
  Menu,
  MessagesSquare,
  Phone,
  PieChart,
  Settings,
  Shield,
  Users,
  LogOut,
  MapPin,
  HelpCircle,
  User,
  UserCog,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import NotificationsPopover from "@/components/NotificationsPopover";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  requiredRole?: 'admin' | 'moderator' | 'user' | 'super_admin';
}

export function DashboardNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    // Vérifier si on est en mode impersonation
    const impersonating = localStorage.getItem('isImpersonating') === 'true';
    setIsImpersonating(impersonating);
    
    // Récupérer le rôle de l'utilisateur
    const storedRole = localStorage.getItem('userRole') || 
                      (impersonating ? localStorage.getItem('impersonatedRole') : null) || 
                      'user';
    setUserRole(storedRole);
  }, [location.pathname]);

  const handleLogout = async () => {
    // Si l'utilisateur est en mode impersonation, arrêter l'impersonation
    if (isImpersonating) {
      localStorage.removeItem('impersonatedRole');
      localStorage.setItem('isImpersonating', 'false');
      toast.success("Retour au compte super administrateur");
      navigate('/super-admin-dashboard');
      return;
    }
    
    // Sinon, déconnexion normale
    await supabase.auth.signOut();
    localStorage.removeItem('userRole');
    localStorage.removeItem('isImpersonating');
    toast.success("Vous êtes déconnecté");
    navigate('/auth');
  };

  // Définir les éléments de navigation en fonction du rôle
  const navigationItems: NavigationItem[] = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Signaler un incident", href: "/report-incident", icon: FileText },
    { name: "Chat d'urgence", href: "/emergency-chat", icon: MessagesSquare },
    { name: "Points chauds", href: "/hotspot-analysis", icon: MapPin },
    { name: "Contact d'urgence", href: "/emergency-contact", icon: Phone },
    { name: "Statistiques", href: "/statistics", icon: BarChart },
    { name: "Support", href: "/support", icon: HelpCircle },
  ];

  // Éléments de navigation pour les rôles d'administration
  const adminItems: NavigationItem[] = [
    { name: "Gestion Admin", href: "/admin-dashboard", icon: Shield, requiredRole: 'admin' },
    { name: "Supervision", href: "/supervision", icon: Building2, requiredRole: 'admin' },
    { name: "Tableau Gestionnaire", href: "/manager-dashboard", icon: PieChart, requiredRole: 'moderator' },
    { name: "Gestion des équipes", href: "/team-supervision", icon: Users, requiredRole: 'moderator' },
    { name: "Super Admin", href: "/super-admin-dashboard", icon: UserCog, requiredRole: 'super_admin' },
  ];

  // Filtrer les éléments de navigation en fonction du rôle
  const filteredAdminItems = adminItems.filter(item => {
    if (!item.requiredRole) return true;
    
    // Pour les super_admin, montrer tous les éléments
    if (userRole === 'super_admin') return true;
    
    // Pour l'impersonation, montrer en fonction du rôle impersonné
    if (isImpersonating) {
      const impersonatedRole = localStorage.getItem('impersonatedRole');
      if (impersonatedRole === 'admin' && (item.requiredRole === 'admin' || item.requiredRole === 'moderator')) {
        return true;
      }
      if (impersonatedRole === 'moderator' && item.requiredRole === 'moderator') {
        return true;
      }
      return false;
    }
    
    // Pour les autres cas, vérifier le rôle requis
    return userRole === item.requiredRole || 
           (userRole === 'admin' && item.requiredRole === 'moderator'); // admin peut accéder aux pages moderator
  });

  return (
    <div className="flex items-center">
      {isMobile ? (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:w-80">
            <div className="p-4">
              <Logo />
            </div>
            <div className="mt-4 px-4">
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {filteredAdminItems.length > 0 && (
                  <>
                    <div className="mt-6 mb-2 px-3">
                      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Administration
                      </h3>
                    </div>
                    {filteredAdminItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                          location.pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </>
                )}
                
                {isImpersonating && (
                  <div className="mt-4 px-3 py-2 bg-yellow-50 rounded-md text-sm">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="font-medium text-yellow-700">Mode Impersonation</span>
                    </div>
                    <p className="text-yellow-600 text-xs mb-2">
                      Vous utilisez l'application en tant qu'un autre utilisateur.
                    </p>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <User className="h-4 w-4 mr-1" />
                      Quitter l'impersonation
                    </Button>
                  </div>
                )}
              </nav>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isImpersonating ? "Quitter l'impersonation" : "Se déconnecter"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
          
          {filteredAdminItems.length > 0 && (
            <>
              <span className="text-muted-foreground">|</span>
              {filteredAdminItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </>
          )}
          
          {isImpersonating && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span className="text-xs">Mode Impersonation</span>
            </Badge>
          )}
        </nav>
      )}

      <div className="ml-auto flex items-center gap-2">
        <NotificationsPopover>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
        </NotificationsPopover>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/user-profile')}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </div>
  );
}
