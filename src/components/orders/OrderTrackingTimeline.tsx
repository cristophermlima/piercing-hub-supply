import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrderTracking, ORDER_STATUS_LABELS, TrackingEvent } from '@/hooks/useOrderTracking';
import { Check, Package, Truck, MapPin, Clock, Loader2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface OrderTrackingTimelineProps {
  orderId: string;
  currentStatus?: string;
}

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: Check,
  processing: Package,
  shipped: Truck,
  in_transit: Truck,
  out_for_delivery: MapPin,
  delivered: Check,
  completed: Check,
  cancelled: Clock,
};

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
  orderId,
  currentStatus,
}) => {
  const { data: trackingEvents, isLoading } = useOrderTracking(orderId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // If no tracking events, show current status
  const events: TrackingEvent[] = trackingEvents?.length
    ? trackingEvents
    : currentStatus
    ? [
        {
          id: 'current',
          order_id: orderId,
          status: currentStatus,
          description: ORDER_STATUS_LABELS[currentStatus]?.description || null,
          location: null,
          created_at: new Date().toISOString(),
        },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Rastreamento do Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Nenhuma informação de rastreamento disponível
          </p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-muted" />

            <div className="space-y-6">
              {events.map((event, index) => {
                const StatusIcon = statusIcons[event.status] || Clock;
                const isLatest = index === events.length - 1;
                const statusInfo = ORDER_STATUS_LABELS[event.status];

                return (
                  <div key={event.id} className="relative flex gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'relative z-10 flex h-8 w-8 items-center justify-center rounded-full',
                        isLatest
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <StatusIcon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={isLatest ? 'default' : 'secondary'}
                          className="font-medium"
                        >
                          {statusInfo?.label || event.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.created_at), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>

                      {event.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      )}

                      {event.location && (
                        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      )}

                      {isLatest && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(event.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
