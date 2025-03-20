
import { useState, KeyboardEvent } from "react";
import { Gender, User } from "@/types";
import { Step1Intro } from "./welcome/Step1Intro";
import { Step2Gender } from "./welcome/Step2Gender";

interface WelcomeScreenProps {
  onComplete: (user: Omit<User, "id">) => void;
  initialStep?: number;
  userData?: User | null;
}

export const WelcomeScreen = ({ 
  onComplete, 
  initialStep = 1,
  userData = null 
}: WelcomeScreenProps) => {
  const [gender, setGender] = useState<Gender | "">(userData?.gender || "");
  const [targetGender, setTargetGender] = useState<Gender | "">(userData?.targetGender || "");
  const [step, setStep] = useState(initialStep);
  const [nickname, setNickname] = useState("");

  // Handle form submission directly from the gender selection page
  const handleGenderSubmit = () => {
    if (!gender || !targetGender) return;

    const userData: Omit<User, "id"> = {
      gender,
      targetGender,
      // Default role to getter to maintain compatibility with existing code
      role: "getter" 
    };

    onComplete(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 p-4 font-mono">
      <div className="w-full max-w-4xl animate-fade-in">
        {step === 1 && (
          <Step1Intro 
            nickname={nickname}
            setNickname={setNickname}
            setStep={setStep}
          />
        )}
        
        {step === 2 && (
          <Step2Gender
            nickname={nickname}
            gender={gender}
            setGender={setGender}
            targetGender={targetGender}
            setTargetGender={setTargetGender}
            setStep={setStep}
            onSubmit={handleGenderSubmit}
          />
        )}
      </div>
    </div>
  );
};
