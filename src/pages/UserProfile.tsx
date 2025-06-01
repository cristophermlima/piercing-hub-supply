
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Building, Mail, Phone, MapPin, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: cartItems = [] } = useCart();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          searchTerm=""
          onSearchChange={() => {}}
          cartItems={0}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando perfil...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          searchTerm=""
          onSearchChange={() => {}}
          cartItems={totalItemsCount}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Perfil não encontrado</div>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
        <Clock className="h-3 w-3 mr-1" />
        Ativo
      </Badge>
    );
  };

  const getUserTypeLabel = (userType: string) => {
    return userType === 'supplier' ? 'Fornecedor' : 'Piercer';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm=""
        onSearchChange={() => {}}
        cartItems={totalItemsCount}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-500" />
                </div>
                <CardTitle className="text-xl">{profile.full_name}</CardTitle>
                <div className="flex justify-center space-x-2 mt-2">
                  <Badge variant="outline">
                    {getUserTypeLabel(profile.user_type)}
                  </Badge>
                  {getStatusBadge()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                {profile.user_type === 'supplier' && (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{profile.fantasy_name || 'Nome fantasia não informado'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{profile.commercial_contact || 'Contato não informado'}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informações Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Nome Completo</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={profile.cnpj}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user_type">Tipo de Usuário</Label>
                    <Input
                      id="user_type"
                      value={getUserTypeLabel(profile.user_type)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information (for suppliers) */}
            {profile.user_type === 'supplier' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Informações da Empresa</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fantasy_name">Nome Fantasia</Label>
                      <Input
                        id="fantasy_name"
                        value={profile.fantasy_name || ''}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="commercial_contact">Contato Comercial</Label>
                      <Input
                        id="commercial_contact"
                        value={profile.commercial_contact || ''}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company_address">Endereço da Empresa</Label>
                    <Textarea
                      id="company_address"
                      value={profile.company_address || ''}
                      readOnly
                      className="bg-gray-50"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" onClick={() => navigate('/marketplace')}>
                    Ir para Marketplace
                  </Button>
                  {profile.user_type === 'supplier' && (
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>
                      Painel do Fornecedor
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
      </div>
    </div>
  );
};

export default UserProfile;
