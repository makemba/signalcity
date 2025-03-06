
import { ChangeEvent, useState } from "react";
import { Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  video: File | null;
  setVideo: (video: File | null) => void;
}

export function VideoUpload({ video, setVideo }: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.log("No file selected");
      return;
    }

    const file = e.target.files[0];
    console.log("Selected file:", file.name, file.type, file.size);

    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Format non supporté",
        description: "Veuillez sélectionner une vidéo au format MP4 ou MOV",
      });
      return;
    }

    // Validate file size (25MB max)
    if (file.size > 25 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Fichier trop volumineux",
        description: "La taille de la vidéo ne doit pas dépasser 25MB",
      });
      return;
    }

    setVideo(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(URL.createObjectURL(file));
    };
    reader.readAsDataURL(file);
  };

  const removeVideo = () => {
    setVideo(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        <Video className="h-4 w-4 text-blue-500" />
        Vidéo (optionnel)
      </label>

      {preview ? (
        <div className="relative">
          <video 
            src={preview} 
            controls
            className="w-full h-48 object-cover rounded-md border border-gray-300"
          />
          <button
            type="button"
            onClick={removeVideo}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('videoInput')?.click()}
            className="w-full h-24 border-dashed border-2 flex flex-col items-center justify-center gap-1"
          >
            <Video className="h-5 w-5" />
            <span className="text-sm">Cliquez pour ajouter une vidéo</span>
          </Button>
          <input
            id="videoInput"
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv"
            onChange={handleVideoChange}
            className="hidden"
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        Formats acceptés: MP4, MOV. Taille max: 25MB
      </p>
    </div>
  );
}
