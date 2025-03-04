
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Send, Phone, Paperclip, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface EmergencyChatProps {
  incidentId?: number;
  showFullscreen?: boolean;
}

const EmergencyChat: React.FC<EmergencyChatProps> = ({ incidentId, showFullscreen = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [agentInfo, setAgentInfo] = useState({ name: "Agent d'urgence", id: "agent-1" });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simuler un message initial d'accueil après un court délai
    const timer = setTimeout(() => {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: "Bonjour, je suis votre agent d'assistance d'urgence. Comment puis-je vous aider aujourd'hui?",
        sender: "agent",
        timestamp: new Date(),
        status: "read"
      };
      setMessages([welcomeMessage]);
      setIsConnected(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Répondre automatiquement après un message de l'utilisateur
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      setIsAgentTyping(true);
      
      const timer = setTimeout(() => {
        const responseMessage: Message = {
          id: `response-${Date.now()}`,
          content: getAutoResponse(lastMessage.content),
          sender: "agent",
          timestamp: new Date(),
          status: "sent"
        };
        
        setMessages(prevMessages => [...prevMessages, responseMessage]);
        setIsAgentTyping(false);
      }, 2000 + Math.random() * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAgentTyping]);

  // Fonction pour générer des réponses automatiques
  const getAutoResponse = (userMessage: string): string => {
    const userMessageLower = userMessage.toLowerCase();
    
    if (userMessageLower.includes("urgence") || userMessageLower.includes("danger")) {
      return "Je comprends l'urgence de la situation. Pouvez-vous me donner plus de détails sur ce qui se passe exactement pour que je puisse vous aider au mieux?";
    }
    
    if (userMessageLower.includes("aide") || userMessageLower.includes("besoin")) {
      return "Nous sommes là pour vous aider. Une équipe d'intervention a été alertée et est en route. Restez en ligne avec moi pendant ce temps.";
    }
    
    if (userMessageLower.includes("quand") || userMessageLower.includes("arrive")) {
      return "Notre équipe d'intervention devrait arriver dans 5 à 10 minutes. Êtes-vous dans un lieu sécurisé pour le moment?";
    }
    
    if (userMessageLower.includes("merci")) {
      return "Je vous en prie, c'est notre mission de vous assister. N'hésitez pas si vous avez d'autres questions.";
    }
    
    return "Je vous remercie pour ces informations. Notre équipe est en train d'analyser la situation. Y a-t-il autre chose que je devrais savoir?";
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
      status: "sent"
    };
    
    setMessages(prevMessages => [...prevMessages, message]);
    setNewMessage("");
    
    // Simuler la mise à jour du statut du message
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' as 'delivered' } 
            : msg
        )
      );
    }, 500);
    
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'read' as 'read' } 
            : msg
        )
      );
    }, 1000);
  };

  const handleEmergencyCall = () => {
    toast({
      title: "Appel d'urgence initié",
      description: "Un agent va vous contacter dans les plus brefs délais",
    });
  };

  // États de message en fonction du statut
  const getMessageStatus = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="text-xs text-gray-400">Envoyé</span>;
      case 'delivered':
        return <span className="text-xs text-gray-400">Délivré</span>;
      case 'read':
        return <span className="text-xs text-blue-500">Lu</span>;
      default:
        return null;
    }
  };

  return (
    <Card className={`${showFullscreen ? 'h-[calc(100vh-2rem)] m-4' : 'h-[500px]'} flex flex-col`}>
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/emergency-agent.png" />
              <AvatarFallback className="bg-red-100 text-red-600">
                <User size={18} />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-md flex items-center gap-1">
                {agentInfo.name}
                {isConnected ? (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 text-xs">
                    En ligne
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-600 text-xs">
                    Connexion...
                  </Badge>
                )}
              </CardTitle>
              {isAgentTyping && (
                <span className="text-xs text-gray-500 animate-pulse">
                  En train d'écrire...
                </span>
              )}
            </div>
          </div>
          <Button 
            size="sm" 
            variant="destructive" 
            className="flex items-center gap-1"
            onClick={handleEmergencyCall}
          >
            <Phone size={14} />
            <span className="hidden sm:inline">Appel d'urgence</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-3">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && !isConnected && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-2 animate-pulse" />
                <p className="text-muted-foreground">Connexion au service d'urgence...</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.content}</p>
                  <div className={`flex justify-end mt-1 ${message.sender === 'user' ? '' : 'hidden'}`}>
                    {getMessageStatus(message.status)}
                  </div>
                </div>
              </div>
            ))}
            
            {isAgentTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 pt-2">
        <form 
          className="flex w-full gap-2" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Button 
            type="button" 
            size="icon" 
            variant="outline"
          >
            <Paperclip size={18} />
          </Button>
          <Input
            placeholder="Tapez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Send size={18} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default EmergencyChat;
