
import { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Gender } from "@/types";
import { GenderSelection } from "./GenderSelection";

interface Step3Props {
  nickname: string;
  gender: Gender | "";
  setGender: (gender: Gender) => void;
  targetGender: Gender | "";
  setTargetGender: (gender: Gender) => void;
  handleSubmit: () => void;
  setStep: (step: number) => void;
}

export const Step3Profile = ({
  nickname,
  gender,
  setGender,
  targetGender,
  setTargetGender,
  handleSubmit,
  setStep
}: Step3Props) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="text-center space-y-6">
      
      <GenderSelection 
        nickname={nickname}
        gender={gender}
        setGender={setGender}
        handleKeyDown={handleKeyDown}
      />
      
      <div className="pt-6">
        <Button 
          onClick={handleSubmit} 
          disabled={!gender || !targetGender}
          className="rounded-full bg-perspective-400 hover:bg-perspective-500 text-gray-500 font-medium py-2 px-8"
          onKeyDown={(e) => handleKeyDown(e, () => handleSubmit())}
        >
          Proceed
        </Button>
        
        <div className="mt-4">
          <Button 
            onClick={() => setStep(2)} 
            variant="ghost" 
            className="text-gray-500 hover:text-gray-800"
            onKeyDown={(e) => handleKeyDown(e, () => setStep(2))}
          >
            ← Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};
