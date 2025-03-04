
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
      // Apply the current selected color to all user messages regardless of their original bubble color
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
      <div
        className={`max-w-[85%] px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm chat-message ${getBubbleStyles()}`}
      >
        {message.content}
      </div>
    </div>
  );
};
