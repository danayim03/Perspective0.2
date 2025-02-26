
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

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8080");
    
    websocket.onopen = () => {
      console.log("WebSocket Connected");
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
        onMatch(websocket);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket Disconnected");
      toast({
        title: "Connection lost",
        description: "Please try again",
        variant: "destructive",
      });
    };

    setWs(websocket);

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [onMatch, user]);

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
      </div>
    </div>
  );
};
