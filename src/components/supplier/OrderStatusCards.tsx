import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Package, Truck, CheckCircle } from 'lucide-react';

interface OrderStatusCardsProps {
  statusCounts: Record<string, number>;
}

const OrderStatusCards = ({ statusCounts }: OrderStatusCardsProps) => {
  const cards = [
    {
      title: 'Pedidos Pendentes',
      count: statusCounts['pending'] || 0,
      icon: Clock,
      color: 'text-yellow-500'
    },
    {
      title: 'Em Processamento',
      count: statusCounts['processing'] || 0,
      icon: Package,
      color: 'text-blue-500'
    },
    {
      title: 'Enviados',
      count: statusCounts['shipped'] || 0,
      icon: Truck,
      color: 'text-purple-500'
    },
    {
      title: 'Entregues',
      count: statusCounts['delivered'] || 0,
      icon: CheckCircle,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{card.count}</p>
                </div>
                <Icon className={`h-8 w-8 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OrderStatusCards;
