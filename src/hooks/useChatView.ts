
import { useState, useEffect, useRef } from "react";
import { toggleNavigation } from "@/components/chat/utils";

export function useChatView(chatEnded: boolean) {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [selectedBubbleColor, setSelectedBubbleColor] = useState({ 
    name: "Light Gray", 
    value: "bg-gray-200", 
    textColor: "text-black" 
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialLayoutSet = useRef(false);
  const initialFocusHandled = useRef(false);

  // Handle viewport height changes
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      window.scrollTo(0, 0);
    };
    
    const handleVisualViewportResize = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
        window.scrollTo(0, 0);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportResize);
    }
    
    window.scrollTo(0, 0);
    initialLayoutSet.current = true;
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
      }
    };
  }, []);

  // Toggle navigation based on chat state
  useEffect(() => {
    toggleNavigation(true);
    
    return () => {
      toggleNavigation(false);
    };
  }, []);

  useEffect(() => {
    if (chatEnded) {
      toggleNavigation(false);
    } else {
      toggleNavigation(true);
    }
  }, [chatEnded]);

  // Scroll to bottom utility
  const scrollToBottom = (immediate = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: immediate ? "auto" : "smooth",
        block: "end"
      });
    }
  };

  // Function to focus input without dismissing keyboard
  const focusInputWithoutDismissingKeyboard = () => {
    if (inputRef.current) {
      // Focus without scrolling
      window.scrollTo(0, 0);
      inputRef.current.focus();
    }
  };

  // Handle input focus without scrolling
  const handleInputFocus = () => {
    if (!initialFocusHandled.current) {
      initialFocusHandled.current = true;
    }
    
    window.scrollTo(0, 0);
  };

  return {
    viewportHeight,
    selectedBubbleColor,
    setSelectedBubbleColor,
    messagesEndRef,
    chatContainerRef,
    inputRef,
    scrollToBottom,
    handleInputFocus,
    focusInputWithoutDismissingKeyboard
  };
}
