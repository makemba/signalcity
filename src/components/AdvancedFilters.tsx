import { useState } from "react";
import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdvancedFilters() {
  const [date, setDate] = useState<Date>();
  const [searchText, setSearchText] = useState("");
  const [priority, setPriority] = useState("");

  const handleReset = () => {
    setDate(undefined);
    setSearchText("");
    setPriority("");
    console.log("Filters reset");
  };

  const handleSearch = () => {
    console.log("Searching with filters:", {
      date,
      searchText,
      priority
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher dans les descriptions..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] pl-3 text-left font-normal">
              {date ? (
                date.toLocaleDateString()
              ) : (
                <span>Choisir une date</span>
              )}
              <Calendar className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">Haute</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="low">Basse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          variant="outline"
          onClick={handleReset}
        >
          Réinitialiser
        </Button>
        <Button 
          onClick={handleSearch}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
}