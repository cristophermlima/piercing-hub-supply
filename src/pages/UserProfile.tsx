
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { items: cartItems = [] } = useCart();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600">Você precisa estar logado para ver seu perfil.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Carregando perfil...</div>
      </div>
    );
  }

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {profile?.full_name || 'Usuário'}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Informações do Usuário */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome Completo</Label>
                <Input value={profile?.full_name || ''} disabled={!isEditing} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user.email} disabled />
              </div>
              <div>
                <Label>Tipo de Usuário</Label>
                <div className="mt-2">
                  <Badge variant={profile?.user_type === 'supplier' ? 'default' : 'secondary'}>
                    {profile?.user_type === 'supplier' ? 'Fornecedor' : 'Piercer'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Telefone</Label>
                <Input value={profile?.phone || ''} disabled={!isEditing} />
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className="w-full"
              >
                {isEditing ? 'Salvar Alterações' : 'Editar Perfil'}
              </Button>
            </CardContent>
          </Card>

          {/* Estatísticas do Carrinho */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Meu Carrinho</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {totalCartItems}
                </div>
                <p className="text-gray-600 mb-4">
                  {totalCartItems === 1 ? 'item no carrinho' : 'itens no carrinho'}
                </p>
                <Button 
                  onClick={() => navigate('/cart')}
                  className="w-full"
                  disabled={totalCartItems === 0}
                >
                  Ver Carrinho
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={() => navigate('/marketplace')}>
                Ir ao Marketplace
              </Button>
              {profile?.user_type === 'supplier' && (
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Dashboard do Fornecedor
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/cart')}>
                Ver Carrinho
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
