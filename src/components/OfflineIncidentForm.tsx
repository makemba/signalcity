
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { saveOfflineIncident } from "@/services/offlineStorage";
import { CategorySelect } from "@/components/incident-form/CategorySelect";
import { LocationInput } from "@/components/incident-form/LocationInput";
import { NoiseTypeSelect } from "@/components/incident-form/NoiseTypeSelect";
import { PhotoUpload } from "@/components/incident-form/PhotoUpload";
import { VideoUpload } from "@/components/incident-form/VideoUpload";
import { OfflineIncident } from "@/services/offlineStorage";

interface OfflineIncidentFormProps {
  onSuccess: () => void;
}

export default function OfflineIncidentForm({ onSuccess }: OfflineIncidentFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [noiseType, setNoiseType] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !location) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Split location string into lat and lng
      const [lat, lng] = location.split(',').map(Number);
      
      // Create incident data object
      const incidentData: Omit<OfflineIncident, "offlineId"> = {
        title,
        description,
        category,
        location: { lat, lng },
        noiseType,
        photo: photo || undefined,
        video: video || undefined,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        date: new Date().toISOString(),
        categoryId: category,
        pendingUpload: true
      };
      
      // Save incident to local storage
      await saveOfflineIncident(incidentData);
      
      toast.success("Signalement enregistré hors-ligne", {
        description: "Il sera synchronisé dès que vous serez connecté à Internet."
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving offline incident:", error);
      toast.error("Erreur lors de l'enregistrement", {
        description: "Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Titre de l'incident *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Bruit de voisinage excessif"
            required
          />
        </div>
        
        <CategorySelect 
          category={category}
          setCategory={setCategory}
        />
        
        <LocationInput
          location={location}
          setLocation={setLocation}
        />
        
        <NoiseTypeSelect
          noiseType={noiseType}
          setNoiseType={setNoiseType}
        />
        
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez la situation en détail..."
            rows={4}
            required
          />
        </div>
        
        <PhotoUpload
          image={photo}
          setImage={setPhoto}
        />
        
        <VideoUpload
          video={video}
          setVideo={setVideo}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer hors-ligne"}
        </Button>
      </div>
    </form>
  );
}
