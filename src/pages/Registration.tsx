
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Registration = () => {
  const [userType, setUserType] = useState<'piercer' | 'supplier' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      full_name: formData.get('full_name') as string,
      user_type: userType,
      cnpj: formData.get('cnpj') as string,
      fantasy_name: formData.get('fantasy_name') as string,
      commercial_contact: formData.get('commercial_contact') as string,
      company_address: formData.get('company_address') as string,
    };

    await signUp(
      formData.get('email') as string,
      formData.get('password') as string,
      userData
    );

    setIsLoading(false);
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/')} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold">PiercerHub</h1>
              <p className="text-gray-600 mt-2">Escolha como deseja se cadastrar</p>
            </div>
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

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <button
                  onClick={() => navigate('/auth')}
                  className="text-black font-semibold hover:underline"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => setUserType(null)} className="mr-2 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-center flex-1">
              Cadastro para {userType === 'piercer' ? 'Body Piercer' : 'Fornecedor'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input id="full_name" name="full_name" placeholder="Seu nome completo" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Telefone</Label>
              <Input id="phone_number" name="phone_number" placeholder="(00) 00000-0000" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf_cnpj">{userType === 'piercer' ? 'CPF' : 'CNPJ'}</Label>
              <Input 
                id="cpf_cnpj" 
                name="cpf_cnpj" 
                placeholder={userType === 'piercer' ? '000.000.000-00' : '00.000.000/0000-00'} 
                required 
              />
            </div>
            
            {userType === 'supplier' && (
              <div className="space-y-2">
                <Label htmlFor="fantasy_name">Nome Fantasia</Label>
                <Input id="fantasy_name" name="fantasy_name" placeholder="Nome da sua empresa" />
              </div>
            )}
            
            {userType === 'supplier' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="commercial_contact">Contato Comercial</Label>
                  <Input id="commercial_contact" name="commercial_contact" placeholder="WhatsApp ou telefone comercial" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company_address">Endereço da Empresa</Label>
                  <Input id="company_address" name="company_address" placeholder="Endereço completo" />
                </div>
              </>
            )}
            
            {userType === 'piercer' && (
              <div className="space-y-2">
                <Label htmlFor="certificate">
                  Certificado de Body Piercer *
                  <span className="text-xs text-muted-foreground block mt-1">
                    Obrigatório para liberação de compras
                  </span>
                </Label>
                <Input 
                  id="certificate" 
                  name="certificate" 
                  type="file" 
                  accept=".pdf,.jpg,.png,.jpeg" 
                  required 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" placeholder="Crie uma senha segura" required />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/auth')}
                  className="text-black font-semibold hover:underline"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registration;
