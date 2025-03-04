
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CategorySelect from "./incident-form/CategorySelect";
import LocationInput from "./incident-form/LocationInput";
import NoiseTypeSelect from "./incident-form/NoiseTypeSelect";
import PhotoUpload from "./incident-form/PhotoUpload";
import VideoUpload from "./incident-form/VideoUpload";
import { AlertTriangle, Save } from "lucide-react";
import { saveOfflineIncident, IncidentStatus } from "@/services/offlineStorage";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OfflineIncidentForm = () => {
  const [categoryId, setCategoryId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 48.866667,
    lng: 2.333333,
  });
  const [noiseType, setNoiseType] = useState<string>("");
  const [photos, setPhotos] = useState<{ dataUrl: string; file: File }[]>([]);
  const [videos, setVideos] = useState<{ dataUrl: string; file: File }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }

    if (!description || description.trim().length < 10) {
      toast.error("Veuillez fournir une description détaillée (minimum 10 caractères)");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare the attachment objects
      const attachments = photos.map(photo => ({
        type: "image",
        dataUrl: photo.dataUrl,
        fileName: photo.file.name,
        fileSize: photo.file.size,
        contentType: photo.file.type,
      }));

      videos.forEach(video => {
        attachments.push({
          type: "video",
          dataUrl: video.dataUrl,
          fileName: video.file.name,
          fileSize: video.file.size,
          contentType: video.file.type,
        });
      });

      // Create a new date for both date and createdAt fields
      const now = new Date().toISOString();

      // Save the incident to local storage
      const offlineIncident = saveOfflineIncident({
        categoryId,
        description,
        location,
        status: "PENDING" as IncidentStatus,
        date: now,
        createdAt: now,
        pendingUpload: true,
        metadata: {
          noise_type: noiseType,
        },
        attachments,
      });

      toast({
        title: "Incident enregistré localement",
        description: "Votre signalement sera synchronisé dès que vous serez connecté",
        variant: "default",
      });

      // Navigate back to home page
      navigate("/");
    } catch (error) {
      console.error("Error saving offline incident:", error);
      toast.error("Erreur lors de l'enregistrement", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="bg-yellow-50 p-3 rounded-md mb-6 flex items-start gap-2">
        <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-yellow-800">Mode hors ligne</h3>
          <p className="text-sm text-yellow-700">
            Vous êtes actuellement hors ligne. Votre signalement sera enregistré
            sur votre appareil et sera synchronisé automatiquement lorsque vous
            serez de nouveau connecté.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <CategorySelect
              value={categoryId}
              onChange={(value) => setCategoryId(value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              placeholder="Décrivez l'incident avec le plus de détails possible"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Localisation</label>
            <LocationInput
              value={location}
              onChange={setLocation}
              offlineMode={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type de nuisance sonore</label>
            <NoiseTypeSelect
              value={noiseType}
              onChange={(value) => setNoiseType(value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Photos</label>
            <PhotoUpload photos={photos} setPhotos={setPhotos} maxPhotos={3} />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 3 photos, 5 MB chacune
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vidéos</label>
            <VideoUpload videos={videos} setVideos={setVideos} maxVideos={1} />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 1 vidéo, 50 MB maximum
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Enregistrement...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer localement
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OfflineIncidentForm;
