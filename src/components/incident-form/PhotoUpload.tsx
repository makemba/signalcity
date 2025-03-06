
import { ChangeEvent, useState } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  image: File | null;
  setImage: (image: File | null) => void;
}

export function PhotoUpload({ image, setImage }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.log("No file selected");
      return;
    }

    const file = e.target.files[0];
    console.log("Selected file:", file.name, file.type, file.size);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Format non supporté",
        description: "Veuillez sélectionner une image JPG ou PNG",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Fichier trop volumineux",
        description: "La taille de l'image ne doit pas dépasser 5MB",
      });
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        <Camera className="h-4 w-4 text-blue-500" />
        Photo (optionnel)
      </label>

      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-md border border-gray-300"
          />
          <button
            type="button"
            onClick={removeImage}
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
            onClick={() => document.getElementById('photoInput')?.click()}
            className="w-full h-24 border-dashed border-2 flex flex-col items-center justify-center gap-1"
          >
            <Camera className="h-5 w-5" />
            <span className="text-sm">Cliquez pour ajouter une photo</span>
          </Button>
          <input
            id="photoInput"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        Formats acceptés: JPG, PNG. Taille max: 5MB
      </p>
    </div>
  );
}
