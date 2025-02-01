import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  image: File | null;
  setImage: (image: File | null) => void;
}

export function PhotoUpload({ image, setImage }: PhotoUploadProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Photo</label>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
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
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        {image && (
          <span className="text-sm text-gray-600 truncate max-w-[200px]">
            {image.name}
          </span>
        )}
      </div>
    </div>
  );
}