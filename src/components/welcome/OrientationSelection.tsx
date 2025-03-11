
import { Button } from "@/components/ui/button";
import { Orientation } from "@/types";
import { KeyboardEvent } from "react";

interface OrientationSelectionProps {
  nickname: string;
  orientation: Orientation | "";
  setOrientation: (orientation: Orientation) => void;
  isTarget?: boolean;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>, action: () => void) => void;
}

export const OrientationSelection = ({ 
  nickname, 
  orientation, 
  setOrientation, 
  isTarget = false,
  handleKeyDown 
}: OrientationSelectionProps) => {
  return (
    <div className="space-y-4 max-w-md mx-auto mt-8">
      <h3 className="text-lg font-medium">
        {isTarget ? "Find me an orientation:" : `${nickname}'s orientation is:`}
      </h3>
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
        <Button 
          onClick={() => setOrientation("straight")}
          variant="outline"
          className={`rounded-full px-6 transition-colors ${orientation === "straight" 
            ? "bg-selection-default hover:bg-selection-hover text-gray-800" 
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"} w-full sm:w-auto`}
          onKeyDown={(e) => handleKeyDown(e, () => setOrientation("straight"))}
        >
          Straight 
        </Button>
        
        <Button 
          onClick={() => setOrientation("gay")}
          variant="outline"
          className={`rounded-full px-6 transition-colors ${orientation === "gay" 
            ? "bg-selection-default hover:bg-selection-hover text-gray-800" 
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"} w-full sm:w-auto`}
          onKeyDown={(e) => handleKeyDown(e, () => setOrientation("gay"))}
        >
          Gay 
        </Button>
        
        {/* <Button 
          onClick={() => setOrientation("bisexual")}
          variant="outline"
          className={`rounded-full px-6 transition-colors ${orientation === "bisexual" 
            ? "bg-selection-default hover:bg-selection-hover text-gray-800" 
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"} w-full sm:w-auto`}
          onKeyDown={(e) => handleKeyDown(e, () => setOrientation("bisexual"))}
        >
          Bisexual 
        </Button> */}
      </div>
    </div>
  );
};
