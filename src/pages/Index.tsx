
import { useState, useEffect } from "react";
import { User } from "@/types";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { MatchingScreen } from "@/components/MatchingScreen";
import { ChatRoom } from "@/components/ChatRoom";
import { useToast } from "@/components/ui/use-toast";

type AppState = "welcome" | "matching" | "chat";

// Get WebSocket URL from environment variable or fallback to localhost in development
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";
const socket = new WebSocket(WS_URL);
socket.onopen = () => {
  console.log("WebSocket Connected");
};

const Index = () => {
  const [state, setState] = useState<AppState>("welcome");
  const [user, setUser] = useState<User | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Only establish connection when user enters the app
    if (user && !ws) {
      const websocket = new WebSocket(WS_URL);
      
      websocket.onopen = () => {
        console.log("WebSocket Connected");
        // If user is in matching state, send waiting signal
        if (state === "matching") {
          websocket.send(JSON.stringify({
            type: 'waiting',
            user: user
          }));
        }
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'matched') {
          console.log("Match found, transitioning to chat");
          setState("chat");
        }
      };

      websocket.onclose = () => {
        console.log("WebSocket Disconnected");
        setWs(null);
        if (state !== "welcome") {
          toast({
            title: "Connection lost",
            description: "Please try again",
            variant: "destructive",
          });
          setState("welcome");
          setUser(null);
        }
      };

      setWs(websocket);
    }

    // Cleanup function
    return () => {
      if (ws) {
        ws.close();
        setWs(null);
      }
    };
  }, [user, state]);

  const handleWelcomeComplete = (userData: Omit<User, "id">) => {
    setUser({ ...userData, id: Date.now().toString() });
    setState("matching");
  };

  const handleGoBack = () => {
    if (ws) {
      ws.close();
    }
    setState("welcome");
    setUser(null);
    setWs(null);
  };

  const handleRematch = () => {
    // Don't close the existing connection, just change state and send waiting signal
    if (ws && ws.readyState === WebSocket.OPEN) {
      setState("matching");
      ws.send(JSON.stringify({
        type: 'waiting',
        user: user
      }));
    } else {
      toast({
        title: "Connection Error",
        description: "Lost connection to server",
        variant: "destructive",
      });
      handleGoBack();
    }
  };

  return (
    <div className="min-h-screen px-3 sm:px-4 md:px-6 pt-12 sm:pt-16 container">
      {state === "welcome" && <WelcomeScreen onComplete={handleWelcomeComplete} />}
      {state === "matching" && user && (
        <MatchingScreen
          ws={ws}
          role={user.role}
          user={user}
        />
      )}
      {state === "chat" && ws && (
        <ChatRoom
          userRole={user?.role || "getter"}
          onGoBack={handleGoBack}
          onRematch={handleRematch}
          ws={ws}
        />
      )}
    </div>
  );
};

export default Index;
