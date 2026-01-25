import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useConversations, useUnreadCount, Conversation } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { MessageCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: conversations, isLoading } = useConversations();
  const { data: unreadCount } = useUnreadCount();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchTerm="" onSearchChange={() => {}} cartItems={0} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchTerm="" onSearchChange={() => {}} cartItems={0} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Mensagens</h1>
          {unreadCount && unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} não lidas</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className={cn(
            'lg:col-span-1',
            selectedConversation && 'hidden lg:block'
          )}>
            <Card>
              <CardContent className="p-0">
                {!conversations?.length ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Nenhuma conversa</h2>
                    <p className="text-muted-foreground text-center">
                      Inicie uma conversa com um fornecedor através da página do produto
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {conversations.map((conv) => (
                      <button
                        key={conv.partnerId}
                        onClick={() => setSelectedConversation(conv)}
                        className={cn(
                          'w-full p-4 text-left hover:bg-muted/50 transition-colors',
                          selectedConversation?.partnerId === conv.partnerId && 'bg-muted'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{conv.partnerName}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(conv.lastMessageAt), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </span>
                            {conv.unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 px-1.5">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className={cn(
            'lg:col-span-2',
            !selectedConversation && 'hidden lg:block'
          )}>
            {selectedConversation ? (
              <ChatWindow
                partnerId={selectedConversation.partnerId}
                partnerName={selectedConversation.partnerName}
                onBack={() => setSelectedConversation(null)}
              />
            ) : (
              <Card className="h-[500px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione uma conversa para começar</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
