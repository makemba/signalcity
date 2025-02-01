import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface LocationInputProps {
  location: string;
  setLocation: (location: string) => void;
}

export function LocationInput({ location, setLocation }: LocationInputProps) {
  const { toast } = useToast();

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
          setLocation(coords);
          console.log("Position récupérée:", coords);
          toast({
            title: "Localisation",
            description: "Position actuelle récupérée avec succès",
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          toast({
            title: "Erreur de géolocalisation",
            description: "Impossible de récupérer votre position",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Localisation *</label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Coordonnées GPS"
          required
        />
        <Button
          type="button"
          onClick={handleLocation}
          variant="outline"
          size="icon"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}