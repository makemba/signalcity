import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("UserProfile component mounted");
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUsername(profile.username || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du profil.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [toast]);

  const updateProfile = async () => {
    if (!user) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profil Utilisateur</h1>
        
        <Card className="p-6 space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
            />
          </div>

          <Button
            onClick={updateProfile}
            disabled={updating}
            className="w-full"
          >
            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Mettre à jour le profil
          </Button>
        </Card>
      </div>
    </div>
  );
}