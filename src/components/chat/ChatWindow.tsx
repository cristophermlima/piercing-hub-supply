import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessages, useSendMessage, useMarkAsRead, Message } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  partnerId: string;
  partnerName: string;
  productId?: string;
  orderId?: string;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  partnerId,
  partnerName,
  productId,
  orderId,
  onBack,
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: messages, isLoading } = useMessages(partnerId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: markAsRead } = useMarkAsRead();

  // Mark messages as read when viewing
  useEffect(() => {
    if (partnerId) {
      markAsRead(partnerId);
    }
  }, [partnerId, markAsRead]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage(
      {
        receiverId: partnerId,
        content: message.trim(),
        productId,
        orderId,
      },
      {
        onSuccess: () => {
          setMessage('');
        },
      }
    );
  };

  const renderMessage = (msg: Message) => {
    const isOwn = msg.sender_id === user?.id;
    
    return (
      <div
        key={msg.id}
        className={cn(
          'flex flex-col max-w-[80%]',
          isOwn ? 'ml-auto items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'rounded-lg px-3 py-2',
            isOwn
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          )}
        >
          <p className="text-sm">{msg.content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {format(new Date(msg.created_at), 'HH:mm', { locale: ptBR })}
        </span>
      </div>
    );
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    
    messages.forEach((msg) => {
      const date = format(new Date(msg.created_at), 'dd/MM/yyyy', { locale: ptBR });
      const lastGroup = groups[groups.length - 1];
      
      if (lastGroup?.date === date) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ date, messages: [msg] });
      }
    });
    
    return groups;
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="border-b py-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="text-lg">{partnerName}</CardTitle>
        </div>
      </CardHeader>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Nenhuma mensagem ainda. Comece a conversa!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupMessagesByDate(messages || []).map((group) => (
              <div key={group.date}>
                <div className="flex justify-center mb-4">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {group.date}
                  </span>
                </div>
                <div className="space-y-2">
                  {group.messages.map(renderMessage)}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <CardContent className="border-t p-3">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={!message.trim() || isSending}>
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
