import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import logo from '@/assets/logo.png';

const PendingApproval = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { data: profile, refetch, isLoading } = useProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleRefresh = async () => {
    await refetch();
    // If approved, redirect
    if (profile?.certificate_approved) {
      const userType = user?.user_metadata?.user_type;
      if (userType === 'supplier') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    }
  };

  // If approved, redirect immediately
  React.useEffect(() => {
    if (profile?.certificate_approved) {
      const userType = user?.user_metadata?.user_type;
      if (userType === 'supplier') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    }
  }, [profile, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="PiercerHub Logo" className="h-20 w-auto" />
          <span className="text-sm font-semibold text-primary -mt-1">Marketplace</span>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
            <CardTitle className="text-white">Cadastro em Análise</CardTitle>
            <CardDescription className="text-gray-400">
              Seu cadastro foi recebido e está sendo analisado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-300">
                <strong className="text-white">Nome:</strong> {user?.user_metadata?.full_name || 'Não informado'}
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Email:</strong> {user?.email}
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Tipo:</strong> {user?.user_metadata?.user_type === 'supplier' ? 'Fornecedor' : 'Body Piercer'}
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Status:</strong>{' '}
                <span className="text-amber-500">Aguardando aprovação</span>
              </p>
            </div>

            <p className="text-sm text-gray-400 text-center">
              Você receberá uma notificação por email assim que seu cadastro for aprovado. 
              Isso geralmente leva até 24 horas úteis.
            </p>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Verificar Status
              </Button>
              
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PendingApproval;