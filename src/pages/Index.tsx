
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Users, Shield, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo.png';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Se o usuário está logado, redireciona para a página apropriada
  React.useEffect(() => {
    if (user) {
      // Por enquanto redirecionamos para o marketplace
      // Futuramente podemos verificar o tipo de usuário e redirecionar apropriadamente
      navigate('/marketplace');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="PiercerHub Logo" className="h-12 w-auto" />
              <span className="text-lg text-primary font-semibold">Marketplace</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                Cadastrar
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-6">
            O Marketplace do <span className="text-gray-300">Body Piercing</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Conectamos profissionais certificados com os melhores fornecedores de joias, insumos e equipamentos para body piercing
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-primary text-white hover:bg-primary/90 px-8 py-3 text-lg"
            >
              Começar Agora
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/marketplace')}
              className="border-white text-white hover:bg-white hover:text-black bg-transparent px-8 py-3 text-lg"
            >
              Ver Catálogo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">
            Por que escolher o PiercerHub?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Profissionais Verificados</h4>
                <p className="text-gray-600">Apenas piercers certificados e fornecedores autorizados</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Produtos Especializados</h4>
                <p className="text-gray-600">Joias, insumos e equipamentos específicos para body piercing</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Compra Unificada</h4>
                <p className="text-gray-600">Compre de múltiplos fornecedores em uma única transação</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Comunidade</h4>
                <p className="text-gray-600">Conecte-se com outros profissionais do setor</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Pronto para começar?</h3>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se à maior plataforma de body piercing do Brasil
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Sou Body Piercer
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              Sou Fornecedor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h4 className="text-xl font-bold mb-2">PiercerHub Marketplace</h4>
          <p className="text-gray-400">Conectando profissionais do body piercing</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>© 2024 PiercerHub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
