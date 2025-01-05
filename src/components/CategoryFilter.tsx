import { Button } from "@/components/ui/button";
import { INCIDENT_CATEGORIES } from "@/lib/constants";

const CategoryFilter = () => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button variant="outline" className="text-sm">
        Tous
      </Button>
      {INCIDENT_CATEGORIES.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          className="text-sm flex items-center gap-2"
        >
          <category.icon className={`h-4 w-4 ${category.color}`} />
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;