
import { useRef } from "react";

export function useChatInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const initialFocusHandled = useRef(false);

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
    inputRef,
    focusInputWithoutDismissingKeyboard,
    handleInputFocus
  };
}
