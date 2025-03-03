
import { useEffect } from "react";
import { toggleNavigation } from "@/components/chat/utils";

export function useNavigation(chatEnded: boolean) {
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
}
