
import { useState, useEffect } from "react";
import { Message, Role } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChatRoomProps {
  userRole: Role;
  onGoBack: () => void;
  onRematch: () => void;
  ws: WebSocket | null;
}

export const ChatRoom = ({ userRole, onGoBack, onRematch, ws }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isNormalChatEnd, setIsNormalChatEnd] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!ws) {
      toast({
        title: "Connection Error",
        description: "No WebSocket connection available",
        variant: "destructive",
      });
      return;
    }

    // Set up connection status
    if (ws.readyState === WebSocket.OPEN) {
      setIsConnected(true);
    }

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setIsConnected(true);
    };

    const messageHandler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          const newMessage: Message = {
            id: Date.now().toString(),
            senderId: "other",
            content: data.message,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, newMessage]);
        } else if (data.type === 'matchEnded') {
          setIsNormalChatEnd(true); // Set this to true when receiving matchEnded
          const systemMessage: Message = {
            id: Date.now().toString(),
            senderId: "system",
            content: "Your chat partner has ended the chat.",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, systemMessage]);
          setIsConnected(false);
          toast({
            title: "Chat ended",
            description: "Your chat partner has ended the chat",
          });
          onGoBack();
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    ws.addEventListener('message', messageHandler);

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      // Only show connection lost message if it wasn't a normal chat ending
      if (!isNormalChatEnd) {
        toast({
          title: "Connection lost",
          description: "The chat connection was closed",
          variant: "destructive",
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
      if (!isNormalChatEnd) {
        toast({
          title: "Connection error",
          description: "There was an error with the chat connection",
          variant: "destructive",
        });
      }
    };

    return () => {
      ws.removeEventListener('message', messageHandler);
    };
  }, [ws, onGoBack, toast, isNormalChatEnd]);

  const handleSend = () => {
    if (!newMessage.trim() || !ws || !isConnected) return;

    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: "user1",
        content: newMessage,
        timestamp: new Date(),
      };

      ws.send(JSON.stringify({
        type: 'chat',
        message: newMessage
      }));

      setMessages(prev => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleEndChat = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setIsNormalChatEnd(true);
      ws.send(JSON.stringify({ type: 'endChat' }));
      const systemMessage: Message = {
        id: Date.now().toString(),
        senderId: "system",
        content: "You have ended the chat.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMessage]);
      onGoBack();
    }
  };

  const handleRematchClick = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setIsNormalChatEnd(true);
      // Don't close the connection, just notify the other user and transition to matching
      ws.send(JSON.stringify({ type: 'endChat' }));
      onRematch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-perspective-100 to-perspective-200 p-1 sm:p-2 md:p-4 font-mono">
      <Card className="flex-1 flex flex-col w-full mx-auto backdrop-blur-lg bg-white/90 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl overflow-hidden">
        <div className="p-2 sm:p-3 md:p-4 border-b flex items-center justify-between">
          <Button
            onClick={handleEndChat}
            variant="ghost"
            size="sm"
            className="text-perspective-600 hover:text-perspective-700 hover:bg-perspective-100 text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden xs:inline">End</span>
          </Button>
          <Button
            onClick={handleRematchClick}
            variant="ghost"
            size="sm"
            className="text-perspective-600 hover:text-perspective-700 hover:bg-perspective-100 text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden xs:inline">Rematch</span>
          </Button>
        </div>

        <div className="flex-1 p-2 sm:p-3 md:p-4 overflow-y-auto space-y-2 sm:space-y-3 md:space-y-4">
          {!isConnected && (
            <div className="h-full flex items-center justify-center text-red-500 text-xs sm:text-sm md:text-base">
              Connection lost. Please try again.
            </div>
          )}
          {isConnected && messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-xs sm:text-sm md:text-base">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === "system" 
                    ? "justify-center"
                    : message.senderId === "user1" 
                      ? "justify-end" 
                      : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${
                    message.senderId === "system"
                      ? "bg-gray-200 text-gray-600"
                      : message.senderId === "user1"
                        ? "bg-perspective-400 text-gray-900"
                        : "bg-perspective-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2 sm:p-3 md:p-4 border-t">
          <div className="flex gap-1 sm:gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-white/50 text-xs sm:text-sm h-8 sm:h-10"
              disabled={!isConnected}
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || !isConnected}
              className="bg-perspective-400 hover:bg-perspective-500 text-white px-2 py-1 sm:px-3 sm:py-2"
              size="sm"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
