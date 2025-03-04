
import { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Role } from "@/types";

interface Step2Props {
  nickname: string;
  setRole: (role: Role) => void;
  setStep: (step: number) => void;
}

export const Step2Role = ({ nickname, setRole, setStep }: Step2Props) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="text-center space-y-8">
      <h1 className="text-3xl font-medium">Glad you're here, {nickname}!</h1>
      <p className="text-lg">You are here to:</p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button 
          onClick={() => {
            setRole("getter");
            setStep(3);
          }}
          className="rounded-full bg-perspective-300 hover:bg-perspective-400 hover:font-bold text-gray-800 font-normal py-6 px-8 w-full sm:w-auto"
          onKeyDown={(e) => handleKeyDown(e, () => {
            setRole("getter");
            setStep(3);
          })}
        >
          Get a perspective 💡
        </Button>
        
        <Button 
          onClick={() => {
            setRole("giver");
            setStep(3);
          }}
          className="rounded-full bg-perspective-300 hover:bg-perspective-400 hover:font-bold text-gray-800 font-normal py-6 px-8 w-full sm:w-auto"
          onKeyDown={(e) => handleKeyDown(e, () => {
            setRole("giver");
            setStep(3);
          })}
        >
          Give a perspective 🍵👀
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
};
