
import { useState, useEffect, useRef } from "react";
import { Message, Role } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeft, RefreshCw, Palette, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatRoomProps {
  userRole: Role;
  onGoBack: () => void;
  onRematch: () => void;
  ws: WebSocket | null;
}

// Predefined color theme options based on image
const bubbleColorOptions = [
  { name: "Pool Day", value: "bg-[#92D1FF]", textColor: "text-black" },
  { name: "Berry Pop", value: "bg-[#F698DB]", textColor: "text-black" },
  { name: "Fresh Lavender", value: "bg-[#BCACDD]", textColor: "text-black" },
  { name: "Palm Leaf", value: "bg-[#E1EEAF]", textColor: "text-black" },
];

// Default light gray bubble color
const defaultBubbleColor = { 
  name: "Light Gray", 
  value: "bg-gray-200", 
  textColor: "text-black" 
};

export const ChatRoom = ({ userRole, onGoBack, onRematch, ws }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isNormalChatEnd, setIsNormalChatEnd] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [selectedBubbleColor, setSelectedBubbleColor] = useState(defaultBubbleColor);
  const [showRematchDialog, setShowRematchDialog] = useState(false);
  const [rematchDialogMessage, setRematchDialogMessage] = useState("");

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
          // Hide typing indicator when message arrives
          setIsTyping(false);
          if (typingTimeout) {
            clearTimeout(typingTimeout);
          }
          
          const newMessage: Message = {
            id: Date.now().toString(),
            senderId: "other",
            content: data.message,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, newMessage]);
        } else if (data.type === 'typing') {
          // Show typing indicator
          setIsTyping(true);
          
          // Auto-hide typing indicator after 3 seconds if no new typing events
          if (typingTimeout) {
            clearTimeout(typingTimeout);
          }
          const timeout = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
          setTypingTimeout(timeout);
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
        } else if (data.type === 'rematchRequested') {
          // Show rematch request dialog
          setRematchDialogMessage(data.message);
          setShowRematchDialog(true);
          
          // Also add a system message
          const systemMessage: Message = {
            id: Date.now().toString(),
            senderId: "system",
            content: "Your chat partner wants to find a new match.",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, systemMessage]);
          
          // Show toast notification
          toast({
            title: "Rematch Request",
            description: "Your chat partner wants to find a new match",
          });
        } else if (data.type === 'rematchAccepted') {
          // Show success message
          toast({
            title: "Rematch Accepted",
            description: "Your chat partner also wants to find a new match!",
          });
          
          // Add system message
          const systemMessage: Message = {
            id: Date.now().toString(),
            senderId: "system",
            content: "Your chat partner also wants to find a new match! Looking for a new match...",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, systemMessage]);
          
          // Transition to matching screen
          onRematch();
        } else if (data.type === 'rematchDeclined') {
          // Show declined message
          toast({
            title: "Rematch Declined",
            description: "Your chat partner doesn't want to find a new match at this time.",
            variant: "destructive"
          });
          
          // Add system message
          const systemMessage: Message = {
            id: Date.now().toString(),
            senderId: "system",
            content: "Your chat partner doesn't want to find a new match at this time.",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, systemMessage]);
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
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [ws, onGoBack, toast, isNormalChatEnd, typingTimeout, onRematch]);

  // Send typing signal when user is typing
  const handleTyping = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'typing'
      }));
    }
  };

  // Debounce typing signal
  useEffect(() => {
    if (newMessage.trim() && isConnected) {
      handleTyping();
    }
  }, [newMessage, isConnected]);

  const handleSend = () => {
    if (!newMessage.trim() || !ws || !isConnected) return;

    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: "user1",
        content: newMessage,
        timestamp: new Date(),
        bubbleColor: selectedBubbleColor.value,
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
      // Send rematch request to the server
      ws.send(JSON.stringify({ type: 'rematchRequest' }));
      
      // Add a system message to indicate rematch request
      const systemMessage: Message = {
        id: Date.now().toString(),
        senderId: "system",
        content: "You've requested to find a new match. Waiting for your chat partner's response...",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMessage]);
      
      // Also show toast to the current user
      toast({
        title: "Rematch Requested",
        description: "Waiting for your chat partner to respond...",
      });
    }
  };
  
  const handleAcceptRematch = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Close the dialog
      setShowRematchDialog(false);
      
      // Send accept message to server
      ws.send(JSON.stringify({ type: 'acceptRematch' }));
      
      // Add system message
      const systemMessage: Message = {
        id: Date.now().toString(),
        senderId: "system",
        content: "You've accepted the rematch request. Looking for a new match...",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMessage]);
      
      // Transition to matching screen
      onRematch();
    }
  };
  
  const handleDeclineRematch = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Close the dialog
      setShowRematchDialog(false);
      
      // Send decline message to server
      ws.send(JSON.stringify({ type: 'declineRematch' }));
      
      // Add system message
      const systemMessage: Message = {
        id: Date.now().toString(),
        senderId: "system",
        content: "You've declined the rematch request.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMessage]);
    }
  };

  const handleColorChange = (color: typeof bubbleColorOptions[0]) => {
    setSelectedBubbleColor(color);
    
    // Update all previous user messages to the new color
    setMessages(prevMessages => 
      prevMessages.map(message => {
        // Only update user's own messages
        if (message.senderId === "user1") {
          return {
            ...message,
            bubbleColor: color.value
          };
        }
        return message;
      })
    );
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="flex justify-start">
      <div className="max-w-[85%] p-2 sm:p-3 rounded-lg text-xs sm:text-sm bg-perspective-100 text-gray-700">
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
          <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
          <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col h-[calc(100dvh-48px)] pt-12 bg-gradient-to-br from-perspective-100 to-perspective-200 p-1 sm:p-2 md:p-4 font-mono">
        <Card className="flex-1 flex flex-col w-full mx-auto backdrop-blur-lg bg-white/90 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl overflow-hidden max-h-[calc(100dvh-48px)]">
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
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-perspective-600 hover:text-perspective-700 hover:bg-perspective-100 text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3"
                  >
                    <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Color</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {bubbleColorOptions.map((color) => (
                    <DropdownMenuItem
                      key={color.value}
                      onClick={() => handleColorChange(color)}
                      className="flex items-center gap-2"
                    >
                      <div className={`w-4 h-4 rounded-full ${color.value}`}></div>
                      <span>{color.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
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
              <>
                {messages.map((message) => (
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
                            ? message.bubbleColor || selectedBubbleColor.value + " " + selectedBubbleColor.textColor
                            : "bg-gray-200 text-black"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {/* Show typing indicator when the other user is typing */}
                {isTyping && <TypingIndicator />}
                
                {/* Invisible div for scrolling to bottom */}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-2 sm:p-3 md:p-4 border-t">
            <div className="flex gap-1 sm:gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-white/50 text-xs sm:text-sm h-8 sm:h-10"
                disabled={!isConnected}
              />
              <Button
                onClick={handleSend}
                disabled={!newMessage.trim() || !isConnected}
                className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 sm:px-3 sm:py-2"
                size="sm"
              >
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Rematch Request Dialog */}
      <AlertDialog open={showRematchDialog} onOpenChange={setShowRematchDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rematch Request</AlertDialogTitle>
            <AlertDialogDescription>
              {rematchDialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={handleDeclineRematch} className="flex items-center gap-1">
              <X className="w-4 h-4" />
              No thanks
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAcceptRematch} className="flex items-center gap-1 bg-perspective-400 hover:bg-perspective-500">
              <Check className="w-4 h-4" />
              Yes, find new match
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
