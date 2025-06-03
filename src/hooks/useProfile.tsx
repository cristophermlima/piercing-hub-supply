
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: 'piercer' | 'supplier';
  cnpj?: string;
  fantasy_name?: string;
  commercial_contact?: string;
  company_address?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      console.log('Fetching profile for user:', user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        // Se não conseguir buscar o perfil, criar um perfil baseado nos metadados do usuário
        const profileFromMetadata: Profile = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          user_type: user.user_metadata?.user_type || 'piercer',
          cnpj: user.user_metadata?.cnpj || '',
          fantasy_name: user.user_metadata?.fantasy_name || '',
          commercial_contact: user.user_metadata?.commercial_contact || '',
          company_address: user.user_metadata?.company_address || '',
          created_at: user.created_at || '',
          updated_at: user.updated_at || ''
        };
        console.log('Using profile from user metadata:', profileFromMetadata);
        return profileFromMetadata;
      }

      if (data) {
        console.log('Profile data received:', data);
        return data as Profile;
      }

      // Se não há dados, criar perfil dos metadados
      const profileFromMetadata: Profile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        user_type: user.user_metadata?.user_type || 'piercer',
        cnpj: user.user_metadata?.cnpj || '',
        fantasy_name: user.user_metadata?.fantasy_name || '',
        commercial_contact: user.user_metadata?.commercial_contact || '',
        company_address: user.user_metadata?.company_address || '',
        created_at: user.created_at || '',
        updated_at: user.updated_at || ''
      };
      console.log('No profile data found, using metadata:', profileFromMetadata);
      return profileFromMetadata;
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};
