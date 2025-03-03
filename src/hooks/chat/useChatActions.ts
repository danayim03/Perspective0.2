
import { useState } from "react";
import { Message } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface UseChatActionsOptions {
  isConnected: boolean;
  chatEnded: boolean;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsNormalChatEnd: React.Dispatch<React.SetStateAction<boolean>>;
  setChatEnded: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useChatActions(
  ws: WebSocket | null,
  options: UseChatActionsOptions
) {
  const { isConnected, chatEnded, setMessages, setIsNormalChatEnd, setChatEnded } = options;
  const { toast } = useToast();

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

  return {
    handleTyping,
    sendMessage,
    endChat,
  };
}
