import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Bell, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SupplierHeader from '@/components/SupplierHeader';
import { useStockAlerts, useLowStockProducts, useCreateStockAlert, useUpdateStockAlert, useDeleteStockAlert } from '@/hooks/useStockAlerts';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const SupplierStockAlerts = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const [supplierId, setSupplierId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [threshold, setThreshold] = useState('10');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchSupplierData = async () => {
      if (!profile?.user_id) return;
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', profile.user_id)
        .single();
      
      if (supplier) {
        setSupplierId(supplier.id);
        
        // Fetch products without alerts
        const { data: supplierProducts } = await supabase
          .from('products')
          .select('id, name, stock_quantity')
          .eq('supplier_id', supplier.id)
          .eq('is_active', true);
        
        setProducts(supplierProducts || []);
      }
    };
    fetchSupplierData();
  }, [profile]);

  const { data: stockAlerts = [], isLoading } = useStockAlerts(supplierId);
  const { data: lowStockProducts = [] } = useLowStockProducts(supplierId);
  const createAlert = useCreateStockAlert();
  const updateAlert = useUpdateStockAlert();
  const deleteAlert = useDeleteStockAlert();

  // Filter products that don't have alerts yet
  const productsWithoutAlerts = products.filter(
    p => !stockAlerts.some(a => a.product_id === p.id)
  );

  const handleCreateAlert = () => {
    if (!selectedProduct || !threshold) return;

    createAlert.mutate(
      {
        supplierId,
        productId: selectedProduct,
        threshold: parseInt(threshold),
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setSelectedProduct('');
          setThreshold('10');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SupplierHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/supplier/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Alertas de Estoque</h1>
        </div>

        {/* Low Stock Alert Banner */}
        {lowStockProducts.length > 0 && (
          <Card className="mb-6 border-yellow-500 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    {lowStockProducts.length} produto(s) com estoque baixo!
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Verifique os produtos abaixo e reponha o estoque.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Low Stock Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Produtos com Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum produto com estoque baixo.
                </p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg"
                    >
                      {alert.products?.image_urls?.[0] && (
                        <img
                          src={alert.products.image_urls[0]}
                          alt={alert.products.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{alert.products?.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">
                            Estoque: {alert.products?.stock_quantity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Limite: {alert.threshold}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configured Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alertas Configurados
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" disabled={productsWithoutAlerts.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Alerta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configurar Alerta de Estoque</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Produto</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {productsWithoutAlerts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} (Estoque: {product.stock_quantity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Limite de Estoque</Label>
                      <Input
                        type="number"
                        min="1"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Você será alertado quando o estoque atingir este limite.
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleCreateAlert}
                      disabled={!selectedProduct || createAlert.isPending}
                    >
                      {createAlert.isPending ? 'Criando...' : 'Criar Alerta'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Carregando...</div>
              ) : stockAlerts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum alerta configurado.
                </p>
              ) : (
                <div className="space-y-3">
                  {stockAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className={`h-5 w-5 ${alert.is_active ? 'text-primary' : 'text-gray-400'}`} />
                        <div>
                          <p className="font-medium">{alert.products?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Limite: {alert.threshold} unidades
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={alert.is_active}
                          onCheckedChange={(checked) =>
                            updateAlert.mutate({ id: alert.id, isActive: checked })
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAlert.mutate(alert.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierStockAlerts;
