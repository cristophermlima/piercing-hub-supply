import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StarRating } from '@/components/reviews/StarRating';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { FavoriteButton } from '@/components/favorites/FavoriteButton';
import { useProducts } from '@/hooks/useProducts';
import { useProductRating } from '@/hooks/useReviews';
import { useTrackProductView } from '@/hooks/useRecentlyViewed';
import { useAddToCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ShoppingCart, Minus, Plus, Package, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: products, isLoading } = useProducts();
  const { data: ratingData } = useProductRating(id || '');
  const { mutate: trackView } = useTrackProductView();
  const addToCartMutation = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [supplierUserId, setSupplierUserId] = useState<string | null>(null);

  const product = products?.find(p => p.id === id);

  // Track product view
  useEffect(() => {
    if (id && user) {
      trackView(id);
    }
  }, [id, user, trackView]);

  // Get supplier user_id for chat
  useEffect(() => {
    const fetchSupplierUserId = async () => {
      if (product?.supplier_id) {
        const { data } = await supabase
          .from('suppliers')
          .select('user_id')
          .eq('id', product.supplier_id)
          .single();
        if (data) {
          setSupplierUserId(data.user_id);
        }
      }
    };
    fetchSupplierUserId();
  }, [product?.supplier_id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (id) {
      addToCartMutation.mutate({ productId: id, quantity });
    }
  };

  const handleContactSupplier = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (supplierUserId) {
      navigate('/messages', { state: { partnerId: supplierUserId, productId: id } });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchTerm="" onSearchChange={() => {}} cartItems={0} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchTerm="" onSearchChange={() => {}} cartItems={0} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Produto não encontrado</p>
          <Button onClick={() => navigate('/marketplace')} className="mx-auto mt-4 block">
            Voltar ao Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchTerm="" onSearchChange={() => {}} cartItems={0} />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
              <img
                src={product.image_urls?.[0] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <FavoriteButton productId={product.id} size="lg" />
              </div>
            </div>
            {product.image_urls && product.image_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.image_urls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${product.name} - ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-primary"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-1">{product.suppliers?.company_name}</p>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {ratingData && ratingData.count > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={ratingData.average} size="md" showValue />
                  <span className="text-muted-foreground">
                    ({ratingData.count} avaliações)
                  </span>
                </div>
              )}

              <p className="text-4xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>{product.categories?.name}</Badge>
              {product.material && <Badge variant="secondary">{product.material}</Badge>}
              {product.color && <Badge variant="secondary">{product.color}</Badge>}
              {product.size && <Badge variant="secondary">{product.size}</Badge>}
            </div>

            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock_quantity > 0 
                  ? `${product.stock_quantity} em estoque` 
                  : 'Sem estoque'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantidade:</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || addToCartMutation.isPending}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addToCartMutation.isPending ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={handleContactSupplier}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Contato
              </Button>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {product.technical_description && (
              <div>
                <h3 className="font-semibold mb-2">Descrição Técnica</h3>
                <p className="text-muted-foreground">{product.technical_description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList>
            <TabsTrigger value="reviews">
              Avaliações ({ratingData?.count || 0})
            </TabsTrigger>
            <TabsTrigger value="write-review">Avaliar Produto</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-6">
            <ReviewList productId={product.id} />
          </TabsContent>

          <TabsContent value="write-review" className="mt-6">
            {user ? (
              <div className="max-w-2xl">
                <ReviewForm productId={product.id} />
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Faça login para avaliar este produto
                  </p>
                  <Button onClick={() => navigate('/auth')}>
                    Entrar
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;
