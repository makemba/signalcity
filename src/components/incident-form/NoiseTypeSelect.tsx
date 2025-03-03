
import { NOISE_TYPES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Volume2 } from "lucide-react";

interface NoiseTypeSelectProps {
  noiseType: string;
  setNoiseType: (noiseType: string) => void;
}

export function NoiseTypeSelect({ noiseType, setNoiseType }: NoiseTypeSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1">
        <Volume2 className="h-4 w-4 text-blue-500" />
        Type de nuisance sonore *
      </label>
      <Select value={noiseType} onValueChange={setNoiseType} required>
        <SelectTrigger className="w-full bg-white border-gray-300 focus-visible:ring-blue-500 focus-visible:border-blue-500 rounded-md shadow-sm">
          <SelectValue placeholder="Sélectionnez le type de bruit" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-auto">
          <div className="p-2 text-xs text-gray-500 border-b">Précisez la source du bruit</div>
          {Object.entries(NOISE_TYPES).map(([key, value]) => (
            <SelectItem key={key} value={key} className="cursor-pointer hover:bg-blue-50 py-1.5">
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
