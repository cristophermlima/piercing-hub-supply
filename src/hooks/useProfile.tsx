
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
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      console.log('Profile data received:', data);
      return data as Profile;
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};
