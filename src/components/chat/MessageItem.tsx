
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
        className={`max-w-[85%] p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm chat-message ${
          message.senderId === "system"
            ? "bg-gray-200 text-gray-600"
            : message.senderId === "user1"
              ? message.bubbleColor || selectedBubbleColor.value + " " + selectedBubbleColor.textColor
              : "bg-gray-200 text-black"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};
