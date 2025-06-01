
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Calendar, Download } from 'lucide-react';

const SupplierReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  // Dados fictícios para os gráficos
  const salesData = [
    { month: 'Jan', vendas: 12450, pedidos: 28 },
    { month: 'Fev', vendas: 15200, pedidos: 35 },
    { month: 'Mar', vendas: 18750, pedidos: 42 },
    { month: 'Abr', vendas: 16800, pedidos: 38 },
    { month: 'Mai', vendas: 22100, pedidos: 51 },
    { month: 'Jun', vendas: 25400, pedidos: 58 }
  ];

  const productPerformance = [
    { name: 'Labret Titânio', value: 35, vendas: 145 },
    { name: 'Argola Segmento', value: 25, vendas: 98 },
    { name: 'Barbell Curvo', value: 20, vendas: 76 },
    { name: 'Plugs', value: 12, vendas: 45 },
    { name: 'Outros', value: 8, vendas: 28 }
  ];

  const topCustomers = [
    { name: 'Studio Piercing Arte', pedidos: 15, total: 4250.00, ultimoPedido: '2024-01-20' },
    { name: 'Body Art Professional', pedidos: 12, total: 3890.00, ultimoPedido: '2024-01-19' },
    { name: 'Piercer Pro Studio', pedidos: 10, total: 3200.00, ultimoPedido: '2024-01-18' },
    { name: 'Arte Corporal Ltda', pedidos: 8, total: 2750.00, ultimoPedido: '2024-01-17' },
    { name: 'ModBody Studio', pedidos: 7, total: 2100.00, ultimoPedido: '2024-01-16' }
  ];

  const COLORS = ['#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB'];

  const exportReport = (type: string) => {
    console.log(`Exportando relatório: ${type}`);
    // Aqui implementaríamos a exportação
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Relatórios e Analytics</h1>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48 bg-white text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="90days">Últimos 90 dias</SelectItem>
                  <SelectItem value="year">Este ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => exportReport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold">R$ 127.450</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                  <p className="text-2xl font-bold">284</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+8.2%</span>
                  </div>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                  <p className="text-2xl font-bold">47</p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-sm text-red-600">-2.1%</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold">R$ 448</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+4.7%</span>
                  </div>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'vendas' ? `R$ ${value}` : value,
                      name === 'vendas' ? 'Vendas' : 'Pedidos'
                    ]}
                  />
                  <Line type="monotone" dataKey="vendas" stroke="#000000" strokeWidth={2} />
                  <Line type="monotone" dataKey="pedidos" stroke="#6B7280" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance por Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendas por Mês */}
          <Card>
            <CardHeader>
              <CardTitle>Vendas Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Vendas']} />
                  <Bar dataKey="vendas" fill="#000000" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Principais Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">
                            Último: {new Date(customer.ultimoPedido).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {customer.pedidos}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        R$ {customer.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Produtos Mais Vendidos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade Vendida</TableHead>
                  <TableHead>% do Total</TableHead>
                  <TableHead>Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productPerformance.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.vendas}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-black h-2 rounded-full" 
                            style={{ width: `${product.value}%` }}
                          ></div>
                        </div>
                        {product.value}%
                      </div>
                    </TableCell>
                    <TableCell>R$ {(product.vendas * 65).toFixed(2)}</TableCell>
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

export default SupplierReports;
