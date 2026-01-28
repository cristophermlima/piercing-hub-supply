import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Trash2, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { usePriceAlerts, useDeletePriceAlert } from '@/hooks/usePriceAlerts';
import { useCart } from '@/hooks/useCart';

const UserPriceAlerts = () => {
  const navigate = useNavigate();
  const { items: cartItems = [] } = useCart();
  const { data: alerts = [], isLoading } = usePriceAlerts();
  const deleteAlert = useDeletePriceAlert();
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getDiscount = (original: number, target: number) => {
    return Math.round((1 - target / original) * 100);
  };

  const isTriggered = (alert: typeof alerts[0]) => {
    return alert.products && alert.products.price <= alert.target_price;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm=""
        onSearchChange={() => {}}
        cartItems={totalCartItems}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Alertas de Preço</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Meus Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Você não tem alertas de preço configurados.</p>
                <p className="text-sm mt-2">
                  Visite os produtos e configure alertas para ser notificado quando o preço baixar.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-center gap-4 p-4 border rounded-lg ${
                      isTriggered(alert) ? 'border-green-500 bg-green-50' : ''
                    }`}
                  >
                    {alert.products?.image_urls?.[0] && (
                      <img
                        src={alert.products.image_urls[0]}
                        alt={alert.products.name}
                        className="w-16 h-16 object-cover rounded cursor-pointer"
                        onClick={() => navigate(`/product/${alert.product_id}`)}
                      />
                    )}
                    <div className="flex-1">
                      <h4
                        className="font-semibold cursor-pointer hover:text-primary"
                        onClick={() => navigate(`/product/${alert.product_id}`)}
                      >
                        {alert.products?.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          Preço atual: R$ {alert.products?.price.toFixed(2)}
                        </span>
                        {isTriggered(alert) && (
                          <Badge className="bg-green-500">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            Preço atingido!
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-primary">
                          Meta: R$ {alert.target_price.toFixed(2)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          -{getDiscount(alert.original_price, alert.target_price)}%
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlert.mutate(alert.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserPriceAlerts;
