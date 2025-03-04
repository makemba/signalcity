
import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Shield, 
  Users, 
  Settings, 
  AlertTriangle, 
  Check, 
  X, 
  Eye, 
  UserCog,
  Database,
  Layers,
  Bell,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/user";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  lastActive: string;
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
}

const mockUsers: UserData[] = [
  { 
    id: '1', 
    email: 'admin@example.com', 
    name: 'Admin Principal', 
    role: 'admin', 
    lastActive: '2023-06-15T10:32:00Z',
    status: 'active',
    created_at: '2023-01-10T08:30:00Z'
  },
  { 
    id: '2', 
    email: 'moderator@example.com', 
    name: 'Modérateur Application', 
    role: 'moderator', 
    lastActive: '2023-06-14T16:45:00Z',
    status: 'active',
    created_at: '2023-02-15T09:45:00Z'
  },
  { 
    id: '3', 
    email: 'user1@example.com', 
    name: 'Utilisateur Standard', 
    role: 'user', 
    lastActive: '2023-06-12T09:15:00Z',
    status: 'active',
    created_at: '2023-03-20T14:20:00Z'
  },
  { 
    id: '4', 
    email: 'user2@example.com', 
    name: 'Utilisateur Nouveau', 
    role: 'user', 
    lastActive: '2023-06-11T14:20:00Z',
    status: 'pending',
    created_at: '2023-06-10T11:15:00Z'
  },
  { 
    id: '5', 
    email: 'suspended@example.com', 
    name: 'Compte Suspendu', 
    role: 'user', 
    lastActive: '2023-05-30T11:45:00Z',
    status: 'suspended',
    created_at: '2023-04-05T16:30:00Z'
  }
];

// Configurer pour impersonation
interface ImpersonationTarget {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

const SuperAdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Vérifier si on est super admin
  useEffect(() => {
    const checkSuperAdmin = async () => {
      const userRole = localStorage.getItem('userRole');
      if (userRole !== 'super_admin') {
        toast.error("Accès non autorisé");
        navigate("/");
      }
    };
    
    checkSuperAdmin();
  }, [navigate]);

  const filteredUsers = selectedRole === 'all' 
    ? users 
    : users.filter(user => user.role === selectedRole);

  const handleImpersonate = (user: ImpersonationTarget) => {
    // Sauvegarder l'original admin ID dans localStorage pour pouvoir revenir
    const originalAdmin = { role: 'super_admin' };
    localStorage.setItem('originalAdmin', JSON.stringify(originalAdmin));
    localStorage.setItem('isImpersonating', 'true');
    localStorage.setItem('impersonatedRole', user.role);
    
    toast.success(`Vous utilisez maintenant le compte de ${user.name}`);
    
    // Rediriger vers la page appropriée selon le rôle
    switch(user.role) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'moderator':
        navigate('/manager-dashboard');
        break;
      case 'user':
        navigate('/');
        break;
      default:
        navigate('/');
    }
  };

  const handleStopImpersonation = () => {
    localStorage.removeItem('originalAdmin');
    localStorage.setItem('isImpersonating', 'false');
    localStorage.removeItem('impersonatedRole');
    toast.success("Retour au compte super administrateur");
    navigate('/super-admin-dashboard');
  };

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    setIsLoading(true);
    
    // Simulation d'une requête API
    setTimeout(() => {
      if (action === 'suspend') {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'suspended' as 'suspended' } : user
        ));
        toast.success("L'utilisateur a été suspendu");
      } else if (action === 'activate') {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'active' as 'active' } : user
        ));
        toast.success("L'utilisateur a été activé");
      } else if (action === 'delete') {
        setUsers(users.filter(user => user.id !== userId));
        toast.success("L'utilisateur a été supprimé");
      }
      
      setIsLoading(false);
    }, 800);
  };

  const isImpersonating = localStorage.getItem('isImpersonating') === 'true';

  return (
    <DashboardShell>
      <div className="container px-4 py-6 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-7 w-7 text-purple-600" />
              Panneau Super Admin
            </h1>
            <p className="text-gray-500 mt-1">
              Gestion centralisée et privilèges d'administration étendus
            </p>
          </div>
          
          {isImpersonating && (
            <Button 
              variant="destructive" 
              className="mt-4 md:mt-0"
              onClick={handleStopImpersonation}
            >
              <User className="mr-2 h-4 w-4" />
              Quitter le mode impersonation
            </Button>
          )}
        </div>

        {isImpersonating && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Vous utilisez actuellement l'application en tant qu'un autre utilisateur. Certaines fonctionnalités peuvent être limitées.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-sm text-gray-500">Total des comptes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-500" />
                Administrateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
              <p className="text-sm text-gray-500">Avec privilèges élevés</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Comptes suspendus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.status === 'suspended').length}</div>
              <p className="text-sm text-gray-500">Accès restreint</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-green-500" />
                Dernière synchronisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{new Date().toLocaleTimeString()}</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                onClick={() => toast.success("Données synchronisées")}
              >
                Actualiser
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              Système
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <div>
                    <CardTitle>Gestion des utilisateurs</CardTitle>
                    <CardDescription>
                      Visualiser, modifier et supprimer des comptes utilisateurs
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="text-xs sm:text-sm h-8 sm:h-10"
                      onClick={() => setSelectedRole('all')}
                    >
                      Tous
                    </Button>
                    <Button 
                      variant={selectedRole === 'admin' ? "default" : "outline"} 
                      className="text-xs sm:text-sm h-8 sm:h-10"
                      onClick={() => setSelectedRole('admin')}
                    >
                      Admin
                    </Button>
                    <Button 
                      variant={selectedRole === 'moderator' ? "default" : "outline"} 
                      className="text-xs sm:text-sm h-8 sm:h-10"
                      onClick={() => setSelectedRole('moderator')}
                    >
                      Modérateur
                    </Button>
                    <Button 
                      variant={selectedRole === 'user' ? "default" : "outline"} 
                      className="text-xs sm:text-sm h-8 sm:h-10"
                      onClick={() => setSelectedRole('user')}
                    >
                      Utilisateur
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] rounded-md">
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <Card key={user.id} className="overflow-hidden">
                        <div className={`h-1.5 w-full ${
                          user.status === 'active' ? 'bg-green-500' : 
                          user.status === 'suspended' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-10 w-10 mt-1">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                                <AvatarFallback>
                                  <User className="h-6 w-6" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{user.name}</h3>
                                  <Badge 
                                    variant="outline" 
                                    className={`
                                      ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                                        user.role === 'moderator' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                        'bg-gray-50 text-gray-700 border-gray-200'}
                                    `}
                                  >
                                    {user.role === 'admin' ? 'Admin' : 
                                     user.role === 'moderator' ? 'Modérateur' : 
                                     'Utilisateur'}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={`
                                      ${user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 
                                        user.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-200' : 
                                        'bg-yellow-50 text-yellow-700 border-yellow-200'}
                                    `}
                                  >
                                    {user.status === 'active' ? 'Actif' : 
                                     user.status === 'suspended' ? 'Suspendu' : 
                                     'En attente'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <div className="flex flex-wrap gap-x-4 mt-1 text-xs text-gray-500">
                                  <span>ID: {user.id}</span>
                                  <span>Créé le: {new Date(user.created_at).toLocaleDateString()}</span>
                                  <span>Dernière activité: {new Date(user.lastActive).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex mt-4 sm:mt-0 space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleImpersonate(user)}
                                className="flex items-center"
                              >
                                <UserCog className="mr-1 h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Impersonate</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center text-blue-600"
                              >
                                <Eye className="mr-1 h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Voir</span>
                              </Button>
                              
                              {user.status === 'active' ? (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleUserAction(user.id, 'suspend')}
                                  className="flex items-center text-yellow-600"
                                  disabled={isLoading}
                                >
                                  <X className="mr-1 h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Suspendre</span>
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleUserAction(user.id, 'activate')}
                                  className="flex items-center text-green-600"
                                  disabled={isLoading}
                                >
                                  <Check className="mr-1 h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Activer</span>
                                </Button>
                              )}
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="flex items-center text-red-600"
                                disabled={isLoading}
                              >
                                <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Supprimer</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Exporter la liste</Button>
                <Button>Ajouter un utilisateur</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>Permissions du système</CardTitle>
                <CardDescription>
                  Gérer les rôles et les permissions d'accès aux fonctionnalités
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Fonctionnalité en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres système</CardTitle>
                <CardDescription>
                  Configuration avancée et paramètres techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8 text-gray-500">
                  <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Fonctionnalité en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des notifications</CardTitle>
                <CardDescription>
                  Configuration des notifications système et utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Fonctionnalité en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default SuperAdminDashboard;
