
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  user_type: 'buyer' | 'supplier';
  created_at: string;
  updated_at: string;
  cpf_cnpj?: string;
  phone_number?: string;
  certificate_url?: string;
  certificate_approved?: boolean;
}

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found, returning null');
        return null;
      }

      console.log('Fetching profile for user:', user.id);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile from database:', error);
        }

        if (data) {
          console.log('Profile data found in database:', data);
          return data as Profile;
        }

        // Se não há dados na tabela profiles, criar perfil baseado nos metadados do usuário
        const profileFromMetadata: Profile = {
          id: '',
          user_id: user.id,
          full_name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || '',
          user_type: user.user_metadata?.user_type || 'buyer',
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString()
        };
        
        console.log('Using profile from user metadata:', profileFromMetadata);
        return profileFromMetadata;
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
        
        // Em caso de erro inesperado, ainda tentar usar os metadados do usuário
        const profileFromMetadata: Profile = {
          id: '',
          user_id: user.id,
          full_name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || '',
          user_type: user.user_metadata?.user_type || 'buyer',
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString()
        };
        
        console.log('Error occurred, using profile from user metadata:', profileFromMetadata);
        return profileFromMetadata;
      }
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};
