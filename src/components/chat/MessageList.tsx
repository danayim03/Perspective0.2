
import React from "react";
import { Message } from "@/types";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  chatEnded: boolean;
  isRematching: boolean;
  isConnected: boolean;
  selectedBubbleColor: {
    value: string;
    textColor: string;
  };
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  chatEnded,
  isRematching,
  isConnected,
  selectedBubbleColor,
  messagesEndRef
}) => {
  return (
    <div className="flex-1 p-5 sm:p-6 md:p-8 overflow-y-auto space-y-2 sm:space-y-3 md:space-y-4 scrollbar-hide" style={{ paddingBottom: '5rem' }}>
      {!isConnected && !chatEnded && !isRematching && (
        <div className="h-full flex items-center justify-center text-red-500 text-xs sm:text-sm md:text-base">
          Connection lost. Please try again.
        </div>
      )}
      {chatEnded && (
        <div className="h-full flex items-center justify-center text-amber-500 text-xs sm:text-sm md:text-base">
          This chat has ended. You can go home or find a new match.
        </div>
      )}
      {isRematching && (
        <div className="h-full flex items-center justify-center text-blue-500 text-xs sm:text-sm md:text-base">
          Finding you a new match...
        </div>
      )}
      {isConnected && messages.length === 0 && !chatEnded && !isRematching ? (
        <div className="h-full flex items-center justify-center text-gray-500 text-xs sm:text-sm md:text-base">
          No messages yet. Start the conversation!
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageItem 
              key={message.id}
              message={message}
              selectedBubbleColor={selectedBubbleColor}
            />
          ))}
          
          {isTyping && !chatEnded && !isRematching && <TypingIndicator />}
          
          <div ref={messagesEndRef} className="h-1" />
        </>
      )}
    </div>
  );
};
