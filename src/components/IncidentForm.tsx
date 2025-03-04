
import { Send, AlertTriangle, Camera, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { VideoUpload } from "./incident-form/VideoUpload";
import { motion } from "framer-motion";

interface IncidentFormProps {
  onSubmit?: () => void;
  onSuccess?: (id: string) => void;
}

export default function IncidentForm({ onSubmit, onSuccess }: IncidentFormProps) {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [noiseLevel, setNoiseLevel] = useState<number>(0);
  const [noiseType, setNoiseType] = useState("");

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
      toast.error("Erreur de validation", {
        description: "Veuillez corriger les erreurs avant de soumettre"
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

      if (video && incident) {
        const fileExt = video.name.split('.').pop();
        const filePath = `${incident.id}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('incident-videos')
          .upload(filePath, video);

        if (uploadError) throw uploadError;
      }
      
      toast.success("Signalement envoyé", {
        description: "Votre signalement a été enregistré avec succès",
      });
      
      setLocation("");
      setCategory("");
      setDescription("");
      setImage(null);
      setVideo(null);
      setNoiseLevel(0);
      setNoiseType("");
      setValidationErrors([]);

      onSubmit?.();
      
      if (onSuccess && incident) {
        onSuccess(incident.id.toString());
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de l'envoi du signalement"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      component: <LocationInput location={location} setLocation={setLocation} />,
      key: "location"
    },
    {
      component: <CategorySelect category={category} setCategory={setCategory} />,
      key: "category"
    },
    {
      component: category === "noise" && (
        <NoiseTypeSelect noiseType={noiseType} setNoiseType={setNoiseType} />
      ),
      key: "noiseType",
      condition: category === "noise"
    },
    {
      component: category === "noise" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Mesure du niveau sonore
          </label>
          <NoiseAnalyzer onNoiseLevel={setNoiseLevel} />
        </div>
      ),
      key: "noiseAnalyzer",
      condition: category === "noise"
    },
    {
      component: (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description *</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-32 resize-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Décrivez le problème..."
            required
          />
        </div>
      ),
      key: "description"
    },
    {
      component: <PhotoUpload image={image} setImage={setImage} />,
      key: "photo"
    },
    {
      component: <VideoUpload video={video} setVideo={setVideo} />,
      key: "video"
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive" className="bg-red-50 border border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800 font-semibold">Erreurs de validation</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4 text-red-700">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="space-y-6 bg-gray-50 p-5 rounded-lg border border-gray-100">
        {formFields.map((field, index) => 
          field.condition !== false && (
            <motion.div 
              key={field.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {field.component}
            </motion.div>
          )
        )}
      </div>

      <div className="pt-4 border-t border-gray-100">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
          disabled={isSubmitting}
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Envoi en cours..." : "Envoyer le signalement"}
        </Button>
        
        <p className="text-sm text-gray-500 text-center mt-3">
          * Champs obligatoires
        </p>
      </div>
    </form>
  );
}
