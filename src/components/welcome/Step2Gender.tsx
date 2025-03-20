
import { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Gender } from "@/types";
import { GenderSelection } from "./GenderSelection";

interface Step2Props {
  nickname: string;
  gender: Gender | "";
  setGender: (gender: Gender) => void;
  targetGender: Gender | "";
  setTargetGender: (gender: Gender) => void;
  setStep: (step: number) => void;
}

export const Step2Gender = ({ 
  nickname, 
  gender,
  setGender,
  targetGender,
  setTargetGender,
  setStep 
}: Step2Props) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="text-center space-y-8">
      <h1 className="text-3xl font-medium">Glad you're here, {nickname}!</h1>
      
      <GenderSelection 
        nickname={nickname}
        gender={gender}
        setGender={setGender}
        handleKeyDown={handleKeyDown}
      />
      
      <div>
        <h3 className="text-lg font-medium mb-4">I want to talk to:</h3>
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
          <Button 
            onClick={() => setTargetGender("male")}
            variant="outline"
            className={`rounded-full px-6 transition-colors ${(targetGender === "male") 
              ? "bg-selection-default hover:bg-selection-hover text-gray-800" 
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"} w-full sm:w-auto`}
            onKeyDown={(e) => handleKeyDown(e, () => setTargetGender("male"))}
          >
            Guy
          </Button>
          
          <Button 
            onClick={() => setTargetGender("female")}
            variant="outline"
            className={`rounded-full px-6 transition-colors ${(targetGender === "female") 
              ? "bg-selection-default hover:bg-selection-hover text-gray-800" 
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"} w-full sm:w-auto`}
            onKeyDown={(e) => handleKeyDown(e, () => setTargetGender("female"))}
          >
            Girl
          </Button>
        </div>
      </div>
      
      <div>
        <Button 
          onClick={() => handleSubmit()} 
          disabled={!gender || !targetGender}
          className="rounded-full bg-perspective-400 hover:bg-perspective-500 text-gray-500 font-medium py-2 px-8 mt-6"
          onKeyDown={(e) => handleKeyDown(e, () => handleSubmit())}
        >
          Proceed
        </Button>
      </div>
      
      <Button 
        onClick={() => setStep(1)} 
        variant="ghost" 
        className="text-gray-500 hover:text-gray-800"
        onKeyDown={(e) => handleKeyDown(e, () => setStep(1))}
      >
        ← Go Back
      </Button>
    </div>
  );

  function handleSubmit() {
    if (!gender || !targetGender) return;
    setStep(3);
  }
};
