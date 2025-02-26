
import { Role, User } from "@/types";

interface MatchingScreenProps {
  ws: WebSocket | null;
  role: Role;
  user: User;
}

export const MatchingScreen = ({ role, ws }: MatchingScreenProps) => {
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
