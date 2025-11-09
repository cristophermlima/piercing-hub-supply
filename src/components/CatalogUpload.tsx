
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CatalogUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Simulação de preview dos dados
      setPreviewData([
        {
          nome: 'Argola Titânio 8mm',
          descricao: 'Argola em titânio G23 com fechamento segmento',
          preco: 89.90,
          categoria: 'joias-titanio',
          tipo: 'argola',
          marca: 'Premium Line',
          tamanho: '8mm',
          estoque: 150,
          material: 'Titânio',
          cor: 'Natural',
          sku: 'PL-ARG008'
        },
        {
          nome: 'Labret Ouro 18k',
          descricao: 'Labret em ouro 18k com rosca interna',
          preco: 450.00,
          categoria: 'joias-ouro',
          tipo: 'labret',
          marca: 'Gold Line',
          tamanho: '6mm',
          estoque: 25,
          material: 'Ouro 18k',
          cor: 'Dourado',
          sku: 'GL-LAB006'
        }
      ]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simular upload
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Catálogo enviado com sucesso!",
        description: `${previewData.length} produtos foram adicionados ao seu catálogo.`,
      });
      setFile(null);
      setPreviewData([]);
    }, 2000);
  };

  const downloadTemplate = () => {
    const csvTemplate = `nome,descricao,descricao_tecnica,preco,estoque,disponibilidade,sku,marca,material,cor,tamanho,regiao,categoria_id,url_imagem_1,url_imagem_2,url_imagem_3
Argola Titânio 8mm,Argola em titânio G23 com fechamento segmento,Titânio G23 ASTM F136 com acabamento polido,89.90,150,in_stock,PL-ARG008,Premium Line,Titânio,Natural,8,Sudeste,e5f8a9c2-1234-5678-9abc-def012345678,https://exemplo.com/foto1.jpg,,
Labret Ouro 18k,Labret em ouro 18k com rosca interna,Ouro 18k maciço com polimento espelhado,450.00,25,in_stock,GL-LAB006,Gold Line,Ouro 18k,Dourado,6,Sul,38731d7e-0c10-4c37-ab68-762c769d71a7,https://exemplo.com/foto2.jpg,,

INSTRUÇÕES:
- categoria_id: Use "38731d7e-0c10-4c37-ab68-762c769d71a7" para Joias Ouro ou "e5f8a9c2-1234-5678-9abc-def012345678" para Joias Titânio
- disponibilidade: Use "in_stock" (em estoque) ou "out_of_stock" (sem estoque)
- preco: Apenas números com ponto decimal (ex: 89.90)
- estoque: Apenas números inteiros
- url_imagem_1, url_imagem_2, url_imagem_3: URLs completas das imagens (opcional)`;
    
    const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-produtos-piercerhub.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Upload de Catálogo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Baixe o template CSV abaixo</li>
              <li>• Preencha com os dados dos seus produtos</li>
              <li>• Adicione as fotos em uma pasta compactada (.zip)</li>
              <li>• Faça o upload do arquivo CSV</li>
              <li>• Visualize e confirme antes de publicar</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Baixar Template CSV
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Baixar Guia de Fotos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Enviar Catálogo</CardTitle>
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
                onChange={handleFileChange}
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

          {file && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800">{file.name}</span>
                <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
              </div>
              <Button 
                onClick={() => {setFile(null); setPreviewData([]);}}
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
      {previewData.length > 0 && (
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
                    <th className="text-left p-2">Categoria</th>
                    <th className="text-left p-2">Preço</th>
                    <th className="text-left p-2">Material</th>
                    <th className="text-left p-2">Estoque</th>
                    <th className="text-left p-2">SKU</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{item.nome}</td>
                      <td className="p-2">
                        <Badge variant="secondary">{item.categoria}</Badge>
                      </td>
                      <td className="p-2">R$ {item.preco.toFixed(2)}</td>
                      <td className="p-2">{item.material}</td>
                      <td className="p-2">{item.estoque}</td>
                      <td className="p-2 text-gray-600">{item.sku}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <p className="text-gray-600">
                {previewData.length} produto{previewData.length !== 1 ? 's' : ''} encontrado{previewData.length !== 1 ? 's' : ''}
              </p>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => {setFile(null); setPreviewData([]);}}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-black hover:bg-gray-800"
                >
                  {uploading ? 'Enviando...' : 'Confirmar e Publicar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CatalogUpload;
