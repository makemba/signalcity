
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoUploadProps {
  video: File | null;
  setVideo: (video: File | null) => void;
}

export function VideoUpload({ video, setVideo }: VideoUploadProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Vidéo</label>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
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
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
        />
        {video && (
          <span className="text-sm text-gray-600 truncate max-w-[200px]">
            {video.name}
          </span>
        )}
      </div>
    </div>
  );
}
