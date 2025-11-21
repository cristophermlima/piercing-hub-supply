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
import { Package, Phone, Mail, MapPin } from 'lucide-react';

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

  // Atualizar newStatus quando order mudar
  React.useEffect(() => {
    if (order?.status) {
      setNewStatus(order.status);
    }
  }, [order?.status]);

  if (!order) return null;

  const handleStatusUpdate = () => {
    if (newStatus && newStatus !== order.status) {
      onUpdateStatus(order.id, newStatus);
    }
  };

  const handleTrackingUpdate = () => {
    if (trackingCode.trim()) {
      onUpdateTracking(order.id, trackingCode);
      setTrackingCode('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Pedido #{order.orderNumber}</span>
            <Badge className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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
          </div>

          {/* Endereço de Entrega */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Endereço de Entrega
            </h3>
            <div className="text-sm space-y-1">
              <p>{order.shippingAddress.street}, {order.shippingAddress.number}</p>
              {order.shippingAddress.complement && <p>{order.shippingAddress.complement}</p>}
              <p>{order.shippingAddress.neighborhood}</p>
              <p>{order.shippingAddress.city} - {order.shippingAddress.state}</p>
              <p>CEP: {order.shippingAddress.zip_code || order.shippingAddress.zipCode}</p>
            </div>
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
