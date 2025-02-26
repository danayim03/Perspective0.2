
import { useEffect, useState, useCallback } from "react";
import { Role, User } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface MatchingScreenProps {
  onMatch: (ws: WebSocket) => void;
  role: Role;
  user: User;
}

export const MatchingScreen = ({ onMatch, role, user }: MatchingScreenProps) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { toast } = useToast();
  const [isMatched, setIsMatched] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 5;

  const connectWebSocket = useCallback(() => {
    if (isConnecting || isMatched) return;
    
    if (retryCount >= MAX_RETRIES) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    const websocket = new WebSocket("ws://localhost:8080");
    
    websocket.onopen = () => {
      console.log("WebSocket Connected");
      setIsConnecting(false);
      setRetryCount(0);
      // Send user data to server for matching
      websocket.send(JSON.stringify({
        type: 'waiting',
        user: user
      }));
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'matched') {
        toast({
          title: "Match found!",
          description: "Connecting you to chat...",
        });
        setIsMatched(true);
        onMatch(websocket);
      }
    };

    websocket.onclose = () => {
      if (!isMatched) {
        console.log(`WebSocket Disconnected - Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        setIsConnecting(false);
        setWs(null);
        
        // Exponential backoff for reconnection
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          connectWebSocket();
        }, backoffTime);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnecting(false);
    };

    setWs(websocket);
  }, [isConnecting, isMatched, retryCount, onMatch, user]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      // Only close the websocket if we haven't been matched
      if (ws && !isMatched) {
        ws.close();
        setRetryCount(MAX_RETRIES); // Prevent further reconnection attempts on unmount
      }
    };
  }, [connectWebSocket, ws, isMatched]);

  const messages = {
    getter: {
      title: "Finding your perspective giver...",
      subtitle: "We're connecting you with someone who can help",
    },
    giver: {
      title: "Finding someone who needs your perspective...",
      subtitle: "We're connecting you with someone seeking advice",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-perspective-100 to-perspective-200">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-perspective-300 mx-auto animate-pulse-soft" />
        <h2 className="text-2xl font-semibold text-gray-900">
          {messages[role].title}
        </h2>
        <p className="text-gray-600">{messages[role].subtitle}</p>
        {isConnecting && (
          <p className="text-sm text-gray-500">Connecting to server...</p>
        )}
        {retryCount > 0 && retryCount < MAX_RETRIES && (
          <p className="text-sm text-gray-500">
            Reconnecting... Attempt {retryCount} of {MAX_RETRIES}
          </p>
        )}
      </div>
    </div>
  );
};
