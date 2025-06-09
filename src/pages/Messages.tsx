import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chat } from "@/components/Chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Search, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { messageService } from "@/services/messageService";
import { users } from "@/lib/mockData";

interface Conversation {
  userId: string;
  lastMessage: {
    content: string;
    timestamp: string;
  };
  unreadCount: number;
}

export default function Messages() {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const conversationsData = await messageService.getUserConversations(
          user.id
        );
        
        // Convert the API response to our Conversation interface
        const formattedConversations: Conversation[] = conversationsData.map(conv => {
          return {
            userId: conv.otherParticipant.id,
            lastMessage: {
              content: conv.lastMessage.content,
              timestamp: conv.lastMessage.timestamp
            },
            unreadCount: conv.lastMessage.isRead ? 0 : 1 // Simple assumption for unread count
          };
        });
        
        setConversations(formattedConversations);

        // If we have conversations and none is selected, select the first one
        if (
          formattedConversations.length > 0 &&
          selectedUserId === null
        ) {
          setSelectedUserId(formattedConversations[0].userId);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user, selectedUserId]);

  // Function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("fr-FR", { weekday: "long" });
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
    }
  };

  // Filter conversations by search term
  const filteredConversations = searchTerm && Array.isArray(conversations)
    ? conversations.filter((conv) => {
        const otherUser = Array.isArray(users) ? users.find((u) => u.id === conv.userId) : null;
        if (!otherUser) return false;
        return (
          typeof otherUser.firstName === 'string' && otherUser.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          typeof otherUser.lastName === 'string' && otherUser.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : Array.isArray(conversations) ? conversations : [];

  // Start chat with admin if no conversations
  const startChatWithAdmin = () => {
    const admin = users.find((u) => u.role === "admin");
    if (admin) {
      setSelectedUserId(admin.id);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Accès non autorisé</h2>
              <p className="text-gray-600 mb-6">
                Vous devez être connecté pour accéder à vos messages.
              </p>
              <Button asChild>
                <a href="/login">Se connecter</a>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-2xl font-bold mb-6 text-autowise-navy">
            Mes messages
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1 border rounded-md overflow-hidden">
              <div className="p-3 border-b bg-gray-50">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-9 border rounded-md text-sm"
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="h-[530px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center">
                    <p>Chargement des conversations...</p>
                  </div>
                ) : !Array.isArray(filteredConversations) || filteredConversations.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-gray-500 mb-4">Aucune conversation</p>
                    <Button onClick={startChatWithAdmin} className="text-sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contacter le support
                    </Button>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const otherUser = Array.isArray(users) ? users.find(
                      (u) => u.id === conversation.userId
                    ) : null;
                    if (!otherUser) return null;

                    return (
                      <div
                        key={conversation.userId}
                        className={`flex items-start p-3 border-b cursor-pointer ${
                          selectedUserId === conversation.userId
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedUserId(conversation.userId)}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={otherUser.profilePicture} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-sm truncate">
                              {otherUser.firstName} {otherUser.lastName}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatTimestamp(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="ml-2 bg-autowise-blue">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedUserId ? (
                <Chat 
                  receiverId={selectedUserId} 
                  receiverName={(() => {
                    const selectedUser = users.find(u => u.id === selectedUserId);
                    return selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Utilisateur';
                  })()} 
                  receiverAvatar={(() => {
                    const selectedUser = users.find(u => u.id === selectedUserId);
                    return selectedUser?.avatar || selectedUser?.profilePicture;
                  })()} 
                />
              ) : (
                <div className="h-[600px] border rounded-md flex items-center justify-center">
                  <div className="text-center p-4">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Aucune conversation sélectionnée
                    </h3>
                    <p className="text-gray-500">
                      Sélectionnez une conversation ou démarrez une nouvelle.
                    </p>
                    {conversations.length === 0 && (
                      <Button
                        onClick={startChatWithAdmin}
                        className="mt-4"
                        variant="outline"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contacter le support
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
