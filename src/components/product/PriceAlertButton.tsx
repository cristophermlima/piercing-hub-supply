import React, { useState } from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useProductPriceAlert, useCreatePriceAlert, useDeletePriceAlert } from '@/hooks/usePriceAlerts';
import { useNavigate } from 'react-router-dom';

interface PriceAlertButtonProps {
  productId: string;
  currentPrice: number;
}

export const PriceAlertButton: React.FC<PriceAlertButtonProps> = ({
  productId,
  currentPrice,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: existingAlert, isLoading } = useProductPriceAlert(productId);
  const createAlert = useCreatePriceAlert();
  const deleteAlert = useDeletePriceAlert();
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(Math.floor(currentPrice * 0.9).toString());

  const handleCreate = () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) return;

    createAlert.mutate(
      {
        productId,
        targetPrice: price,
        originalPrice: currentPrice,
      },
      {
        onSuccess: () => setIsOpen(false),
      }
    );
  };

  const handleRemove = () => {
    if (existingAlert) {
      deleteAlert.mutate(existingAlert.id);
    }
  };

  if (isLoading) return null;

  if (existingAlert) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleRemove}
        className="text-primary border-primary hover:bg-primary/10"
      >
        <BellRing className="h-4 w-4 mr-2" />
        Alerta: R$ {existingAlert.target_price.toFixed(2)}
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Alerta de Preço
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Alerta de Preço</DialogTitle>
          <DialogDescription>
            Você será notificado quando o preço atingir o valor desejado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Preço atual:</span>
            <span className="font-semibold">R$ {currentPrice.toFixed(2)}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-price">Preço desejado (R$)</Label>
            <Input
              id="target-price"
              type="number"
              step="0.01"
              min="0.01"
              max={currentPrice}
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Desconto de {((1 - parseFloat(targetPrice) / currentPrice) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={createAlert.isPending}>
            {createAlert.isPending ? 'Criando...' : 'Criar Alerta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
