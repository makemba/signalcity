
import { Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface VideoUploadProps {
  video: File | null;
  setVideo: (video: File | null) => void;
}

export function VideoUpload({ video, setVideo }: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleVideoSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideo(file);
    
    if (file) {
      // Create video preview URL
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const clearVideo = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setVideo(null);
    setPreview(null);
    const input = document.getElementById("video-input") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        <Video className="h-4 w-4 text-blue-500" />
        Vidéo
      </label>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600"
            onClick={() => document.getElementById("video-input")?.click()}
          >
            <Video className="h-4 w-4" />
            <span>Ajouter une vidéo</span>
          </Button>
          <input
            id="video-input"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoSelection}
          />
          {video && (
            <div className="flex items-center gap-2 text-sm text-gray-600 overflow-hidden">
              <span className="truncate max-w-[150px]">{video.name}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={clearVideo}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        {preview && (
          <div className="relative border border-gray-200 rounded-md overflow-hidden w-full max-w-xs">
            <video 
              src={preview} 
              controls 
              className="max-h-40 w-full" 
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black/90"
              onClick={clearVideo}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">Formats acceptés: MP4, MOV, WebM (max 20 MB, 30 sec)</p>
    </div>
  );
}
