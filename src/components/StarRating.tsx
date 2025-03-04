
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: 'small' | 'medium' | 'large';
  maxStars?: number;
  readOnly?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  onRatingChange,
  size = 'medium',
  maxStars = 5,
  readOnly = false,
  className
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const getStarSize = () => {
    switch (size) {
      case 'small':
        return 'h-4 w-4';
      case 'large':
        return 'h-8 w-8';
      case 'medium':
      default:
        return 'h-6 w-6';
    }
  };

  const starSize = getStarSize();

  return (
    <div 
      className={cn(
        'flex items-center gap-1', 
        readOnly ? 'cursor-default' : 'cursor-pointer',
        className
      )}
    >
      {Array.from({ length: maxStars }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = (hoverRating || rating) >= starValue;

        return (
          <Star
            key={i}
            className={cn(
              starSize,
              'transition-all duration-100',
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
              !readOnly && 'hover:scale-110'
            )}
            onClick={() => !readOnly && onRatingChange(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
          />
        );
      })}
      
      {!readOnly && (
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating}/${maxStars}` : ''}
        </span>
      )}
    </div>
  );
}
