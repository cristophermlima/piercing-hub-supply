
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  technical_description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser positivo'),
  stock_quantity: z.number().min(0, 'Estoque deve ser positivo'),
  sku: z.string().min(1, 'SKU é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  material: z.enum(['Titânio', 'Ouro 18k', 'Ouro 14k', 'Aço Cirúrgico']),
  color: z.string().min(1, 'Cor é obrigatória'),
  category: z.enum(['joias-titanio', 'joias-ouro']),
  jewelry_type: z.enum(['labret', 'argola-segmento', 'argola-torcao', 'argola-captive', 'barbell', 'plugs']),
  size_mm: z.number().min(1, 'Tamanho é obrigatório'),
  thickness_mm: z.number().optional(),
  length_mm: z.number().optional(),
  diameter_mm: z.number().optional(),
  region: z.string().min(1, 'Região é obrigatória')
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onClose, onSuccess }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: 0,
      stock_quantity: 0,
      size_mm: 8,
      thickness_mm: 1.2,
      length_mm: 8,
      color: 'Natural',
      region: 'Nacional'
    }
  });

  const watchJewelryType = form.watch('jewelry_type');
  const watchMaterial = form.watch('material');

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      console.log('Dados do produto:', { ...data, image_urls: imageUrls });
      
      toast({
        title: "Produto adicionado!",
        description: "Produto foi adicionado ao catálogo com sucesso.",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao adicionar produto",
        description: "Ocorreu um erro ao adicionar o produto.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Adicionar Novo Produto
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Labret Titânio Premium" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descrição do produto..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technical_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição Técnica (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Especificações técnicas..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: LAB-TIT-8MM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Premium Line" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Especificações da Joia */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Especificações da Joia</h3>
                
                <FormField
                  control={form.control}
                  name="jewelry_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Joia</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="labret">Labret</SelectItem>
                          <SelectItem value="argola-segmento">Argola Segmento</SelectItem>
                          <SelectItem value="argola-torcao">Argola Torção</SelectItem>
                          <SelectItem value="argola-captive">Argola Captive</SelectItem>
                          <SelectItem value="barbell">Barbell</SelectItem>
                          <SelectItem value="plugs">Plugs</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o material" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Titânio">Titânio</SelectItem>
                          <SelectItem value="Ouro 18k">Ouro 18k</SelectItem>
                          <SelectItem value="Ouro 14k">Ouro 14k</SelectItem>
                          <SelectItem value="Aço Cirúrgico">Aço Cirúrgico</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={watchMaterial?.includes('Ouro') ? 'joias-ouro' : 'joias-titanio'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="joias-titanio">Joias Titânio</SelectItem>
                          <SelectItem value="joias-ouro">Joias Ouro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Natural, Dourado, Preto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Região</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Nacional, Sudeste" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Medidas */}
                <h4 className="text-md font-medium mt-4">Medidas</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="size_mm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamanho (mm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thickness_mm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Espessura (mm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="length_mm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comprimento (mm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(watchJewelryType?.includes('argola')) && (
                    <FormField
                      control={form.control}
                      name="diameter_mm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diâmetro (mm)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Imagens */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Imagens do Produto</h3>
              
              <div className="flex gap-2">
                <Input 
                  placeholder="URL da imagem"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button type="button" onClick={addImageUrl}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      Imagem {index + 1}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-red-500 hover:text-red-700"
                        onClick={() => removeImageUrl(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Adicionar Produto
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
