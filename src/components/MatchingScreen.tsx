
import { User } from "@/types";

interface MatchingScreenProps {
  ws: WebSocket | null;
  user: User;
}

export const MatchingScreen = ({ ws, user }: MatchingScreenProps) => {
  const getMatchingMessage = () => {
    return `Give us a sec... Matching you with a ${user.targetGender === "male" ? "guy" : "girl"}... 🔍`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-6 sm:pt-10 md:pt-16 font-mono px-4">
      <div className="text-center space-y-6 sm:space-y-8 max-w-xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 leading-tight">
          {getMatchingMessage()}
        </h2>
        
        <p className="text-gray-600 text-sm sm:text-base">
          We're connecting you with someone with a different perspective 💡
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
