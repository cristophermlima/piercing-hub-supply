import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { User, Building2, ArrowLeft, Upload, FileCheck, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import logo from '@/assets/logo.png';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated and approved
  useEffect(() => {
    if (user && !profileLoading) {
      const userType = user.user_metadata?.user_type;
      
      // Check if certificate is approved for piercers or supplier is approved
      if (profile?.certificate_approved) {
        if (userType === 'supplier') {
          navigate('/dashboard');
        } else {
          navigate('/marketplace');
        }
      }
    }
  }, [user, profile, profileLoading, navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>, certificateUrl?: string) => {
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
      certificate_url: certificateUrl || '',
      certificate_approved: false, // Sempre começa como não aprovado
    };

    const result = await signUp(
      formData.get('email') as string,
      formData.get('password') as string,
      userData
    );

    if (!result.error) {
      // Send notification to admin via WhatsApp
      try {
        await supabase.functions.invoke('notify-registration', {
          body: {
            fullName: userData.full_name,
            email: formData.get('email') as string,
            userType: userData.user_type,
            cnpj: userData.cnpj,
            fantasyName: userData.fantasy_name,
            commercialContact: userData.commercial_contact,
            companyAddress: userData.company_address,
            certificateUrl: certificateUrl,
          }
        });
      } catch (error) {
        console.error('Error sending notification:', error);
        // Don't block registration if notification fails
      }

      toast({
        title: "Cadastro enviado para análise!",
        description: "Você receberá uma notificação quando seu cadastro for aprovado.",
      });
    }

    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    await signIn(
      formData.get('email') as string,
      formData.get('password') as string
    );

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="mr-2 text-white hover:bg-gray-700">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-center">
            <img src={logo} alt="PiercerHub Logo" className="h-16 w-auto" />
            <span className="text-sm font-semibold text-primary -mt-1">Marketplace</span>
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

interface SignUpFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, certificateUrl?: string) => void;
  isLoading: boolean;
}

const SignUpForm = ({ onSubmit, isLoading }: SignUpFormProps) => {
  const [userType, setUserType] = useState<'piercer' | 'supplier'>('piercer');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Envie uma imagem (JPG, PNG, WebP) ou PDF",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB",
        variant: "destructive"
      });
      return;
    }

    setCertificateFile(file);
  };

  const uploadCertificate = async (userId: string): Promise<string | null> => {
    if (!certificateFile) return null;

    setUploadingCertificate(true);
    try {
      const fileExt = certificateFile.name.split('.').pop();
      const fileName = `${userId}/certificate-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('certificates')
        .upload(fileName, certificateFile);

      if (error) {
        console.error('Error uploading certificate:', error);
        toast({
          title: "Erro no upload",
          description: "Não foi possível enviar o certificado",
          variant: "destructive"
        });
        return null;
      }

      // Get signed URL for admin to view
      const { data: signedUrlData } = await supabase.storage
        .from('certificates')
        .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days expiry

      return signedUrlData?.signedUrl || data.path;
    } catch (error) {
      console.error('Error in upload:', error);
      return null;
    } finally {
      setUploadingCertificate(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // For piercers, certificate is required
    if (userType === 'piercer' && !certificateFile) {
      toast({
        title: "Certificado obrigatório",
        description: "Para body piercers, é necessário anexar o certificado de curso",
        variant: "destructive"
      });
      return;
    }

    // Generate a temporary userId for file upload path
    // The actual userId will be created during signup
    const tempUserId = crypto.randomUUID();
    
    let uploadedUrl = '';
    if (certificateFile) {
      const url = await uploadCertificate(tempUserId);
      if (url) {
        uploadedUrl = url;
        setCertificateUrl(url);
      }
    }

    onSubmit(e, uploadedUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>
          Cadastro exclusivo para profissionais. Seu cadastro será analisado antes da aprovação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-primary bg-primary/20">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground font-medium">
            Este é um marketplace exclusivo para profissionais de body piercing e fornecedores autorizados. 
            Todos os cadastros passam por análise e aprovação.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="cnpj">{userType === 'piercer' ? 'CPF ou CNPJ' : 'CNPJ'}</Label>
            <Input id="cnpj" name="cnpj" placeholder={userType === 'piercer' ? '000.000.000-00 ou 00.000.000/0000-00' : '00.000.000/0000-00'} required />
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

          {/* Certificate Upload for Piercers */}
          {userType === 'piercer' && (
            <div className="space-y-2">
              <Label htmlFor="certificate">
                Certificado de Curso de Body Piercing *
              </Label>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="certificate"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full justify-start"
                  disabled={uploadingCertificate}
                >
                  {uploadingCertificate ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : certificateFile ? (
                    <>
                      <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                      {certificateFile.name}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Anexar certificado (JPG, PNG ou PDF)
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Anexe uma foto ou scan do seu certificado de curso de body piercing. 
                  Máximo 5MB.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" placeholder="Crie uma senha segura" required />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading || uploadingCertificate}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Enviar para Análise'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Ao se cadastrar, você concorda que seus dados serão analisados para validação do perfil profissional.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default Auth;