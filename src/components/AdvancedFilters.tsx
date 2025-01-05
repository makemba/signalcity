import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export default function AdvancedFilters() {
  const [date, setDate] = useState<Date>();
  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex flex-wrap gap-4 mb-6">
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

      <Button 
        variant="outline"
        onClick={() => {
          setDate(undefined);
          setSearchText("");
        }}
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
}