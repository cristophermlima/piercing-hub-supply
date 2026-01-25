import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useValidateCoupon, Coupon } from '@/hooks/useCoupons';
import { Loader2, Tag, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CouponInputProps {
  orderTotal: number;
  onCouponApplied: (coupon: Coupon, discount: number) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: Coupon | null;
  discount?: number;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  orderTotal,
  onCouponApplied,
  onCouponRemoved,
  appliedCoupon,
  discount = 0,
}) => {
  const [code, setCode] = useState('');
  const { mutate: validateCoupon, isPending } = useValidateCoupon();

  const handleApply = () => {
    if (!code.trim()) return;

    validateCoupon(
      { code: code.trim(), orderTotal },
      {
        onSuccess: (result) => {
          onCouponApplied(result.coupon, result.discount);
          setCode('');
        },
      }
    );
  };

  const handleRemove = () => {
    onCouponRemoved();
    setCode('');
  };

  if (appliedCoupon) {
    return (
      <div className="space-y-2">
        <Label>Cupom de Desconto</Label>
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Tag className="h-3 w-3 mr-1" />
              {appliedCoupon.code}
            </Badge>
            <span className="text-sm text-green-700 dark:text-green-400">
              -R$ {discount.toFixed(2)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="coupon">Cupom de Desconto</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="coupon"
            placeholder="Digite o código"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="pl-9"
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleApply}
          disabled={!code.trim() || isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Aplicar'
          )}
        </Button>
      </div>
    </div>
  );
};
