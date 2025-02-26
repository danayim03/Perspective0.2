
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const connectWebSocket = () => {
      if (isConnecting || isMatched) return;
      
      setIsConnecting(true);
      const websocket = new WebSocket("ws://localhost:8080");
      
      websocket.onopen = () => {
        console.log("WebSocket Connected");
        setIsConnecting(false);
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
          console.log("WebSocket Disconnected - Attempting to reconnect...");
          setIsConnecting(false);
          setWs(null);
          // Attempt to reconnect after a delay
          setTimeout(connectWebSocket, 2000);
        }
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnecting(false);
      };

      setWs(websocket);
    };

    connectWebSocket();

    return () => {
      // Only close the websocket if we haven't been matched
      if (ws && !isMatched) {
        ws.close();
      }
    };
  }, [onMatch, user, isMatched, isConnecting]);

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
      </div>
    </div>
  );
};
