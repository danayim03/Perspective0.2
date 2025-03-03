
import { useState } from "react";

interface UseRematchOptions {
  onRematch?: () => void;
  onEndChat?: () => void;
}

export function useRematch(
  ws: WebSocket | null,
  options?: UseRematchOptions
) {
  const [isRematching, setIsRematching] = useState(false);
  const [showRematchDialog, setShowRematchDialog] = useState(false);

  // Function to handle rematch
  const handleRematch = () => {
    setIsRematching(true);
    setShowRematchDialog(false);
    
    if (options?.onRematch) {
      options.onRematch();
    }
  };

  // Function to close the WebSocket and go back
  const closeConnection = () => {
    if (ws) {
      ws.close();
    }
    
    if (options?.onEndChat) {
      options.onEndChat();
    }
  };

  return {
    isRematching,
    setIsRematching,
    showRematchDialog,
    setShowRematchDialog,
    handleRematch,
    closeConnection
  };
}
