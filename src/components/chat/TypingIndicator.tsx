
import React from "react";

export const TypingIndicator: React.FC = () => (
  <div className="flex justify-start">
    <div className="max-w-[85%] p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm bg-perspective-100 text-gray-700">
      <div className="flex items-center space-x-1">
        <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
        <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
        <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></div>
      </div>
    </div>
  </div>
);
