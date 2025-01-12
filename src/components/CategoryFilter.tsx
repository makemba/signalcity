import { useState } from "react";
import { Button } from "@/components/ui/button";
import { INCIDENT_CATEGORIES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCategoryClick = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    console.log("Catégorie sélectionnée:", categoryId);
    toast({
      title: "Filtre mis à jour",
      description: categoryId ? `Filtrage par ${categoryId}` : "Affichage de toutes les catégories",
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button 
        variant={activeCategory === null ? "default" : "outline"}
        className="text-sm"
        onClick={() => handleCategoryClick(null)}
      >
        Tous
      </Button>
      {INCIDENT_CATEGORIES.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          className="text-sm flex items-center gap-2"
          onClick={() => handleCategoryClick(category.id)}
        >
          <category.icon className={`h-4 w-4 ${category.color}`} />
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;