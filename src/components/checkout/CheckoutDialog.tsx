import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/hooks/useOrders';
import { useProfile } from '@/hooks/useProfile';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ShippingOption {
  carrier: string;
  serviceCode: string;
  serviceDescription: string;
  price: string;
  deliveryTime: string;
}

export const CheckoutDialog = ({ open, onOpenChange }: CheckoutDialogProps) => {
  const { createOrders, isCreatingOrders } = useOrders();
  const { data: profile } = useProfile();
  const { items } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    cpfCnpj: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
  });
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  // Preencher dados do perfil quando abrir o dialog
  useEffect(() => {
    if (open && profile) {
      setFormData(prev => ({
        ...prev,
        customerName: profile.full_name || '',
        customerPhone: profile.phone_number || '',
        cpfCnpj: profile.cpf_cnpj || '',
      }));
    }
  }, [open, profile]);

  const calculateShipping = async () => {
    if (!formData.zipCode || formData.zipCode.length < 8) {
      toast.error('Por favor, insira um CEP válido');
      return;
    }

    setIsLoadingShipping(true);
    try {
      const cartItems = items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price,
      }));

      const { data, error } = await supabase.functions.invoke('calculate-shipping', {
        body: {
          destinationZipCode: formData.zipCode.replace(/\D/g, ''),
          items: cartItems,
        },
      });

      if (error) throw error;

      if (data?.success && data?.options) {
        setShippingOptions(data.options);
        if (data.options.length > 0) {
          setSelectedShipping(data.options[0].serviceCode);
        }
      } else {
        toast.error('Erro ao calcular frete');
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      toast.error('Erro ao calcular frete. Tente novamente.');
    } finally {
      setIsLoadingShipping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedShipping) {
      toast.error('Por favor, selecione uma opção de frete');
      return;
    }

    const selectedOption = shippingOptions.find(opt => opt.serviceCode === selectedShipping);
    
    createOrders({
      ...formData,
      shippingMethod: selectedOption?.serviceDescription || '',
      shippingCost: selectedOption ? parseFloat(selectedOption.price) : 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finalizar Compra</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Nome Completo *</Label>
                <Input
                  id="customerName"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="customerEmail">E-mail *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="customerPhone">Telefone *</Label>
                <Input
                  id="customerPhone"
                  required
                  placeholder="(00) 00000-0000"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="cpfCnpj">CPF ou CNPJ *</Label>
                <Input
                  id="cpfCnpj"
                  required
                  placeholder="000.000.000-00"
                  value={formData.cpfCnpj}
                  onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Endereço de Entrega</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">CEP *</Label>
                <div className="flex gap-2">
                  <Input
                    id="zipCode"
                    required
                    placeholder="00000-000"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                  <Button 
                    type="button" 
                    onClick={calculateShipping}
                    disabled={isLoadingShipping}
                  >
                    {isLoadingShipping ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Calcular'}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="street">Rua *</Label>
                <Input
                  id="street"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  required
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  required
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  required
                  maxLength={2}
                  placeholder="UF"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
          </div>

          {/* Opções de Frete */}
          {shippingOptions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Escolha o Frete</h3>
              <Select value={selectedShipping} onValueChange={setSelectedShipping}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção de frete" />
                </SelectTrigger>
                <SelectContent>
                  {shippingOptions.map((option) => (
                    <SelectItem key={option.serviceCode} value={option.serviceCode}>
                      {option.serviceDescription} - R$ {parseFloat(option.price).toFixed(2)} 
                      ({option.deliveryTime} dias úteis)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Alguma observação sobre a entrega?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Importante:</strong> Seu carrinho possui produtos de diferentes fornecedores. 
              Será criado um pedido separado para cada fornecedor automaticamente.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreatingOrders || shippingOptions.length === 0}>
              {isCreatingOrders && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Finalizar Pedido
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};