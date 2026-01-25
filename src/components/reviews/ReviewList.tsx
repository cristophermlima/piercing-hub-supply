import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { useProductReviews, useProductRating } from '@/hooks/useReviews';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ReviewListProps {
  productId: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const { data: reviews, isLoading } = useProductReviews(productId);
  const { data: ratingData } = useProductRating(productId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews?.filter((r) => r.rating === star).length || 0;
    const percentage = reviews?.length ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary">
            {ratingData?.average.toFixed(1) || '0.0'}
          </div>
          <StarRating
            rating={ratingData?.average || 0}
            size="lg"
            className="justify-center my-2"
          />
          <p className="text-muted-foreground">
            {ratingData?.count || 0} avaliações
          </p>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm w-6">{star}</span>
              <StarRating rating={1} size="sm" />
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {!reviews?.length ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma avaliação ainda. Seja o primeiro a avaliar!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{review.user_name}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
