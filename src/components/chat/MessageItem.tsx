
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
      return "bg-[#F1F1F1] text-black";
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
          <div className={`absolute ${message.senderId === "user1" ? "right-2" : "left-2"} bottom-[-12px]`}>
            {message.senderId === "user1" ? (
              // Right-pointing arrow for user1 messages
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M20 0C15 0 0 0 0 16C6.66667 10.6667 15 7 20 0Z" 
                  fill={selectedBubbleColor.value.replace('bg-[', '').replace(']', '')} 
                />
              </svg>
            ) : (
              // Left-pointing arrow for other messages
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0C5 0 20 0 20 16C13.3333 10.6667 5 7 0 0Z" fill="#F1F1F1"/>
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
