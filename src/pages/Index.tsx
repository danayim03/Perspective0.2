
import { useState } from "react";
import { User } from "@/types";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { MatchingScreen } from "@/components/MatchingScreen";
import { ChatRoom } from "@/components/ChatRoom";

type AppState = "welcome" | "matching" | "chat";

const Index = () => {
  const [state, setState] = useState<AppState>("welcome");
  const [user, setUser] = useState<User | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const handleWelcomeComplete = (userData: Omit<User, "id">) => {
    setUser({ ...userData, id: Date.now().toString() });
    setState("matching");
  };

  const handleMatch = (websocket: WebSocket) => {
    setWs(websocket);
    setState("chat");
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
    if (ws) {
      ws.close();
    }
    setWs(null);
    setState("matching");
  };

  return (
    <div className="min-h-screen">
      {state === "welcome" && <WelcomeScreen onComplete={handleWelcomeComplete} />}
      {state === "matching" && user && (
        <MatchingScreen
          onMatch={handleMatch}
          role={user.role}
          user={user}
        />
      )}
      {state === "chat" && (
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
