
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
      return message.bubbleColor 
        ? `${message.bubbleColor} ${selectedBubbleColor.textColor}`
        : `${selectedBubbleColor.value} ${selectedBubbleColor.textColor}`;
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
      }`}
    >
      <div
        className={`max-w-[85%] p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm chat-message ${getBubbleStyles()}`}
      >
        {message.content}
      </div>
    </div>
  );
};
