
import { useViewport } from "./chat/useViewport";
import { useChatScroll } from "./chat/useChatScroll";
import { useChatInput } from "./chat/useChatInput";
import { useBubbleColor } from "./chat/useBubbleColor";
import { useNavigation } from "./chat/useNavigation";

export function useChatView(chatEnded: boolean) {
  const { viewportHeight } = useViewport();
  const { selectedBubbleColor, setSelectedBubbleColor } = useBubbleColor();
  const { messagesEndRef, chatContainerRef, scrollToBottom } = useChatScroll();
  const { inputRef, focusInputWithoutDismissingKeyboard, handleInputFocus } = useChatInput();
  
  // Handle navigation
  useNavigation(chatEnded);

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
