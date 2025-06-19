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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAddProduct } from '@/hooks/useProducts';

// Mapeamento das categorias para UUIDs (você pode ajustar esses UUIDs conforme sua base de dados)
const CATEGORY_MAPPING = {
  'joias-titanio': '550e8400-e29b-41d4-a716-446655440001', // UUID exemplo para joias de titânio
  'joias-ouro': '550e8400-e29b-41d4-a716-446655440002'     // UUID exemplo para joias de ouro
};

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
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreviewData, setCsvPreviewData] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();
  const addProduct = useAddProduct();

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

  const downloadCsvTemplate = () => {
    const csvTemplate = `name,description,technical_description,price,stock_quantity,sku,brand,material,color,category,jewelry_type,size_mm,thickness_mm,length_mm,diameter_mm,region,image_urls
Labret Titânio Premium,Labret em titânio G23 com rosca interna,Titânio G23 ASTM F136 com acabamento polido,89.90,150,LAB-TIT-8MM,Premium Line,Titânio,Natural,joias-titanio,labret,8,1.2,8,,Nacional,https://exemplo.com/imagem1.jpg
Argola Ouro 18k,Argola em ouro 18k com fechamento segmento,Ouro 18k maciço com polimento espelhado,450.00,25,ARG-OU18-6MM,Gold Line,Ouro 18k,Dourado,joias-ouro,argola-segmento,6,1.2,6,10,Sul,https://exemplo.com/imagem2.jpg`;
    
    const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-produtos-piercerhub.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      parseCsvFile(file);
    }
  };

  const parseCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        });
      
      setCsvPreviewData(data);
    };
    reader.readAsText(file);
  };

  const handleCsvImport = async () => {
    if (!csvPreviewData.length) {
      toast({
        title: "Erro",
        description: "Nenhum dado para importar",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const row of csvPreviewData) {
      try {
        // Mapear categoria para UUID correto
        const categoryKey = row.category as keyof typeof CATEGORY_MAPPING;
        const categoryId = CATEGORY_MAPPING[categoryKey] || CATEGORY_MAPPING['joias-titanio'];

        const productData = {
          name: row.name,
          description: row.description,
          technical_description: row.technical_description || '',
          price: parseFloat(row.price) || 0,
          stock_quantity: parseInt(row.stock_quantity) || 0,
          sku: row.sku,
          brand: row.brand,
          material: row.material,
          color: row.color,
          size: `${row.size_mm}mm`,
          region: row.region,
          availability: 'in_stock' as const,
          image_urls: row.image_urls ? row.image_urls.split(';') : [],
          supplier_id: '', // Será preenchido pelo hook
          category_id: categoryId, // Usar UUID mapeado
          is_active: true
        };

        await addProduct.mutateAsync(productData);
        successCount++;
      } catch (error) {
        console.error('Erro ao importar produto:', row.name, error);
        errorCount++;
      }
    }

    setImporting(false);
    
    if (successCount > 0) {
      toast({
        title: "Importação concluída!",
        description: `${successCount} produtos importados com sucesso. ${errorCount > 0 ? `${errorCount} produtos falharam.` : ''}`,
      });
      onSuccess();
      onClose();
    } else {
      toast({
        title: "Erro na importação",
        description: "Nenhum produto foi importado com sucesso",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      console.log('🚀 [FORM SUBMIT] Dados do formulário:', data);
      
      // Mapear categoria para UUID correto
      const categoryKey = data.category as keyof typeof CATEGORY_MAPPING;
      const categoryId = CATEGORY_MAPPING[categoryKey] || CATEGORY_MAPPING['joias-titanio'];
      
      console.log('🏷️ [FORM SUBMIT] Categoria mapeada:', { categoryKey, categoryId });

      const productData = {
        name: data.name,
        description: data.description,
        technical_description: data.technical_description || '',
        price: data.price,
        stock_quantity: data.stock_quantity,
        sku: data.sku,
        brand: data.brand,
        material: data.material,
        color: data.color,
        size: `${data.size_mm}mm`,
        region: data.region,
        availability: 'in_stock' as const,
        image_urls: imageUrls,
        supplier_id: '', // Será preenchido pelo hook
        category_id: categoryId, // Usar UUID mapeado ao invés da string
        is_active: true
      };

      console.log('📦 [FORM SUBMIT] Dados finais para envio:', productData);

      await addProduct.mutateAsync(productData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('❌ [FORM SUBMIT] Erro ao adicionar produto:', error);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Adicionar Produtos
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Produto Individual</TabsTrigger>
            <TabsTrigger value="csv">Importar CSV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="space-y-6">
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
                  <Button type="submit" disabled={addProduct.isPending}>
                    {addProduct.isPending ? 'Adicionando...' : 'Adicionar Produto'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="csv" className="space-y-6">
            {/* Instruções */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Importação em Lote via CSV</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Baixe o template CSV abaixo</li>
                    <li>• Preencha com os dados dos seus produtos</li>
                    <li>• Para múltiplas imagens, separe as URLs com ponto e vírgula (;)</li>
                    <li>• Faça o upload do arquivo preenchido</li>
                    <li>• Visualize e confirme antes de importar</li>
                  </ul>
                </div>

                <Button onClick={downloadCsvTemplate} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template CSV
                </Button>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle>Enviar Arquivo CSV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Arraste seu arquivo CSV aqui</p>
                    <p className="text-gray-600">ou clique para selecionar</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvFileChange}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload">
                      <Button variant="outline" className="mt-4" asChild>
                        <span>Selecionar Arquivo</span>
                      </Button>
                    </label>
                  </div>
                </div>

                {csvFile && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">{csvFile.name}</span>
                      <Badge variant="secondary">{(csvFile.size / 1024).toFixed(1)} KB</Badge>
                    </div>
                    <Button 
                      onClick={() => {setCsvFile(null); setCsvPreviewData([]);}}
                      variant="ghost" 
                      size="sm"
                    >
                      Remover
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            {csvPreviewData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pré-visualização dos Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4 flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 font-medium">Revise os dados antes de confirmar</p>
                      <p className="text-yellow-700 text-sm">Verifique se todas as informações estão corretas. Após a confirmação, os produtos serão adicionados ao seu catálogo.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Nome</th>
                          <th className="text-left p-2">Preço</th>
                          <th className="text-left p-2">Material</th>
                          <th className="text-left p-2">Estoque</th>
                          <th className="text-left p-2">SKU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreviewData.slice(0, 5).map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-medium">{item.name}</td>
                            <td className="p-2">R$ {parseFloat(item.price || 0).toFixed(2)}</td>
                            <td className="p-2">{item.material}</td>
                            <td className="p-2">{item.stock_quantity}</td>
                            <td className="p-2 text-gray-600">{item.sku}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {csvPreviewData.length > 5 && (
                      <p className="text-sm text-gray-500 mt-2">
                        ... e mais {csvPreviewData.length - 5} produtos
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <p className="text-gray-600">
                      {csvPreviewData.length} produto{csvPreviewData.length !== 1 ? 's' : ''} encontrado{csvPreviewData.length !== 1 ? 's' : ''}
                    </p>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => {setCsvFile(null); setCsvPreviewData([]);}}>
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleCsvImport}
                        disabled={importing}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {importing ? 'Importando...' : 'Confirmar e Importar'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
