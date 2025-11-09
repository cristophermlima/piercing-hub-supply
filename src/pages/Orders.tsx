import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/useOrders';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Package, Loader2 } from 'lucide-react';

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendente', variant: 'outline' },
  confirmed: { label: 'Confirmado', variant: 'secondary' },
  processing: { label: 'Em Processamento', variant: 'default' },
  shipped: { label: 'Enviado', variant: 'default' },
  delivered: { label: 'Entregue', variant: 'secondary' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

const Orders = () => {
  const { orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe todos os seus pedidos</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h2>
              <p className="text-muted-foreground">
                Quando você finalizar uma compra, seus pedidos aparecerão aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{order.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <Badge variant={statusLabels[order.status]?.variant || 'default'}>
                      {statusLabels[order.status]?.label || order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                        <img
                          src={item.products.image_urls?.[0] || '/placeholder.svg'}
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.products.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">R$ {item.total_price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold">R$ {order.total_amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
