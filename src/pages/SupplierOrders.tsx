import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Clock, AlertCircle } from 'lucide-react';
import { useSupplierOrders } from '@/hooks/useOrders';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SupplierHeader from '@/components/SupplierHeader';
import OrderDetailsDialog from '@/components/supplier/OrderDetailsDialog';
import OrderStatusCards from '@/components/supplier/OrderStatusCards';

const SupplierOrders = () => {
  const { orders: orderItems = [], isLoading, updateStatus, updateTracking } = useSupplierOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Agrupar order_items por order_id
  const groupedOrders = orderItems.reduce((acc: any, item: any) => {
    const orderId = item.orders.id;
    if (!acc[orderId]) {
      acc[orderId] = {
        id: orderId,
        orderNumber: orderId.substring(0, 8).toUpperCase(),
        status: item.status,
        total: item.orders.total_amount,
        createdAt: item.orders.created_at,
        shippingAddress: JSON.parse(item.orders.shipping_address),
        customerName: item.orders.customer_name,
        customerPhone: item.orders.customer_phone,
        customerEmail: item.orders.customer_email,
        items: []
      };
    }
    acc[orderId].items.push({
      id: item.id,
      name: item.products.name,
      quantity: item.quantity,
      price: item.price,
      sku: item.products.sku,
      image: item.products.image_urls?.[0]
    });
    return acc;
  }, {});

  const orders = Object.values(groupedOrders);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'shipped':
        return <Clock className="h-4 w-4" />;
      case 'delivered':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedOrder: any = orders.find((order: any) => order.id === selectedOrderId);

  const statusCounts = orders.reduce<Record<string, number>>((acc, order: any) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SupplierHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Gestão de Pedidos</h1>
          <p>Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SupplierHeader />
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold">Gestão de Pedidos</h1>

        <OrderStatusCards statusCounts={statusCounts} />

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número do pedido ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos os Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhum pedido encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>
                          {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {getStatusLabel(order.status)}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          R$ {order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        open={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onUpdateStatus={(orderId, status) => updateStatus({ orderId, status })}
        onUpdateTracking={(orderId, trackingCode) => updateTracking({ orderId, trackingCode })}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
      />
    </div>
  );
};

export default SupplierOrders;
