
import { Role, User } from "@/types";

interface MatchingScreenProps {
  ws: WebSocket | null;
  role: Role;
  user: User;
}

export const MatchingScreen = ({ role, ws, user }: MatchingScreenProps) => {
  // Helper function to format gender and orientation for display
  const formatGenderOrientation = (gender: string, orientation: string): string => {
    return `${orientation} ${gender}`;
  };

  // Dynamically generate messages based on user preferences
  const getMatchingMessage = () => {
    if (role === "getter" && user.targetGender && user.targetOrientation) {
      return `Give us a sec... Matching you with a ${formatGenderOrientation(user.targetGender, user.targetOrientation)}... 🔍`;
    } else if (role === "giver") {
      return "Finding someone who needs your perspective... 🍵👀";
    }
    return "Finding someone for you... 🔍";
  };

  const getMatchingSubtitle = () => {
    if (role === "getter") {
      return "We're connecting you with someone who can help 💡";
    } else {
      return "We're connecting you with someone seeking advice 💭";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-6 sm:pt-10 md:pt-16 font-mono px-4">
      <div className="text-center space-y-6 sm:space-y-8 max-w-xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 leading-tight">
          {getMatchingMessage()}
        </h2>
        
        <p className="text-gray-600 text-sm sm:text-base">
          {getMatchingSubtitle()}
        </p>
        
        <div className="flex justify-center">
          <div className="w-16 sm:w-24 h-1 bg-perspective-300 rounded-full animate-pulse-soft" />
        </div>
        
        <button 
          className="mt-6 sm:mt-8 text-sm sm:text-base text-gray-500 hover:text-gray-800 transition-colors"
          onClick={() => window.location.reload()}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};
