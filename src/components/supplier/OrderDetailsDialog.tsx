import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Package, Phone, Mail, MapPin, Edit2, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrderDetailsDialogProps {
  order: any;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onUpdateTracking: (orderId: string, trackingCode: string) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const OrderDetailsDialog = ({
  order,
  open,
  onClose,
  onUpdateStatus,
  onUpdateTracking,
  getStatusColor,
  getStatusLabel
}: OrderDetailsDialogProps) => {
  const [newStatus, setNewStatus] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Customer info state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  // Address state
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Sincronizar estado com dados do pedido
  React.useEffect(() => {
    if (order) {
      const itemStatus = order?.items?.[0]?.status;
      if (itemStatus) {
        setNewStatus(itemStatus);
      }
      
      // Initialize customer info
      setCustomerName(order.customerName || '');
      setCustomerPhone(order.customerPhone || '');
      setCustomerEmail(order.customerEmail || '');
      
      // Initialize address
      if (order.shippingAddress) {
        setStreet(order.shippingAddress.street || '');
        setNumber(order.shippingAddress.number || '');
        setComplement(order.shippingAddress.complement || '');
        setNeighborhood(order.shippingAddress.neighborhood || '');
        setCity(order.shippingAddress.city || '');
        setState(order.shippingAddress.state || '');
        setZipCode(order.shippingAddress.zip_code || order.shippingAddress.zipCode || '');
      }
    }
  }, [order]);

  if (!order) return null;

  const handleStatusUpdate = () => {
    const currentStatus = order.items?.[0]?.status;
    if (newStatus && newStatus !== currentStatus) {
      onUpdateStatus(order.id, newStatus);
    }
  };

  const handleTrackingUpdate = () => {
    if (trackingCode.trim()) {
      onUpdateTracking(order.id, trackingCode);
      setTrackingCode('');
    }
  };

  const handleSaveCustomerInfo = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail
        })
        .eq('id', order.id);

      if (error) throw error;
      
      toast.success('Informações do cliente atualizadas!');
      setIsEditingCustomer(false);
      // Update local order state
      order.customerName = customerName;
      order.customerPhone = customerPhone;
      order.customerEmail = customerEmail;
    } catch (error) {
      console.error('Erro ao atualizar informações:', error);
      toast.error('Erro ao atualizar informações do cliente');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    setIsSaving(true);
    try {
      const newAddress = JSON.stringify({
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zip_code: zipCode
      });

      const { error } = await supabase
        .from('orders')
        .update({ shipping_address: newAddress })
        .eq('id', order.id);

      if (error) throw error;
      
      toast.success('Endereço atualizado!');
      setIsEditingAddress(false);
      // Update local order state
      order.shippingAddress = {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zip_code: zipCode
      };
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error);
      toast.error('Erro ao atualizar endereço');
    } finally {
      setIsSaving(false);
    }
  };

  const hasCustomerInfo = order.customerName || order.customerPhone || order.customerEmail;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Pedido #{order.orderNumber}</span>
            <Badge className={getStatusColor(order.items?.[0]?.status || order.status)}>
              {getStatusLabel(order.items?.[0]?.status || order.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Informações do Cliente
              </h3>
              {!isEditingCustomer ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingCustomer(true)}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingCustomer(false)} disabled={isSaving}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleSaveCustomerInfo} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                </div>
              )}
            </div>
            
            {isEditingCustomer ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>E-mail</Label>
                  <Input
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    type="email"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {!hasCustomerInfo && (
                  <p className="text-muted-foreground italic col-span-2">
                    Nenhuma informação do cliente cadastrada. Clique em "Editar" para adicionar.
                  </p>
                )}
                {order.customerName && (
                  <div>
                    <p className="text-muted-foreground">Nome</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                )}
                {order.customerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`https://wa.me/55${order.customerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline font-medium"
                    >
                      {order.customerPhone}
                    </a>
                  </div>
                )}
                {order.customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${order.customerEmail}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {order.customerEmail}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Endereço de Entrega */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço de Entrega
              </h3>
              {!isEditingAddress ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingAddress(true)}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingAddress(false)} disabled={isSaving}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleSaveAddress} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                </div>
              )}
            </div>
            
            {isEditingAddress ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>Rua</Label>
                  <Input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Nome da rua"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Número"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Complemento</Label>
                  <Input
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Apto, bloco, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bairro"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm space-y-1">
                <p>{order.shippingAddress.street}, {order.shippingAddress.number}</p>
                {order.shippingAddress.complement && <p>{order.shippingAddress.complement}</p>}
                <p>{order.shippingAddress.neighborhood}</p>
                <p>{order.shippingAddress.city} - {order.shippingAddress.state}</p>
                <p>CEP: {order.shippingAddress.zip_code || order.shippingAddress.zipCode}</p>
              </div>
            )}
          </div>

          {/* Itens do Pedido */}
          <div>
            <h3 className="font-semibold mb-3">Itens do Pedido</h3>
            <div className="space-y-2">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.sku && <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>}
                      <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gerenciar Status */}
          <div className="space-y-3">
            <Label htmlFor="status">Atualizar Status</Label>
            <div className="flex gap-2">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="processing">Em Processamento</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleStatusUpdate}
                disabled={!newStatus || newStatus === order.status}
              >
                Atualizar
              </Button>
            </div>
          </div>

          {/* Código de Rastreamento */}
          <div className="space-y-3">
            <Label htmlFor="tracking">Código de Rastreamento</Label>
            <div className="flex gap-2">
              <Input
                id="tracking"
                placeholder="Ex: BR123456789BR"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
              />
              <Button 
                onClick={handleTrackingUpdate}
                disabled={!trackingCode.trim()}
              >
                Adicionar
              </Button>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-3">
            <Label htmlFor="notes">Observações Internas</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observações sobre este pedido..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Data do Pedido: {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
              <div className="text-lg font-bold">
                Total: R$ {order.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
