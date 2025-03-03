
import React from "react";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { bubbleColorOptions } from "./constants";

interface ChatHeaderProps {
  onEndChat: () => void;
  chatEnded: boolean;
  onColorChange: (color: typeof bubbleColorOptions[0]) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onEndChat,
  chatEnded,
  onColorChange
}) => {
  return (
    <div className="p-2 sm:p-3 md:p-4 border-b flex items-center justify-between">
      <Button
        onClick={onEndChat}
        variant="ghost"
        size="sm"
        className="text-perspective-600 hover:text-perspective-700 hover:bg-perspective-100 text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3"
      >
        End Chat
      </Button>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-perspective-600 hover:text-perspective-700 hover:bg-perspective-100 text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3"
              disabled={chatEnded}
            >
              <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Color</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {bubbleColorOptions.map((color) => (
              <DropdownMenuItem
                key={color.value}
                onClick={() => onColorChange(color)}
                className="flex items-center gap-2"
              >
                <div className={`w-4 h-4 rounded-full ${color.value}`}></div>
                <span>{color.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
