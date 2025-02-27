
import { useState } from "react";
import { Gender, Orientation, Role, User } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    if (!role || !gender || !orientation) return;

    const userData: Omit<User, "id"> = {
      role,
      gender,
      orientation,
    };

    if (role === "getter" && targetGender && targetOrientation) {
      userData.targetGender = targetGender;
      userData.targetOrientation = targetOrientation;
    }

    onComplete(userData);
  };

  const renderStep1 = () => (
    <div className="text-center space-y-8">
      <div>
        <h1 className="text-4xl font-medium mb-2">Perspective ✨</h1>
        <p className="text-gray-600">
          Curious about how your crush might think? 💭
        </p>
        <p className="text-gray-600">
          Get anonymous advice from someone who matches your crush's gender and sexuality... 🔍
        </p>
      </div>

      <div className="space-y-3">
        <Input 
          placeholder="Enter a nickname to begin chatting... 😊" 
          className="max-w-md mx-auto rounded-full bg-perspective-100 border-0 py-6 px-8 text-center"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        
        <Button 
          onClick={() => setStep(2)} 
          disabled={!nickname.trim()}
          className="rounded-full mx-auto bg-perspective-300 hover:bg-perspective-400 text-gray-800 font-normal"
        >
          Continue 👉
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="text-center space-y-8">
      <h1 className="text-3xl font-medium">Glad you're here, {nickname}! 👋</h1>
      <p className="text-lg">You are here to:</p>
      
      <div className="flex justify-center gap-4">
        <Button 
          onClick={() => {
            setRole("getter");
            setStep(3);
          }}
          className="rounded-full bg-perspective-300 hover:bg-perspective-400 text-gray-800 font-normal py-6 px-8"
        >
          Get a perspective 💡
        </Button>
        
        <Button 
          onClick={() => {
            setRole("giver");
            setStep(3);
          }}
          className="rounded-full bg-perspective-300 hover:bg-perspective-400 text-gray-800 font-normal py-6 px-8"
        >
          Give a perspective 🍵👀
        </Button>
      </div>
      
      <Button 
        onClick={() => setStep(1)} 
        variant="ghost" 
        className="text-gray-500 hover:text-gray-800"
      >
        ← Go Back
      </Button>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <h1 className="text-2xl font-medium">
        {role === "getter" 
          ? `Let me find the correct perspective for you, ${nickname}. Tell me about your crush: 💘`
          : `Tell us about yourself, ${nickname} 📝`
        }
      </h1>
      
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => setGender("male")}
            className={`rounded-full px-6 ${gender === "male" 
              ? "bg-perspective-300 text-gray-800" 
              : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
          >
            Male 👨
          </Button>
          
          <Button 
            onClick={() => setGender("female")}
            className={`rounded-full px-6 ${gender === "female" 
              ? "bg-perspective-300 text-gray-800" 
              : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
          >
            Female 👩
          </Button>
          
          <Button 
            onClick={() => setGender("non-binary")}
            className={`rounded-full px-6 ${gender === "non-binary" 
              ? "bg-perspective-300 text-gray-800" 
              : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
          >
            Non-binary 🌈
          </Button>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => setOrientation("straight")}
            className={`rounded-full px-6 ${orientation === "straight" 
              ? "bg-perspective-300 text-gray-800" 
              : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
          >
            Straight 💑
          </Button>
          
          <Button 
            onClick={() => setOrientation("gay")}
            className={`rounded-full px-6 ${orientation === "gay" 
              ? "bg-perspective-300 text-gray-800" 
              : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
          >
            Gay 🏳️‍🌈
          </Button>
          
          <Button 
            onClick={() => setOrientation("bisexual")}
            className={`rounded-full px-6 ${orientation === "bisexual" 
              ? "bg-perspective-300 text-gray-800" 
              : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
          >
            Bisexual 💖
          </Button>
        </div>
      </div>
      
      {role === "getter" && gender && orientation && (
        <div>
          <h2 className="text-xl font-medium mt-8 mb-4">Your crush is:</h2>
          
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => setTargetGender("male")}
                className={`rounded-full px-6 ${targetGender === "male" 
                  ? "bg-perspective-300 text-gray-800" 
                  : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
              >
                Male 👨
              </Button>
              
              <Button 
                onClick={() => setTargetGender("female")}
                className={`rounded-full px-6 ${targetGender === "female" 
                  ? "bg-perspective-300 text-gray-800" 
                  : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
              >
                Female 👩
              </Button>
              
              <Button 
                onClick={() => setTargetGender("non-binary")}
                className={`rounded-full px-6 ${targetGender === "non-binary" 
                  ? "bg-perspective-300 text-gray-800" 
                  : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
              >
                Non-binary 🌈
              </Button>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => setTargetOrientation("straight")}
                className={`rounded-full px-6 ${targetOrientation === "straight" 
                  ? "bg-perspective-300 text-gray-800" 
                  : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
              >
                Straight 💑
              </Button>
              
              <Button 
                onClick={() => setTargetOrientation("gay")}
                className={`rounded-full px-6 ${targetOrientation === "gay" 
                  ? "bg-perspective-300 text-gray-800" 
                  : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
              >
                Gay 🏳️‍🌈
              </Button>
              
              <Button 
                onClick={() => setTargetOrientation("bisexual")}
                className={`rounded-full px-6 ${targetOrientation === "bisexual" 
                  ? "bg-perspective-300 text-gray-800" 
                  : "bg-gray-100 text-gray-800 hover:bg-perspective-200"}`}
              >
                Bisexual 💖
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="pt-6">
        <Button 
          onClick={handleSubmit} 
          disabled={
            !gender || !orientation || 
            (role === "getter" && (!targetGender || !targetOrientation))
          }
          className="rounded-full bg-perspective-400 hover:bg-perspective-500 text-white font-medium py-2 px-8"
        >
          Proceed! 🚀
        </Button>
        
        <div className="mt-4">
          <Button 
            onClick={() => setStep(2)} 
            variant="ghost" 
            className="text-gray-500 hover:text-gray-800"
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

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 p-4 font-roboto">
      <div className="w-full max-w-4xl animate-fade-in">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};
