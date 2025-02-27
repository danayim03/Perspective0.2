
import { Role, User } from "@/types";

interface MatchingScreenProps {
  ws: WebSocket | null;
  role: Role;
  user: User;
}

export const MatchingScreen = ({ role, ws, user }: MatchingScreenProps) => {
  const messages = {
    getter: {
      title: "Give us a sec... Matching you with a straight male...",
      subtitle: "We're connecting you with someone who can help",
    },
    giver: {
      title: "Finding someone who needs your perspective...",
      subtitle: "We're connecting you with someone seeking advice",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 font-roboto">
      <div className="text-center space-y-8 max-w-xl">
        <h2 className="text-3xl font-medium text-gray-900">
          {messages[role].title}
        </h2>
        
        <div className="flex justify-center">
          <div className="w-24 h-1 bg-perspective-300 rounded-full animate-pulse-soft" />
        </div>
        
        <button 
          className="mt-8 text-gray-500 hover:text-gray-800 transition-colors"
          onClick={() => window.location.reload()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
