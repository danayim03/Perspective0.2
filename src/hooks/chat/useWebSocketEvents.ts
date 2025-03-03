
import { useState, useEffect } from "react";
import { Message } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface UseWebSocketEventsOptions {
  onMatchEnded?: () => void;
  onRematchRequested?: () => void;
}

export function useWebSocketEvents(
  ws: WebSocket | null, 
  options?: UseWebSocketEventsOptions
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [chatEnded, setChatEnded] = useState(false);
  const [isNormalChatEnd, setIsNormalChatEnd] = useState(false);
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
          
          if (options?.onMatchEnded) {
            options.onMatchEnded();
          }
        } else if (data.type === 'rematchRequested') {
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
          
          if (options?.onRematchRequested) {
            options.onRematchRequested();
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    ws.addEventListener('message', messageHandler);

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      if (!isNormalChatEnd && !chatEnded) {
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
      if (!isNormalChatEnd && !chatEnded) {
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
  }, [ws, toast, isNormalChatEnd, typingTimeout, chatEnded, options]);

  return {
    messages,
    setMessages,
    isConnected,
    isTyping,
    chatEnded,
    setChatEnded,
    isNormalChatEnd,
    setIsNormalChatEnd,
  };
}
