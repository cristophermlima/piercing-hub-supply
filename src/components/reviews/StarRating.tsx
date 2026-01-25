import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showValue = false,
  className,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index);
    }
  };

  const renderStar = (index: number) => {
    const filled = index <= displayRating;
    const halfFilled = !filled && index - 0.5 <= displayRating && index - 0.5 > displayRating - 1;

    return (
      <button
        key={index}
        type="button"
        disabled={!interactive}
        onClick={() => handleClick(index)}
        onMouseEnter={() => interactive && setHoverRating(index)}
        onMouseLeave={() => interactive && setHoverRating(null)}
        className={cn(
          'focus:outline-none transition-transform',
          interactive && 'cursor-pointer hover:scale-110',
          !interactive && 'cursor-default'
        )}
      >
        {halfFilled ? (
          <StarHalf
            className={cn(
              sizeClasses[size],
              'fill-yellow-400 text-yellow-400'
            )}
          />
        ) : (
          <Star
            className={cn(
              sizeClasses[size],
              filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
            )}
          />
        )}
      </button>
    );
  };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }, (_, i) => renderStar(i + 1))}
      {showValue && (
        <span className="ml-1.5 text-sm text-muted-foreground">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};
