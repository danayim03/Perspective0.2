import { useRef } from "react";

export function useChatInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const initialFocusHandled = useRef(false);

  // Function to focus input without dismissing keyboard
  const focusInputWithoutDismissingKeyboard = () => {
    if (inputRef.current) {
      // Prevent scrolling and keep focus
      const scrollPos = window.scrollY;
      inputRef.current.focus();
      window.scrollTo(0, scrollPos); // Maintain current scroll position
    }
  };

  // Handle input focus without scrolling
  const handleInputFocus = () => {
    if (!initialFocusHandled.current) {
      initialFocusHandled.current = true;
    }
    
    // Prevent any automatic scrolling
    const scrollPos = window.scrollY;
    setTimeout(() => window.scrollTo(0, scrollPos), 10);
  };

  return {
    inputRef,
    focusInputWithoutDismissingKeyboard,
    handleInputFocus
  };
}
