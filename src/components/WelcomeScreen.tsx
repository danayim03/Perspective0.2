
import { useState, KeyboardEvent } from "react";
import { Gender, Orientation, Role, User } from "@/types";
import { Step1Intro } from "./welcome/Step1Intro";
import { Step2Role } from "./welcome/Step2Role";
import { Step3Profile } from "./welcome/Step3Profile";

interface WelcomeScreenProps {
  onComplete: (user: Omit<User, "id">) => void;
}

export const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [role, setRole] = useState<Role | "">("");
  const [gender, setGender] = useState<Gender | "">("");
  const [orientation, setOrientation] = useState<Orientation | "">("");
  const [targetGender, setTargetGender] = useState<Gender | "">("");
  const [targetOrientation, setTargetOrientation] = useState<Orientation | "">("");
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");

  const handleSubmit = () => {
    if (!role || !gender) return;

    const userData: Omit<User, "id"> = {
      role,
      gender,
    };

    if (role === "getter" && targetGender) {
      userData.targetGender = targetGender;
    }

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
          <Step2Role 
            nickname={nickname}
            setRole={setRole}
            setStep={setStep}
          />
        )}
        
        {step === 3 && (
          <Step3Profile 
            nickname={nickname}
            role={role as Role}
            gender={gender}
            setGender={setGender}
            orientation={orientation}
            setOrientation={setOrientation}
            targetGender={targetGender}
            setTargetGender={setTargetGender}
            targetOrientation={targetOrientation}
            setTargetOrientation={setTargetOrientation}
            handleSubmit={handleSubmit}
            setStep={setStep}
          />
        )}
      </div>
    </div>
  );
};
