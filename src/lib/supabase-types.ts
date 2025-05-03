
// Ajout d'un fichier tampon pour gérer l'import manquant de lib/supabase dans certains fichiers
// Ce fichier redirige l'importation vers le bon endroit

export * from '@/integrations/supabase/types';
export * from '@/lib/supabase';
