
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: "small" | "medium" | "large";
  readOnly?: boolean;
}

export function StarRating({
  rating,
  onRatingChange,
  size = "medium",
  readOnly = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const totalStars = 5;

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (readOnly) return;
    if (onRatingChange) {
      onRatingChange(index);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "w-4 h-4";
      case "medium":
        return "w-6 h-6";
      case "large":
        return "w-8 h-8";
      default:
        return "w-6 h-6";
    }
  };

  const sizeClass = getSizeClass();
  const cursorClass = readOnly ? "cursor-default" : "cursor-pointer";

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= (hoverRating || rating);
        
        return (
          <div
            key={index}
            className={cn("relative inline-block", cursorClass)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
            data-testid={`star-${starValue}`}
          >
            <Star
              className={cn(
                sizeClass,
                "transition-colors",
                isActive ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-300"
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
