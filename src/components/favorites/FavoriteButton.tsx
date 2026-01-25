import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-11 w-11',
};

const iconSizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  productId,
  size = 'md',
  className,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: isFavorite, isLoading } = useIsFavorite(productId);
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/auth');
      return;
    }

    toggleFavorite({ productId, isFavorite: !!isFavorite });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading || isPending}
      className={cn(
        sizeClasses[size],
        'rounded-full bg-background/80 hover:bg-background shadow-sm',
        className
      )}
    >
      <Heart
        className={cn(
          iconSizeClasses[size],
          'transition-colors',
          isFavorite
            ? 'fill-red-500 text-red-500'
            : 'text-muted-foreground hover:text-red-500'
        )}
      />
    </Button>
  );
};
