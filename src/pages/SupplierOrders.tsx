
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const SupplierOrders = () => {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'PED-2024-001',
      customerName: 'Studio Piercing Arte',
      customerEmail: 'contato@studioarte.com',
      items: [
        { id: '1', name: 'Labret Titânio 8mm', quantity: 5, price: 45.00 },
        { id: '2', name: 'Argola Segmento 10mm', quantity: 3, price: 65.00 }
      ],
      total: 420.00,
      status: 'pending',
      createdAt: '2024-01-20',
      shippingAddress: {
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      }
    },
    {
      id: '2',
      orderNumber: 'PED-2024-002',
      customerName: 'Piercer Professional',
      customerEmail: 'pedro@piercerpro.com',
      items: [
        { id: '3', name: 'Barbell Curvo Ouro 18k', quantity: 2, price: 380.00 }
      ],
      total: 760.00,
      status: 'processing',
      createdAt: '2024-01-19',
      shippingAddress: {
        street: 'Av. Principal, 456',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '20123-456'
      }
    },
    {
      id: '3',
      orderNumber: 'PED-2024-003',
      customerName: 'Body Art Studio',
      customerEmail: 'vendas@bodyart.com',
      items: [
        { id: '4', name: 'Plugs Titânio 12mm', quantity: 10, price: 25.00 },
        { id: '5', name: 'Argola Captive 8mm', quantity: 8, price: 35.00 }
      ],
      total: 530.00,
      status: 'shipped',
      createdAt: '2024-01-18',
      shippingAddress: {
        street: 'Rua do Comércio, 789',
        city: 'Belo Horizonte',
        state: 'MG',
        zipCode: '30123-789'
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
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
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Processando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    console.log(`Atualizando pedido ${orderId} para status: ${newStatus}`);
    // Aqui implementaríamos a atualização no banco de dados
  };

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-black text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Detalhes do Pedido</h1>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Voltar
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Número:</strong> {selectedOrder.orderNumber}
                </div>
                <div>
                  <strong>Data:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR')}
                </div>
                <div>
                  <strong>Status:</strong>
                  <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1">{getStatusLabel(selectedOrder.status)}</span>
                  </Badge>
                </div>
                <div>
                  <strong>Total:</strong> R$ {selectedOrder.total.toFixed(2)}
                </div>
                
                <div className="mt-4">
                  <strong>Atualizar Status:</strong>
                  <Select onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecionar novo status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="processing">Processando</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Nome:</strong> {selectedOrder.customerName}
                </div>
                <div>
                  <strong>Email:</strong> {selectedOrder.customerEmail}
                </div>
                <div>
                  <strong>Endereço de Entrega:</strong>
                  <div className="mt-1 text-sm text-gray-600">
                    {selectedOrder.shippingAddress.street}<br/>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br/>
                    CEP: {selectedOrder.shippingAddress.zipCode}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Preço Unit.</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>R$ {item.price.toFixed(2)}</TableCell>
                        <TableCell>R$ {(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Gestão de Pedidos</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos Pendentes</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Processamento</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Enviados</p>
                  <p className="text-2xl font-bold">25</p>
                </div>
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Entregues</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número do pedido ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por status" />
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
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusLabel(order.status)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierOrders;
