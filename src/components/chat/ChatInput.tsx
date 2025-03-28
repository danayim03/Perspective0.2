
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { preventLayoutShift } from "./utils";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSend: () => void;
  isConnected: boolean;
  chatEnded: boolean;
  isRematching: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onFocus: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  handleSend,
  isConnected,
  chatEnded,
  isRematching,
  inputRef,
  onFocus
}) => {
  // Apply layout fixes when component mounts
  useEffect(() => {
    // Apply prevention for iOS devices
    preventLayoutShift();
    
    const input = inputRef.current;
    if (input) {
      // Handle focus without scrolling
      const handleFocusIn = (e: FocusEvent) => {
        // Prevent default behavior
        e.preventDefault();
        
        // Let the parent component handle focus logic
        onFocus();
        
        // Prevent screen from moving
        const scrollPos = window.scrollY;
        setTimeout(() => window.scrollTo(0, scrollPos), 10);
      };
      
      input.addEventListener('focusin', handleFocusIn);
      return () => {
        input.removeEventListener('focusin', handleFocusIn);
      };
    }
  }, [inputRef, onFocus]);

  const handleSendClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button behavior
    
    // Capture scroll position before sending
    const scrollPos = window.scrollY;
    
    // Send and then maintain position
    handleSend();
    
    // Maintain scroll position to prevent movement
    setTimeout(() => window.scrollTo(0, scrollPos), 10);
  };

  return (
    <div className="p-2 sm:p-3 md:p-4 border-t sticky bottom-0 bg-white/95 backdrop-blur-sm chat-input-container z-10">
      <div className="flex gap-1 sm:gap-2">
        <Input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            chatEnded 
              ? "This chat has ended" 
              : isRematching
                ? "Finding a new match..."
                : isConnected 
                  ? "Type a message..." 
                  : "Connecting..."
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Prevent default to avoid losing focus
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-white/50 text-xs sm:text-sm h-8 sm:h-10"
          disabled={!isConnected || chatEnded || isRematching}
        />
        <Button
          onClick={handleSendClick}
          disabled={!newMessage.trim() || !isConnected || chatEnded || isRematching}
          className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 sm:px-3 sm:py-2"
          size="sm"
        >
          <Send className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </div>
  );
};
