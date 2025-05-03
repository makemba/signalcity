
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Récupération des variables d'environnement depuis le client Supabase existant
import { supabase as originalClient } from "@/integrations/supabase/client";

// On réutilise la configuration existante pour éviter les problèmes de variables d'environnement
const supabaseUrl = "https://walsennhgpqlrcnnuzbv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbHNlbm5oZ3BxbHJjbm51emJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2NDU4MDMsImV4cCI6MjA1MjIyMTgwM30.t--ztO8SlcR9du-zCLfpjyL8sQBCQEt6GtUyq3dY6RE";

// Client Supabase avec les types de la base de données
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
