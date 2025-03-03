
import { useState } from "react";
import { defaultBubbleColor } from "@/components/chat/constants";

export function useBubbleColor() {
  const [selectedBubbleColor, setSelectedBubbleColor] = useState(defaultBubbleColor);

  return {
    selectedBubbleColor,
    setSelectedBubbleColor
  };
}
