
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PhotoUploadProps {
  image: File | null;
  setImage: (image: File | null) => void;
}

export function PhotoUpload({ image, setImage }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    const input = document.getElementById("photo-input") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        <Camera className="h-4 w-4 text-blue-500" />
        Photo
      </label>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600"
            onClick={() => document.getElementById("photo-input")?.click()}
          >
            <Camera className="h-4 w-4" />
            <span>Ajouter une photo</span>
          </Button>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelection}
          />
          {image && (
            <div className="flex items-center gap-2 text-sm text-gray-600 overflow-hidden">
              <span className="truncate max-w-[150px]">{image.name}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={clearImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        {preview && (
          <div className="relative border border-gray-200 rounded-md overflow-hidden w-full max-w-xs">
            <img 
              src={preview} 
              alt="Aperçu" 
              className="max-h-40 w-full object-cover" 
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black/90"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">Formats acceptés: JPG, PNG, GIF (max 5 MB)</p>
    </div>
  );
}
