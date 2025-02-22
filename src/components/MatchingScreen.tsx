
import { useEffect } from "react";

export const MatchingScreen = ({ onMatch }: { onMatch: () => void }) => {
  useEffect(() => {
    // Simulate finding a match after 3 seconds
    const timer = setTimeout(() => {
      onMatch();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onMatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-perspective-100 to-perspective-200">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-perspective-300 mx-auto animate-pulse-soft" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Finding your match...
        </h2>
        <p className="text-gray-600">
          We're connecting you with someone special
        </p>
      </div>
    </div>
  );
};
