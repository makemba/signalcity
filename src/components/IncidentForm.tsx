import { Send, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import NoiseAnalyzer from "./NoiseAnalyzer";
import { supabase } from "@/integrations/supabase/client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { LocationInput } from "./incident-form/LocationInput";
import { CategorySelect } from "./incident-form/CategorySelect";
import { NoiseTypeSelect } from "./incident-form/NoiseTypeSelect";
import { PhotoUpload } from "./incident-form/PhotoUpload";

interface IncidentFormProps {
  onSubmit?: () => void;
}

export default function IncidentForm({ onSubmit }: IncidentFormProps) {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [noiseLevel, setNoiseLevel] = useState<number>(0);
  const [noiseType, setNoiseType] = useState("");
  const { toast } = useToast();

  const validateForm = () => {
    const errors: string[] = [];
    if (!location) errors.push("La localisation est requise");
    if (!category) errors.push("La catégorie est requise");
    if (!description) errors.push("La description est requise");
    if (description && description.length < 10) {
      errors.push("La description doit contenir au moins 10 caractères");
    }
    if (category === "noise" && !noiseType) {
      errors.push("Le type de nuisance sonore est requis");
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentative de soumission du formulaire");
    
    if (!validateForm()) {
      console.log("Erreurs de validation:", validationErrors);
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs avant de soumettre",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const [lat, lng] = location.split(",").map(coord => parseFloat(coord.trim()));
      
      const incidentData = {
        category_id: category,
        description,
        location_lat: lat,
        location_lng: lng,
        status: "PENDING",
        metadata: category === "noise" ? {
          noise_level: noiseLevel,
          noise_type: noiseType
        } : null
      };

      const { data: incident, error: incidentError } = await supabase
        .from("incidents")
        .insert(incidentData)
        .select()
        .single();

      if (incidentError) throw incidentError;

      if (image && incident) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${incident.id}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('incident-attachments')
          .upload(filePath, image);

        if (uploadError) throw uploadError;
      }
      
      toast({
        title: "Signalement envoyé",
        description: "Votre signalement a été enregistré avec succès",
      });
      
      setLocation("");
      setCategory("");
      setDescription("");
      setImage(null);
      setNoiseLevel(0);
      setNoiseType("");
      setValidationErrors([]);

      onSubmit?.();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du signalement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreurs de validation</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <LocationInput location={location} setLocation={setLocation} />
      <CategorySelect category={category} setCategory={setCategory} />

      {category === "noise" && (
        <>
          <NoiseTypeSelect noiseType={noiseType} setNoiseType={setNoiseType} />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Mesure du niveau sonore
            </label>
            <NoiseAnalyzer onNoiseLevel={setNoiseLevel} />
          </div>
        </>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Description *</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-32"
          placeholder="Décrivez le problème..."
          required
        />
      </div>

      <PhotoUpload image={image} setImage={setImage} />

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Envoi en cours..." : "Envoyer le signalement"}
      </Button>
      
      <p className="text-sm text-gray-500 text-center">
        * Champs obligatoires
      </p>
    </form>
  );
}