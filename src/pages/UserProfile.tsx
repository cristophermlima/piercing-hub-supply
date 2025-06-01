
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Edit2, Save, X, Phone, Mail, MapPin, Building2, Shield } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UserProfile = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { data: profile, refetch } = useProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    fantasy_name: profile?.fantasy_name || '',
    cnpj: profile?.cnpj || '',
    commercial_contact: profile?.commercial_contact || '',
    company_address: profile?.company_address || ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        fantasy_name: profile.fantasy_name || '',
        cnpj: profile.cnpj || '',
        commercial_contact: profile.commercial_contact || '',
        company_address: profile.company_address || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;

      await refetch();
      setIsEditing(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao salvar suas informações.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      email: profile?.email || '',
      fantasy_name: profile?.fantasy_name || '',
      cnpj: profile?.cnpj || '',
      commercial_contact: profile?.commercial_contact || '',
      company_address: profile?.company_address || ''
    });
    setIsEditing(false);
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'piercer':
        return 'Body Piercer';
      case 'supplier':
        return 'Fornecedor';
      default:
        return userType;
    }
  };

  const getApprovalStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItems={0}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-gray-600" />
              <h1 className="text-3xl font-bold">Meu Perfil</h1>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Status da Conta</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Tipo de Usuário</Label>
                  <p className="font-semibold">{getUserTypeLabel(profile?.user_type || '')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status de Aprovação</Label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getApprovalStatusColor(profile?.approval_status || 'pending')}`}>
                    {getApprovalStatusLabel(profile?.approval_status || 'pending')}
                  </span>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Membro desde</Label>
                  <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="lg:col-span-2">
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
                    {isEditing ? (
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile?.full_name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile?.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cnpj" className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>CNPJ</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile?.cnpj}</p>
                    )}
                  </div>

                  {profile?.user_type === 'supplier' && (
                    <div>
                      <Label htmlFor="fantasy_name">Nome Fantasia</Label>
                      {isEditing ? (
                        <Input
                          id="fantasy_name"
                          value={formData.fantasy_name}
                          onChange={(e) => setFormData({...formData, fantasy_name: e.target.value})}
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{profile?.fantasy_name}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="commercial_contact" className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>Contato Comercial</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        id="commercial_contact"
                        value={formData.commercial_contact}
                        onChange={(e) => setFormData({...formData, commercial_contact: e.target.value})}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile?.commercial_contact}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="company_address" className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Endereço da Empresa</span>
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="company_address"
                      value={formData.company_address}
                      onChange={(e) => setFormData({...formData, company_address: e.target.value})}
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile?.company_address}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ações da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" asChild>
                  <a href="/marketplace">Ir para Marketplace</a>
                </Button>
                {profile?.user_type === 'supplier' && (
                  <Button variant="outline" asChild>
                    <a href="/dashboard">Painel do Fornecedor</a>
                  </Button>
                )}
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Atualizar Página
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
