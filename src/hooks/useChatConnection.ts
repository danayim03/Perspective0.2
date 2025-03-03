
import { useState, useEffect, useRef } from "react";
import { Message } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface UseChatConnectionOptions {
  onEndChat?: () => void;
  onRematch?: () => void;
}

export function useChatConnection(ws: WebSocket | null, options?: UseChatConnectionOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isNormalChatEnd, setIsNormalChatEnd] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [chatEnded, setChatEnded] = useState(false);
  const [isRematching, setIsRematching] = useState(false);
  const [showRematchDialog, setShowRematchDialog] = useState(false);
  const { toast } = useToast();

  // Set up WebSocket event handlers
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
  }, [ws, toast, isNormalChatEnd, typingTimeout, chatEnded, isRematching]);

  // Function to send a typing notification
  const handleTyping = () => {
    if (ws && ws.readyState === WebSocket.OPEN && !chatEnded) {
      ws.send(JSON.stringify({
        type: 'typing'
      }));
    }
  };

  // Function to send a message
  const sendMessage = (messageText: string, bubbleColor: string) => {
    if (!messageText.trim() || !ws || !isConnected || chatEnded) return false;

    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: "user1",
        content: messageText,
        timestamp: new Date(),
        bubbleColor: bubbleColor,
      };

      ws.send(JSON.stringify({
        type: 'chat',
        message: messageText
      }));

      setMessages(prev => [...prev, message]);
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return false;
    }
  };

  // Function to end the chat
  const endChat = () => {
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

  // Function to handle rematch
  const handleRematch = () => {
    setIsRematching(true);
    setShowRematchDialog(false);
    
    if (options?.onRematch) {
      options.onRematch();
    }
  };

  // Function to close the WebSocket and go back
  const closeConnection = () => {
    if (ws) {
      ws.close();
    }
    
    if (options?.onEndChat) {
      options.onEndChat();
    }
  };

  return {
    messages,
    isConnected,
    isTyping,
    chatEnded,
    isRematching,
    showRematchDialog,
    setShowRematchDialog,
    handleTyping,
    sendMessage,
    endChat,
    handleRematch,
    closeConnection
  };
}
