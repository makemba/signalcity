export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          agent_id: string | null
          created_at: string
          id: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: number | null
          created_at: string
          id: number
          sender_id: string | null
          type: string
        }
        Insert: {
          content: string
          conversation_id?: number | null
          created_at?: string
          id?: number
          sender_id?: string | null
          type?: string
        }
        Update: {
          content?: string
          conversation_id?: number | null
          created_at?: string
          id?: number
          sender_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: number
          incident_id: number | null
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: number
          incident_id?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: number
          incident_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: number
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: number
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: number
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string
          created_by: string | null
          id: number
          incident_id: number | null
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
          incident_id?: number | null
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
          incident_id?: number | null
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "feedback_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      hotspots: {
        Row: {
          id: number
          incident_count: number | null
          last_updated: string | null
          location_lat: number
          location_lng: number
          metadata: Json | null
          risk_level: string
        }
        Insert: {
          id?: number
          incident_count?: number | null
          last_updated?: string | null
          location_lat: number
          location_lng: number
          metadata?: Json | null
          risk_level: string
        }
        Update: {
          id?: number
          incident_count?: number | null
          last_updated?: string | null
          location_lat?: number
          location_lng?: number
          metadata?: Json | null
          risk_level?: string
        }
        Relationships: []
      }
      incident_attachments: {
        Row: {
          created_at: string
          created_by: string | null
          file_path: string
          file_type: string
          id: number
          incident_id: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_path: string
          file_type: string
          id?: number
          incident_id?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_path?: string
          file_type?: string
          id?: number
          incident_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_attachments_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_videos: {
        Row: {
          created_at: string
          created_by: string | null
          file_path: string
          file_type: string
          id: number
          incident_id: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_path: string
          file_type: string
          id?: number
          incident_id?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_path?: string
          file_type?: string
          id?: number
          incident_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_videos_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          assigned_to: string | null
          category_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: number
          location_lat: number
          location_lng: number
          metadata: Json | null
          priority: string | null
          resolved_at: string | null
          status: string
        }
        Insert: {
          assigned_to?: string | null
          category_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          location_lat: number
          location_lng: number
          metadata?: Json | null
          priority?: string | null
          resolved_at?: string | null
          status?: string
        }
        Update: {
          assigned_to?: string | null
          category_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          location_lat?: number
          location_lng?: number
          metadata?: Json | null
          priority?: string | null
          resolved_at?: string | null
          status?: string
        }
        Relationships: []
      }
      noise_measurements: {
        Row: {
          created_at: string
          duration: number
          id: string
          location_name: string | null
          metadata: Json | null
          noise_level: number
          notes: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration: number
          id?: string
          location_name?: string | null
          metadata?: Json | null
          noise_level: number
          notes?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration?: number
          id?: string
          location_name?: string | null
          metadata?: Json | null
          noise_level?: number
          notes?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          message: string
          read: boolean
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message: string
          read?: boolean
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          role: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          role?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          role?: string | null
          username?: string | null
        }
        Relationships: []
      }
      satisfaction_stats: {
        Row: {
          average_rating: number | null
          category: string
          created_at: string | null
          id: number
          metadata: Json | null
          period_end: string
          period_start: string
          response_count: number | null
        }
        Insert: {
          average_rating?: number | null
          category: string
          created_at?: string | null
          id?: number
          metadata?: Json | null
          period_end: string
          period_start: string
          response_count?: number | null
        }
        Update: {
          average_rating?: number | null
          category?: string
          created_at?: string | null
          id?: number
          metadata?: Json | null
          period_end?: string
          period_start?: string
          response_count?: number | null
        }
        Relationships: []
      }
      support_channels: {
        Row: {
          configuration: Json | null
          created_at: string
          id: number
          name: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          id?: number
          name: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          id?: number
          name?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          id: number
          sender_id: string | null
          ticket_id: number | null
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          id?: number
          sender_id?: string | null
          ticket_id?: number | null
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          id?: number
          sender_id?: string | null
          ticket_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_satisfaction: {
        Row: {
          created_at: string
          customer_id: string | null
          feedback: string | null
          id: number
          rating: number | null
          ticket_id: number | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          feedback?: string | null
          id?: number
          rating?: number | null
          ticket_id?: number | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          feedback?: string | null
          id?: number
          rating?: number | null
          ticket_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "support_satisfaction_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          agent_id: string | null
          channel_id: number | null
          created_at: string
          customer_id: string | null
          description: string | null
          id: number
          metadata: Json | null
          priority: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          channel_id?: number | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: number
          metadata?: Json | null
          priority?: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          channel_id?: number | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: number
          metadata?: Json | null
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "support_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      trend_analysis: {
        Row: {
          average_resolution_time: unknown | null
          category: string
          created_at: string | null
          id: number
          incident_count: number | null
          metadata: Json | null
          period_end: string
          period_start: string
          trend_direction: string | null
        }
        Insert: {
          average_resolution_time?: unknown | null
          category: string
          created_at?: string | null
          id?: number
          incident_count?: number | null
          metadata?: Json | null
          period_end: string
          period_start: string
          trend_direction?: string | null
        }
        Update: {
          average_resolution_time?: unknown | null
          category?: string
          created_at?: string | null
          id?: number
          incident_count?: number | null
          metadata?: Json | null
          period_end?: string
          period_start?: string
          trend_direction?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
