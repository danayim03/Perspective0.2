
import { useRef } from "react";

export function useChatScroll() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom utility that won't dismiss keyboard
  const scrollToBottom = (immediate = false) => {
    if (messagesEndRef.current) {
      // Capture current scroll position
      const scrollPos = window.scrollY;
      
      // Scroll the messages container, not the whole page
      messagesEndRef.current.scrollIntoView({ 
        behavior: immediate ? "auto" : "smooth",
        block: "end"
      });
      
      // Preserve scroll position to avoid shifting keyboard
      window.scrollTo(0, scrollPos);
    }
  };

  return {
    messagesEndRef,
    chatContainerRef,
    scrollToBottom
  };
}
