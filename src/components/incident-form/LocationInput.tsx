
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
      toast({
        title: "Géolocalisation en cours",
        description: "Récupération de votre position actuelle...",
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
          setLocation(coords);
          console.log("Position récupérée:", coords);
          toast({
            title: "Localisation réussie",
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
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        <MapPin className="h-4 w-4 text-blue-500" />
        Localisation *
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Coordonnées GPS"
          className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <Button
          type="button"
          onClick={handleLocation}
          variant="outline"
          size="icon"
          className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500">Format: latitude, longitude (ex: 48.8566, 2.3522)</p>
    </div>
  );
}
