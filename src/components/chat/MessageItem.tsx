
import React from "react";
import { Message } from "@/types";

interface MessageItemProps {
  message: Message;
  selectedBubbleColor: {
    value: string;
    textColor: string;
  };
}

export const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  selectedBubbleColor 
}) => {
  // Determine the bubble color to use
  const getBubbleStyles = () => {
    if (message.senderId === "system") {
      return "bg-gray-200 text-gray-600";
    } else if (message.senderId === "user1") {
      // Apply the current selected color to all user messages
      return `${selectedBubbleColor.value} ${selectedBubbleColor.textColor}`;
    } else {
      return "bg-gray-200 text-black";
    }
  };

  return (
    <div
      className={`flex ${
        message.senderId === "system" 
          ? "justify-center"
          : message.senderId === "user1" 
            ? "justify-end" 
            : "justify-start"
      } my-2`}
    >
      <div className="relative">
        <div
          className={`max-w-[85%] px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm ${getBubbleStyles()}`}
        >
          {message.content}
        </div>
        
        {/* Add the curved tail only for non-system messages */}
        {message.senderId !== "system" && (
          <div className={`absolute ${message.senderId === "user1" ? "right-2" : "left-2"} bottom-[-6px] w-3 h-3 overflow-hidden`}>
            <div 
              className={`absolute transform rotate-45 w-4 h-4 -top-2 ${
                message.senderId === "user1" 
                  ? `${selectedBubbleColor.value.replace('bg-', '')} -right-1` 
                  : "bg-gray-200 -left-1"
              }`}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
