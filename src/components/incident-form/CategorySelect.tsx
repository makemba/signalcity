
import { INCIDENT_CATEGORIES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectProps {
  category: string;
  setCategory: (category: string) => void;
}

export function CategorySelect({ category, setCategory }: CategorySelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        <span className="h-4 w-4 text-blue-500">📋</span>
        Catégorie *
      </label>
      <Select value={category} onValueChange={setCategory} required>
        <SelectTrigger className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md">
          <SelectValue placeholder="Sélectionnez une catégorie" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-auto">
          <div className="p-2 text-xs text-gray-500 border-b">Choisissez le type d'incident</div>
          {INCIDENT_CATEGORIES.map((cat) => (
            <SelectItem key={cat.id} value={cat.id} className="cursor-pointer hover:bg-blue-50">
              <div className="flex items-center gap-2 py-1">
                <cat.icon className={`h-4 w-4 ${cat.color}`} />
                <span>{cat.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {category && (
        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
          {INCIDENT_CATEGORIES.find(cat => cat.id === category)?.description || "Signalez cet incident avec le plus de détails possible"}
        </p>
      )}
    </div>
  );
}
