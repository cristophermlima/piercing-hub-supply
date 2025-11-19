import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useSupplierReports = (period: string = '30d') => {
  const { user } = useAuth();

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['supplier-reports', user?.id, period],
    queryFn: async () => {
      if (!user) return null;

      // Buscar supplier_id do usuário
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!supplier) return null;

      // Calcular data inicial baseado no período
      const now = new Date();
      let startDate = new Date();
      
      if (period === '7d') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === '30d') {
        startDate.setDate(now.getDate() - 30);
      } else if (period === '90d') {
        startDate.setDate(now.getDate() - 90);
      }

      // Buscar pedidos do fornecedor
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (name, category_id),
          orders!inner (
            id,
            user_id,
            created_at,
            shipping_address
          )
        `)
        .eq('supplier_id', supplier.id)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      // Calcular estatísticas
      const totalRevenue = orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
      const totalOrders = new Set(orderItems?.map(item => item.order_id)).size;
      const totalCustomers = new Set(orderItems?.map(item => item.orders.user_id)).size;
      const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Evolução de vendas (agrupado por data)
      const salesByDate = orderItems?.reduce((acc: any, item: any) => {
        const date = new Date(item.created_at).toLocaleDateString('pt-BR', { month: 'short' });
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += item.price * item.quantity;
        return acc;
      }, {});

      const salesEvolution = Object.entries(salesByDate || {}).map(([date, value]) => ({
        date,
        value: value as number
      }));

      // Performance por produto
      const productPerformance = orderItems?.reduce((acc: any, item: any) => {
        const productName = item.products?.name || 'Produto Desconhecido';
        if (!acc[productName]) {
          acc[productName] = 0;
        }
        acc[productName] += item.price * item.quantity;
        return acc;
      }, {});

      const topProducts = Object.entries(productPerformance || {})
        .map(([name, revenue]) => ({ name, revenue: revenue as number }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Top clientes (agrupado por user_id)
      const customerOrders = orderItems?.reduce((acc: any, item: any) => {
        const userId = item.orders.user_id;
        if (!acc[userId]) {
          acc[userId] = { count: 0, total: 0 };
        }
        acc[userId].count += 1;
        acc[userId].total += item.price * item.quantity;
        return acc;
      }, {});

      const topCustomers = Object.entries(customerOrders || {})
        .map(([userId, data]: [string, any]) => ({
          id: userId,
          orderCount: data.count,
          totalSpent: data.total
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);

      return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageTicket,
        salesEvolution,
        topProducts,
        topCustomers,
        rawData: orderItems
      };
    },
    enabled: !!user,
  });

  return {
    reportData,
    isLoading
  };
};
