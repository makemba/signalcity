import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveOfflineIncident } from "@/services/offlineStorage";
import { CategorySelect } from "@/components/incident-form/CategorySelect";
import { LocationInput } from "@/components/incident-form/LocationInput";
import { NoiseTypeSelect } from "@/components/incident-form/NoiseTypeSelect";
import { PhotoUpload } from "@/components/incident-form/PhotoUpload";
import { VideoUpload } from "@/components/incident-form/VideoUpload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OfflineIncidentFormProps {
  onSuccess?: () => void;
}

const OfflineIncidentForm: React.FC<OfflineIncidentFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [noiseType, setNoiseType] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
		setIsLoading(true);

    const incidentData = {
      title,
      description,
      category,
      location,
      noiseType,
      photo,
      video,
      status: "PENDING",
      created_at: new Date().toISOString(),
    };

    try {
      await saveOfflineIncident(incidentData);
      toast.success("Incident saved offline!");
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setNoiseType("");
      setPhoto(null);
      setVideo(null);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving offline incident:", error);
      toast.error("Failed to save incident offline.");
    } finally {
			setIsLoading(false);
		}
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Offline Incident Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <CategorySelect onChange={(value) => setCategory(value)} value={category} />
          </div>
          <div>
            <LocationInput onChange={(value) => setLocation(value)} value={location} />
          </div>
          <div>
            <NoiseTypeSelect onChange={(value) => setNoiseType(value)} value={noiseType} />
          </div>
          <div>
            <PhotoUpload onChange={(file) => setPhoto(file)} file={photo} />
          </div>
          <div>
            <VideoUpload onChange={(file) => setVideo(file)} file={video} />
          </div>
          <Button type="submit" disabled={isLoading}>
						{isLoading ? (
							<>
								Enregistrement...
								<Loader2 className="ml-2 h-4 w-4 animate-spin" />
							</>
						) : (
							"Save Offline"
						)}
					</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OfflineIncidentForm;
