
import { useState, useEffect, useRef } from "react";
import { Message, Role } from "@/types";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { RematchDialog } from "./RematchDialog";
import { toggleNavigation } from "./utils";
import { bubbleColorOptions, defaultBubbleColor } from "./constants";

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
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [selectedBubbleColor, setSelectedBubbleColor] = useState(defaultBubbleColor);
  const [showRematchDialog, setShowRematchDialog] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [isRematching, setIsRematching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const initialLayoutSet = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    
    const handleVisualViewportResize = () => {
      if (window.visualViewport) {
        if (initialLayoutSet.current) {
          setViewportHeight(window.visualViewport.height);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportResize);
    }
    
    initialLayoutSet.current = true;
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
      }
    };
  }, []);

  useEffect(() => {
    toggleNavigation(true);
    
    return () => {
      toggleNavigation(false);
    };
  }, []);

  useEffect(() => {
    if (chatEnded) {
      toggleNavigation(false);
    } else {
      toggleNavigation(true);
    }
  }, [chatEnded]);

  const scrollToBottom = (immediate = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: immediate ? "auto" : "smooth",
        block: "end"
      });
    }
  };

  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      scrollToBottom(false);
    }, 100);
    
    return () => clearTimeout(scrollTimer);
  }, [messages, isTyping, viewportHeight]);

  const handleInputFocus = () => {
    if (initialLayoutSet.current) {
      setTimeout(() => {
        scrollToBottom(true);
      }, 300);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!chatEnded) {
      e.stopPropagation();
    }
  };

  useEffect(() => {
    if (!ws) {
      toast({
        title: "Connection Error",
        description: "No WebSocket connection available",
        variant: "destructive",
      });
      return;
    }

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
          setIsTyping(true);
          
          if (typingTimeout) {
            clearTimeout(typingTimeout);
          }
          const timeout = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
          setTypingTimeout(timeout);
        } else if (data.type === 'matchEnded') {
          setIsNormalChatEnd(true); 
          
          const systemMessage: Message = {
            id: Date.now().toString(),
            senderId: "system",
            content: "Your chat partner has ended the chat.",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, systemMessage]);
          setChatEnded(true);
          toast({
            title: "Chat ended",
            description: "Your chat partner has ended the chat",
          });
        } else if (data.type === 'rematchRequested') {
          setShowRematchDialog(true);
          
          setChatEnded(true);
          
          const systemMessage: Message = {
            id: Date.now().toString(),
            senderId: "system",
            content: "Your chat partner has requested a rematch and has left to find a new match.",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, systemMessage]);
          
          toast({
            title: "Rematch Requested",
            description: "Your chat partner has left to find a new match",
          });
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    ws.addEventListener('message', messageHandler);

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      if (!isNormalChatEnd && !chatEnded && !isRematching) {
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
      if (!isNormalChatEnd && !chatEnded && !isRematching) {
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
  }, [ws, onGoBack, toast, isNormalChatEnd, typingTimeout, chatEnded, isRematching]);

  const handleTyping = () => {
    if (ws && ws.readyState === WebSocket.OPEN && !chatEnded) {
      ws.send(JSON.stringify({
        type: 'typing'
      }));
    }
  };

  useEffect(() => {
    if (newMessage.trim() && isConnected && !chatEnded) {
      handleTyping();
    }
  }, [newMessage, isConnected, chatEnded]);

  const handleSend = () => {
    if (!newMessage.trim() || !ws || !isConnected || chatEnded) return;

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
      
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 10);
      }
      
      setTimeout(() => scrollToBottom(true), 50);
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
      setChatEnded(true);
      toast({
        title: "Chat ended",
        description: "You have ended the chat",
      });
    }
  };

  const handleGoHome = () => {
    if (ws) {
      ws.close();
    }
    
    onGoBack();
  };

  const handleRematchDialogConfirm = () => {
    setIsRematching(true);
    
    setShowRematchDialog(false);
    
    onRematch();
  };

  const handleColorChange = (color: typeof bubbleColorOptions[0]) => {
    setSelectedBubbleColor(color);
    
    setMessages(prevMessages => 
      prevMessages.map(message => {
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

  return (
    <>
      <div 
        className="flex flex-col h-[calc(100dvh-48px)] pt-12 bg-gradient-to-br from-perspective-100 to-perspective-200 p-1 sm:p-2 md:p-4 font-mono"
        onClick={handleContainerClick}
        style={{ 
          minHeight: '300px', 
          maxHeight: '100dvh',
          position: 'fixed',
          width: '100%',
          left: 0,
          top: 0
        }}
      >
        <Card 
          className="flex-1 flex flex-col w-full mx-auto backdrop-blur-lg bg-white/90 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl overflow-hidden chat-container"
          ref={chatContainerRef}
          style={{ 
            maxHeight: `${viewportHeight - 60}px` // Adjust for header
          }}
        >
          <ChatHeader 
            onEndChat={chatEnded ? handleGoHome : handleEndChat}
            chatEnded={chatEnded}
            onColorChange={handleColorChange}
          />

          <MessageList 
            messages={messages}
            isTyping={isTyping}
            chatEnded={chatEnded}
            isRematching={isRematching}
            isConnected={isConnected}
            selectedBubbleColor={selectedBubbleColor}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput 
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSend={handleSend}
            isConnected={isConnected}
            chatEnded={chatEnded}
            isRematching={isRematching}
            inputRef={inputRef}
            onFocus={handleInputFocus}
          />
        </Card>
      </div>
      
      <RematchDialog 
        open={showRematchDialog}
        onOpenChange={setShowRematchDialog}
        onConfirm={handleRematchDialogConfirm}
      />
    </>
  );
};
