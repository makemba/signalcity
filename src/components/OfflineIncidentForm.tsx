
import { useState } from "react";
import { Send, AlertTriangle, Camera, CloudOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LocationInput } from "./incident-form/LocationInput";
import { CategorySelect } from "./incident-form/CategorySelect";
import { NoiseTypeSelect } from "./incident-form/NoiseTypeSelect";
import { PhotoUpload } from "./incident-form/PhotoUpload";
import { motion } from "framer-motion";
import { saveOfflineIncident } from "@/services/offlineStorage";
import { toast } from "sonner";

interface OfflineIncidentFormProps {
  onSubmit?: () => void;
}

export default function OfflineIncidentForm({ onSubmit }: OfflineIncidentFormProps) {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [noiseType, setNoiseType] = useState("");
  const { toast: useToastRef } = useToast();

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
    console.log("Tentative de soumission du formulaire (mode hors ligne)");
    
    if (!validateForm()) {
      console.log("Erreurs de validation:", validationErrors);
      useToastRef({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs avant de soumettre",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const [lat, lng] = location.split(",").map(coord => parseFloat(coord.trim()));
      
      const offlineIncidentData = {
        categoryId: category,
        description,
        location: { lat, lng },
        status: "PENDING",
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        pendingUpload: true,
        metadata: category === "noise" ? {
          noise_type: noiseType
        } : undefined,
        attachments: image ? [{
          id: 1,
          type: "image",
          url: URL.createObjectURL(image),
          name: image.name,
          size: image.size
        }] : []
      };

      saveOfflineIncident(offlineIncidentData);
      
      toast.success("Signalement enregistré", {
        description: "Votre signalement a été enregistré localement et sera synchronisé lorsque vous serez en ligne."
      });
      
      setLocation("");
      setCategory("");
      setDescription("");
      setImage(null);
      setNoiseType("");
      setValidationErrors([]);

      onSubmit?.();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      useToastRef({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement local du signalement",
        variant: "destructive",
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
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert variant="warning" className="bg-amber-50 border border-amber-200">
        <CloudOff className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 font-semibold">Mode hors connexion</AlertTitle>
        <AlertDescription className="text-amber-700">
          Vous êtes actuellement hors ligne. Votre signalement sera enregistré localement 
          et synchronisé lorsque vous serez à nouveau connecté à Internet.
        </AlertDescription>
      </Alert>
      
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
          {isSubmitting ? "Enregistrement..." : "Enregistrer le signalement"}
        </Button>
        
        <p className="text-sm text-gray-500 text-center mt-3">
          * Champs obligatoires
        </p>
      </div>
    </form>
  );
}
