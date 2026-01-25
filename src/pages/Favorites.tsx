import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Loader2, ShoppingCart, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAddToCart } from '@/hooks/useCart';

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: favorites, isLoading } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchTerm="" onSearchChange={() => {}} cartItems={0} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const handleRemoveFavorite = (productId: string) => {
    toggleFavorite({ productId, isFavorite: true });
  };

  const handleAddToCart = (productId: string) => {
    addToCart({ productId, quantity: 1 });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchTerm="" onSearchChange={() => {}} cartItems={0} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          <h1 className="text-2xl font-bold">Meus Favoritos</h1>
          <Badge variant="secondary">{favorites?.length || 0} itens</Badge>
        </div>

        {!favorites?.length ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h2>
              <p className="text-muted-foreground mb-4">
                Adicione produtos aos favoritos para encontrá-los facilmente depois
              </p>
              <Button onClick={() => navigate('/marketplace')}>
                Explorar Produtos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => {
              const product = favorite.products;
              if (!product) return null;

              return (
                <Card key={favorite.id} className="overflow-hidden group">
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={product.image_urls?.[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={() => handleRemoveFavorite(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      {product.suppliers?.company_name}
                    </p>
                    <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>
                    <p className="text-lg font-bold text-primary mb-3">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={isAddingToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
