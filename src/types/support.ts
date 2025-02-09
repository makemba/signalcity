
export type SupportChannel = {
  id: number;
  name: string;
  type: 'email' | 'chat' | 'phone' | 'social';
  status: string;
  configuration: any;
  created_at: string;
  updated_at: string;
};

export type SupportTicket = {
  id: number;
  channel_id: number;
  customer_id: string;
  agent_id: string | null;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
};

export type SupportMessage = {
  id: number;
  ticket_id: number;
  sender_id: string;
  content: string;
  attachments: any;
  created_at: string;
};

export type SupportSatisfaction = {
  id: number;
  ticket_id: number;
  customer_id: string;
  rating: number;
  feedback: string | null;
  created_at: string;
};
