
import { Button } from "@/components/ui/button";
import { Gender } from "@/types";
import { KeyboardEvent } from "react";

interface GenderSelectionProps {
  nickname: string;
  gender: Gender | "";
  setGender: (gender: Gender) => void;
  isTarget?: boolean;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>, action: () => void) => void;
}

export const GenderSelection = ({ 
  nickname, 
  gender, 
  setGender, 
  isTarget = false,
  handleKeyDown 
}: GenderSelectionProps) => {
  return (
    <div className="space-y-4 max-w-md mx-auto mt-8">
      <h3 className="text-lg font-medium">
        {isTarget ? "Find me a gender:" : `${nickname}'s gender is:`}
      </h3>
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
        <Button 
          onClick={() => setGender("male")}
          variant="outline"
          className={`rounded-full px-6 transition-colors ${(gender === "male") 
            ? "bg-selection-default hover:bg-selection-hover text-gray-800" 
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"} w-full sm:w-auto`}
          onKeyDown={(e) => handleKeyDown(e, () => setGender("male"))}
        >
          Male
        </Button>
        
        <Button 
          onClick={() => setGender("female")}
          variant="outline"
          className={`rounded-full px-6 transition-colors ${(gender === "female") 
            ? "bg-selection-default hover:bg-selection-hover text-gray-800" 
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"} w-full sm:w-auto`}
          onKeyDown={(e) => handleKeyDown(e, () => setGender("female"))}
        >
          Female
        </Button>
        
        <Button 
          onClick={() => setGender("non-binary")}
          variant="outline"
          className={`rounded-full px-6 transition-colors ${(gender === "non-binary") 
            ? "bg-selection-default hover:bg-selection-hover text-gray-800" 
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"} w-full sm:w-auto`}
          onKeyDown={(e) => handleKeyDown(e, () => setGender("non-binary"))}
        >
          Non-binary 
        </Button>
      </div>
    </div>
  );
};
