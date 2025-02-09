
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send } from "lucide-react";
import { SupportTicket, SupportMessage } from "@/types/support";
import { motion } from "framer-motion";

export default function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchTicketDetails();
      fetchMessages();
      
      // Subscribe to new messages
      const subscription = supabase
        .channel(`ticket_${id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `ticket_id=eq.${id}`
        }, payload => {
          setMessages(prev => [...prev, payload.new as SupportMessage]);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      if (!id) return;

      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (error) throw error;
      setTicket(data as SupportTicket);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du ticket",
        variant: "destructive",
      });
    }
  };

  const fetchMessages = async () => {
    try {
      if (!id) return;

      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .eq("ticket_id", parseInt(id))
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data as SupportMessage[]);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      if (!id || !newMessage.trim()) return;

      setSending(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("support_messages")
        .insert({
          ticket_id: parseInt(id),
          sender_id: user.id,
          content: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage("");
      toast({
        title: "Succès",
        description: "Message envoyé",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ticket non trouvé</h2>
          <p className="mt-2 text-gray-600">Le ticket que vous recherchez n'existe pas.</p>
        </div>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{ticket.subject}</h2>
                <p className="text-sm text-gray-500">
                  Créé le {new Date(ticket.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                  ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  ticket.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.status.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  ticket.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.priority.toUpperCase()}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{ticket.description}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Messages</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.sender_id === ticket.customer_id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender_id === ticket.customer_id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="flex-shrink-0"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
