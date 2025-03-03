
import { useState } from "react";

export function useBubbleColor() {
  const [selectedBubbleColor, setSelectedBubbleColor] = useState({ 
    name: "Light Gray", 
    value: "bg-gray-200", 
    textColor: "text-black" 
  });

  return {
    selectedBubbleColor,
    setSelectedBubbleColor
  };
}
