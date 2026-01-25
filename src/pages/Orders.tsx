import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOrders } from '@/hooks/useOrders';
import { OrderTrackingTimeline } from '@/components/orders/OrderTrackingTimeline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Package, Loader2, ArrowLeft, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendente', variant: 'outline' },
  confirmed: { label: 'Confirmado', variant: 'secondary' },
  processing: { label: 'Em Processamento', variant: 'default' },
  shipped: { label: 'Enviado', variant: 'default' },
  in_transit: { label: 'Em Trânsito', variant: 'default' },
  out_for_delivery: { label: 'Saiu para Entrega', variant: 'default' },
  delivered: { label: 'Entregue', variant: 'secondary' },
  completed: { label: 'Concluído', variant: 'secondary' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

const Orders = () => {
  const { orders, isLoading } = useOrders();
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('pending');

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

  const handleTrackOrder = (orderId: string, status: string) => {
    setSelectedOrderId(orderId);
    setSelectedOrderStatus(status);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchTerm="" onSearchChange={() => {}} cartItems={0} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/marketplace')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Marketplace
          </Button>
          <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe todos os seus pedidos</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h2>
              <p className="text-muted-foreground mb-4">
                Quando você finalizar uma compra, seus pedidos aparecerão aqui.
              </p>
              <Button onClick={() => navigate('/marketplace')}>
                Explorar Produtos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusLabels[order.status]?.variant || 'default'}>
                        {statusLabels[order.status]?.label || order.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrackOrder(order.id, order.status)}
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Rastrear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-4 py-3 border-b last:border-0 cursor-pointer hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
                        onClick={() => navigate(`/product/${item.product_id}`)}
                      >
                        <img
                          src={item.products.image_urls?.[0] || '/placeholder.svg'}
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">{item.products.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {item.quantity}
                          </p>
                          {item.tracking_code && (
                            <p className="text-xs text-primary">
                              Rastreio: {item.tracking_code}
                            </p>
                          )}
                        </div>
                        <p className="font-semibold">R$ {((item.price || 0) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-primary">R$ {order.total_amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Dialog */}
      <Dialog open={!!selectedOrderId} onOpenChange={(open) => !open && setSelectedOrderId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rastreamento do Pedido</DialogTitle>
          </DialogHeader>
          {selectedOrderId && (
            <OrderTrackingTimeline 
              orderId={selectedOrderId} 
              currentStatus={selectedOrderStatus}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
