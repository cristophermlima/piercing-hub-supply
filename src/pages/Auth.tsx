import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { User, Building2, ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      // Check user type and redirect accordingly
      const userType = user.user_metadata?.user_type;
      console.log('User authenticated, user type:', userType);
      
      if (userType === 'supplier') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      full_name: formData.get('full_name') as string,
      user_type: formData.get('user_type') as string,
      cnpj: formData.get('cnpj') as string,
      fantasy_name: formData.get('fantasy_name') as string,
      commercial_contact: formData.get('commercial_contact') as string,
      company_address: formData.get('company_address') as string,
    };

    const result = await signUp(
      formData.get('email') as string,
      formData.get('password') as string,
      userData
    );

    setIsLoading(false);

    // Redirecionar baseado no tipo de usuário após cadastro bem-sucedido
    if (result.needsRedirect && !result.error) {
      setTimeout(() => {
        if (result.userType === 'supplier') {
          navigate('/dashboard');
        } else {
          navigate('/marketplace');
        }
      }, 1500); // Espera um pouco para mostrar a mensagem de sucesso
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn(
      formData.get('email') as string,
      formData.get('password') as string
    );

    setIsLoading(false);

    // O redirecionamento será tratado pelo useEffect quando o user for atualizado
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="mr-2 text-white hover:bg-gray-700">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-center bg-blue-600 p-3 rounded-lg">
            <img src={logo} alt="PiercerHub Logo" className="h-16 w-auto" />
            <span className="text-sm font-semibold text-white -mt-1">Marketplace</span>
          </div>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Fazer Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">E-mail</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Senha</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Sua senha"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const SignUpForm = ({ onSubmit, isLoading }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; isLoading: boolean }) => {
  const [userType, setUserType] = useState<'piercer' | 'supplier'>('piercer');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_type">Tipo de Usuário</Label>
            <Select name="user_type" value={userType} onValueChange={(value: 'piercer' | 'supplier') => setUserType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piercer">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Body Piercer
                  </div>
                </SelectItem>
                <SelectItem value="supplier">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    Fornecedor
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input id="full_name" name="full_name" placeholder="Seu nome completo" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
          </div>

          {userType === 'supplier' && (
            <div className="space-y-2">
              <Label htmlFor="fantasy_name">Nome Fantasia</Label>
              <Input id="fantasy_name" name="fantasy_name" placeholder="Nome da sua empresa" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" required />
          </div>

          {userType === 'supplier' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="commercial_contact">Contato Comercial</Label>
                <Input id="commercial_contact" name="commercial_contact" placeholder="WhatsApp ou telefone" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_address">Endereço da Empresa</Label>
                <Input id="company_address" name="company_address" placeholder="Endereço completo" />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" placeholder="Crie uma senha segura" required />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Auth;
