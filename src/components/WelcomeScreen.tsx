
import { useState, KeyboardEvent } from "react";
import { Gender, User } from "@/types";
import { Step1Intro } from "./welcome/Step1Intro";
import { Step2Gender } from "./welcome/Step2Gender";

interface WelcomeScreenProps {
  onComplete: (user: Omit<User, "id">) => void;
}

export const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [gender, setGender] = useState<Gender | "">("");
  const [targetGender, setTargetGender] = useState<Gender | "">("");
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");

  const handleSubmit = () => {
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
          />
        )}
        
        {step === 3 && (
          <div className="text-center space-y-8">
            <h1 className="text-3xl font-medium">You're all set, {nickname}!</h1>
            <p className="text-lg">Ready to get matched with a {targetGender === "male" ? "guy" : "girl"}?</p>
            
            <div>
              <Button 
                onClick={handleSubmit} 
                className="rounded-full bg-perspective-400 hover:bg-perspective-500 text-gray-500 font-medium py-2 px-8 mt-6"
              >
                Start Chatting
              </Button>
            </div>
            
            <Button 
              onClick={() => setStep(2)} 
              variant="ghost" 
              className="text-gray-500 hover:text-gray-800"
            >
              ← Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
