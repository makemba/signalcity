import { Button } from "@/components/ui/button";
import { INCIDENT_CATEGORIES } from "@/lib/constants";
import { useState } from "react";

export default function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {INCIDENT_CATEGORIES.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
              selectedCategory === category.id ? "shadow-md" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <category.icon className={`h-4 w-4 ${category.color}`} />
            {category.label}
          </Button>
        ))}
      </div>
      {selectedCategory && (
        <p className="text-sm text-gray-600 animate-fade-in">
          {INCIDENT_CATEGORIES.find(cat => cat.id === selectedCategory)?.description}
        </p>
      )}
    </div>
  );
}