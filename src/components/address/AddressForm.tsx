import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserAddress, useAddAddress, useUpdateAddress } from '@/hooks/useAddresses';

interface AddressFormProps {
  address?: UserAddress;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onSuccess,
  onCancel,
}) => {
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const isEditing = !!address;

  const [formData, setFormData] = useState({
    label: address?.label || 'Casa',
    recipient_name: address?.recipient_name || '',
    street: address?.street || '',
    number: address?.number || '',
    complement: address?.complement || '',
    neighborhood: address?.neighborhood || '',
    city: address?.city || '',
    state: address?.state || '',
    zip_code: address?.zip_code || '',
    is_default: address?.is_default || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      updateAddress.mutate(
        { id: address.id, ...formData },
        { onSuccess }
      );
    } else {
      addAddress.mutate(formData, { onSuccess });
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="label">Identificação</Label>
          <Input
            id="label"
            placeholder="Ex: Casa, Trabalho"
            value={formData.label}
            onChange={(e) => handleChange('label', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipient_name">Nome do Destinatário</Label>
          <Input
            id="recipient_name"
            placeholder="Nome completo"
            value={formData.recipient_name}
            onChange={(e) => handleChange('recipient_name', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zip_code">CEP</Label>
          <Input
            id="zip_code"
            placeholder="00000-000"
            value={formData.zip_code}
            onChange={(e) => {
              handleChange('zip_code', e.target.value);
              if (e.target.value.replace(/\D/g, '').length === 8) {
                fetchAddressByCep(e.target.value);
              }
            }}
            required
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            placeholder="Nome da rua"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            placeholder="123"
            value={formData.number}
            onChange={(e) => handleChange('number', e.target.value)}
            required
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            placeholder="Apto, Bloco, etc."
            value={formData.complement}
            onChange={(e) => handleChange('complement', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            placeholder="Bairro"
            value={formData.neighborhood}
            onChange={(e) => handleChange('neighborhood', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            placeholder="Cidade"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            placeholder="UF"
            maxLength={2}
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_default"
          checked={formData.is_default}
          onCheckedChange={(checked) => handleChange('is_default', !!checked)}
        />
        <Label htmlFor="is_default" className="text-sm">
          Definir como endereço padrão
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={addAddress.isPending || updateAddress.isPending}
        >
          {addAddress.isPending || updateAddress.isPending
            ? 'Salvando...'
            : isEditing
            ? 'Atualizar'
            : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
};
