
import { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Gender, Orientation, Role } from "@/types";
import { GenderSelection } from "./GenderSelection";
import { OrientationSelection } from "./OrientationSelection";

interface Step3Props {
  nickname: string;
  role: Role;
  gender: Gender | "";
  setGender: (gender: Gender) => void;
  orientation: Orientation | "";
  setOrientation: (orientation: Orientation) => void;
  targetGender: Gender | "";
  setTargetGender: (gender: Gender) => void;
  targetOrientation: Orientation | "";
  setTargetOrientation: (orientation: Orientation) => void;
  handleSubmit: () => void;
  setStep: (step: number) => void;
}

export const Step3Profile = ({
  nickname,
  role,
  gender,
  setGender,
  orientation,
  setOrientation,
  targetGender,
  setTargetGender,
  targetOrientation,
  setTargetOrientation,
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
      <h1 className="text-2xl font-medium">
        {role === "getter" 
          ? `Let me find a perspective for ${nickname} 📝...`
          : `What perspective are you providing, ${nickname}?`
        }
      </h1>
      
      <GenderSelection 
        nickname={nickname}
        gender={gender}
        setGender={setGender}
        handleKeyDown={handleKeyDown}
      />
{/*       
      <OrientationSelection 
        nickname={nickname}
        orientation={orientation}
        setOrientation={setOrientation}
        handleKeyDown={handleKeyDown}
      /> */}
      
      {role === "getter" && (
        <>
          <GenderSelection 
            nickname={nickname}
            gender={targetGender}
            setGender={setTargetGender}
            isTarget={true}
            handleKeyDown={handleKeyDown}
          />
          
          {/* <OrientationSelection 
            nickname={nickname}
            orientation={targetOrientation}
            setOrientation={setTargetOrientation}
            isTarget={true}
            handleKeyDown={handleKeyDown}
          /> */}
        </>
      )}
      
      <div className="pt-6">
        <Button 
          onClick={handleSubmit} 
          disabled={
            !gender || 
            (role === "getter" && (!targetGender))
          }
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
        
        <div className="mt-8 text-xs text-gray-500 max-w-md mx-auto">
          *We're working to include more genders and sexualities, but with our small (and growing!) community, 
          we're starting simple—stay tuned as we grow! If you don't see your gender, sexuality, or your crush's 
          represented, we'd love to hear from you—please email us and help us make Perspective even better! 💌
        </div>
      </div>
    </div>
  );
};
