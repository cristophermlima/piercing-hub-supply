
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2 } from 'lucide-react';

const Registration = () => {
  const [userType, setUserType] = useState<'piercer' | 'supplier' | null>(null);

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">PiercerHub</h1>
            <p className="text-gray-600 mt-2">Escolha como deseja se cadastrar</p>
          </div>
          
          <div className="space-y-4">
            <Card 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setUserType('piercer')}
            >
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Sou Body Piercer</h3>
                  <p className="text-sm text-gray-600">Quero comprar produtos e insumos</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setUserType('supplier')}
            >
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Sou Fornecedor</h3>
                  <p className="text-sm text-gray-600">Quero vender meus produtos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            Cadastro para {userType === 'piercer' ? 'Body Piercer' : 'Fornecedor'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" placeholder="Seu nome completo" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />
          </div>
          
          {userType === 'supplier' && (
            <div className="space-y-2">
              <Label htmlFor="fantasyName">Nome Fantasia</Label>
              <Input id="fantasyName" placeholder="Nome da sua empresa" />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" placeholder="00.000.000/0000-00" />
          </div>
          
          {userType === 'supplier' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="contact">Contato Comercial</Label>
                <Input id="contact" placeholder="WhatsApp ou telefone comercial" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço da Empresa</Label>
                <Input id="address" placeholder="Endereço completo" />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="certificate">
              {userType === 'piercer' ? 'Certificado de Body Piercer' : 'Certificado da Empresa'}
            </Label>
            <Input id="certificate" type="file" accept=".pdf,.jpg,.png" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="Crie uma senha segura" />
          </div>
          
          <Button className="w-full bg-black hover:bg-gray-800">
            Cadastrar
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setUserType(null)}
          >
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registration;
