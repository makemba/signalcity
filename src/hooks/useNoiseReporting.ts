
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

export function useNoiseReporting() {
  const saveReport = async (report: any) => {
    try {
      const { error } = await supabase
        .from('noise_measurements')
        .insert({
          noise_level: report.measurements.decibels,
          duration: report.measurements.duration,
          type: 'analyzed',
          metadata: report,
          notes: report.conclusion
        });

      if (error) {
        console.error("Erreur lors de l'enregistrement du rapport:", error);
        toast("Impossible d'enregistrer le rapport");
        return false;
      } else {
        toast("Rapport enregistré avec succès");
        return true;
      }
    } catch (err) {
      console.error("Exception lors de la sauvegarde du rapport:", err);
      toast("Erreur lors de la sauvegarde du rapport");
      return false;
    }
  };
  
  return { saveReport };
}
