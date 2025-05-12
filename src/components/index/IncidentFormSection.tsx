
import { Card } from "@/components/ui/card";
import IncidentForm from "@/components/IncidentForm";
import { useToast } from "@/hooks/use-toast";

export const IncidentFormSection = () => {
  const { toast } = useToast();
  
  const handleSubmit = () => {
    toast({
      title: "Signalement envoyé",
      description: "Votre signalement a été enregistré avec succès",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Nouveau signalement</h3>
      <IncidentForm onSubmit={handleSubmit} />
    </Card>
  );
};
