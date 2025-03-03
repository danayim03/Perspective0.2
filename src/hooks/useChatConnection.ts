
import { useWebSocketEvents } from "./chat/useWebSocketEvents";
import { useChatActions } from "./chat/useChatActions";
import { useRematch } from "./chat/useRematch";

interface UseChatConnectionOptions {
  onEndChat?: () => void;
  onRematch?: () => void;
}

export function useChatConnection(ws: WebSocket | null, options?: UseChatConnectionOptions) {
  // Set up WebSocket events and message handling
  const {
    messages,
    setMessages,
    isConnected,
    isTyping,
    chatEnded,
    setChatEnded,
    isNormalChatEnd,
    setIsNormalChatEnd,
  } = useWebSocketEvents(ws, {
    onMatchEnded: () => setChatEnded(true),
    onRematchRequested: () => setShowRematchDialog(true)
  });

  // Set up rematch functionality
  const {
    isRematching,
    setIsRematching,
    showRematchDialog,
    setShowRematchDialog,
    handleRematch,
    closeConnection
  } = useRematch(ws, options);

  // Set up chat actions
  const {
    handleTyping,
    sendMessage,
    endChat,
  } = useChatActions(ws, {
    isConnected,
    chatEnded,
    setMessages,
    setIsNormalChatEnd,
    setChatEnded
  });

  return {
    messages,
    isConnected,
    isTyping,
    chatEnded,
    isRematching,
    showRematchDialog,
    setShowRematchDialog,
    handleTyping,
    sendMessage,
    endChat,
    handleRematch,
    closeConnection
  };
}
