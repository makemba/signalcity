import { Button } from "@/components/ui/button";
import { INCIDENT_CATEGORIES } from "@/lib/constants";

export default function CategoryFilter() {
  return (
    <div className="flex flex-wrap gap-2">
      {INCIDENT_CATEGORIES.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => console.log(`Filter by ${category.id}`)}
        >
          <category.icon className={`h-4 w-4 ${category.color}`} />
          {category.label}
        </Button>
      ))}
    </div>
  );
}