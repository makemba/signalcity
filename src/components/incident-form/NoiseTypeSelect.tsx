import { NOISE_TYPES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NoiseTypeSelectProps {
  noiseType: string;
  setNoiseType: (noiseType: string) => void;
}

export function NoiseTypeSelect({ noiseType, setNoiseType }: NoiseTypeSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Type de nuisance sonore *</label>
      <Select value={noiseType} onValueChange={setNoiseType} required>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez le type de bruit" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(NOISE_TYPES).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}