import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  FileText, 
  LogOut,
  Eye,
  RefreshCw,
  Shield
} from 'lucide-react';
import logo from '@/assets/logo.png';

interface PendingUser {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  user_type: string;
  cpf_cnpj: string | null;
  certificate_url: string | null;
  certificate_approved: boolean | null;
  created_at: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { signOut, user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  // Fetch pending profiles
  const { data: pendingUsers, isLoading: usersLoading, refetch } = useQuery({
    queryKey: ['admin-pending-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('certificate_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PendingUser[];
    },
    enabled: isAdmin,
  });

  // Fetch all profiles
  const { data: allUsers } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PendingUser[];
    },
    enabled: isAdmin,
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ certificate_approved: true })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Usuário aprovado!',
        description: 'O usuário agora pode acessar o marketplace.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao aprovar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ certificate_approved: false })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Usuário rejeitado',
        description: 'O cadastro foi rejeitado.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao rejeitar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Loading state
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingCount = pendingUsers?.length || 0;
  const approvedCount = allUsers?.filter(u => u.certificate_approved)?.length || 0;
  const totalCount = allUsers?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="PiercerHub" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Painel Administrativo</h1>
              <p className="text-xs text-muted-foreground">Gerenciamento de usuários</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-full">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
                  <p className="text-sm text-muted-foreground">Aprovados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalCount}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pendentes ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <Users className="h-4 w-4" />
              Todos ({totalCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Cadastros Pendentes</CardTitle>
                  <CardDescription>Usuários aguardando aprovação</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : pendingUsers?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>Nenhum cadastro pendente!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers?.map((profile) => (
                      <UserCard
                        key={profile.id}
                        profile={profile}
                        onApprove={() => approveMutation.mutate(profile.user_id)}
                        onReject={() => rejectMutation.mutate(profile.user_id)}
                        onViewCertificate={() => setSelectedCertificate(profile.certificate_url)}
                        isLoading={approveMutation.isPending || rejectMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Usuários</CardTitle>
                <CardDescription>Lista completa de usuários cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allUsers?.map((profile) => (
                    <UserCard
                      key={profile.id}
                      profile={profile}
                      onApprove={() => approveMutation.mutate(profile.user_id)}
                      onReject={() => rejectMutation.mutate(profile.user_id)}
                      onViewCertificate={() => setSelectedCertificate(profile.certificate_url)}
                      isLoading={approveMutation.isPending || rejectMutation.isPending}
                      showStatus
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCertificate(null)}
        >
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Certificado</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCertificate(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              {selectedCertificate.endsWith('.pdf') ? (
                <iframe
                  src={selectedCertificate}
                  className="w-full h-[70vh]"
                  title="Certificado"
                />
              ) : (
                <img
                  src={selectedCertificate}
                  alt="Certificado"
                  className="max-w-full h-auto mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface UserCardProps {
  profile: PendingUser;
  onApprove: () => void;
  onReject: () => void;
  onViewCertificate: () => void;
  isLoading: boolean;
  showStatus?: boolean;
}

const UserCard = ({ profile, onApprove, onReject, onViewCertificate, isLoading, showStatus }: UserCardProps) => {
  const userTypeLabel = profile.user_type === 'supplier' ? 'Fornecedor' : 'Body Piercer';
  
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground">{profile.full_name || 'Nome não informado'}</h4>
            {showStatus && (
              <Badge variant={profile.certificate_approved ? 'default' : 'secondary'}>
                {profile.certificate_approved ? 'Aprovado' : 'Pendente'}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {userTypeLabel} • {profile.cpf_cnpj || 'CPF/CNPJ não informado'}
          </p>
          <p className="text-xs text-muted-foreground">
            Cadastrado em: {new Date(profile.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {profile.certificate_url && (
            <Button variant="outline" size="sm" onClick={onViewCertificate}>
              <FileText className="h-4 w-4 mr-2" />
              Ver Certificado
            </Button>
          )}
          
          {!profile.certificate_approved && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={onApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onReject}
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
