
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MessageSquare, Mail, Phone, Share2 } from "lucide-react";
import { SupportChannel, SupportTicket } from "@/types/support";
import { motion } from "framer-motion";

export default function Support() {
  const [channels, setChannels] = useState<SupportChannel[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchChannels();
    fetchTickets();
  }, []);

  const fetchChannels = async () => {
    try {
      const { data, error } = await supabase
        .from("support_channels")
        .select("*")
        .eq("status", "active");

      if (error) throw error;
      setChannels(data);
    } catch (error) {
      console.error("Error fetching channels:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les canaux de support",
        variant: "destructive",
      });
    }
  };

  const fetchTickets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer un ticket",
          variant: "destructive",
        });
        return;
      }

      if (!selectedChannel || !subject.trim() || !description.trim()) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("support_tickets")
        .insert({
          channel_id: parseInt(selectedChannel),
          customer_id: user.id,
          subject: subject.trim(),
          description: description.trim(),
          priority,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre ticket a été créé avec succès",
      });

      // Refresh tickets list
      fetchTickets();
      
      // Reset form
      setSelectedChannel("");
      setSubject("");
      setDescription("");
      setPriority("medium");
      
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le ticket",
        variant: "destructive",
      });
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'phone':
        return <Phone className="h-5 w-5" />;
      case 'social':
        return <Share2 className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-3xl font-bold text-center">Support Client Multicanal</h1>

        <Tabs defaultValue="new" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">Nouveau Ticket</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>Créer un nouveau ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="channel">Canal de support</Label>
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un canal" />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id.toString()}>
                          <div className="flex items-center gap-2">
                            {getChannelIcon(channel.type)}
                            {channel.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Décrivez brièvement votre problème"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Donnez-nous plus de détails sur votre problème"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <Select value={priority} onValueChange={(value: "low" | "medium" | "high" | "urgent") => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={createTicket} className="w-full">
                  Créer le ticket
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historique des tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.length === 0 ? (
                    <p className="text-center text-gray-500">
                      Vous n'avez pas encore de tickets
                    </p>
                  ) : (
                    tickets.map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{ticket.subject}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                              ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              ticket.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ticket.status.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              ticket.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ticket.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {ticket.description}
                        </p>
                        <Button
                          variant="link"
                          className="mt-2 p-0 h-auto"
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                        >
                          Voir les détails
                        </Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
