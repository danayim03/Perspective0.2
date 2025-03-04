
import { useState, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Step1Props {
  nickname: string;
  setNickname: (nickname: string) => void;
  setStep: (step: number) => void;
}

export const Step1Intro = ({ nickname, setNickname, setStep }: Step1Props) => {
  const [nicknameInputFocused, setNicknameInputFocused] = useState(false);
  
  const firstLine = "Understand your situation from another...";
  const [displayedFirstLine, setDisplayedFirstLine] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  
  useEffect(() => {
    let currentIndexFirst = 0;
    const intervalIdFirst = setInterval(() => {
      if (currentIndexFirst <= firstLine.length) {
        setDisplayedFirstLine(firstLine.slice(0, currentIndexFirst));
        currentIndexFirst++;
      } else {
        clearInterval(intervalIdFirst);
        setTypingComplete(true);
      }
    }, 30);
    
    return () => {
      clearInterval(intervalIdFirst);
    };
  }, []);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="text-center space-y-14">
      <div>
        <p className="text-gray-600 h-6 mb-4 min-w-[16rem] md:min-w-[20rem] mx-auto text-left">
          {displayedFirstLine}
        </p>
        <h1 className="text-4xl font-medium">Perspective 🍵</h1>
      </div>

      <div className="space-y-3">
        <Input 
          placeholder={nicknameInputFocused ? "" : "Enter a nickname to start chatting"}
          className="max-w-md mx-auto rounded-full bg-perspective-100 border-0 py-6 px-8 text-center"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onFocus={() => setNicknameInputFocused(true)}
          onBlur={() => setNicknameInputFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && nickname.trim()) {
              setStep(2);
            }
          }}
        />

        <Button 
          onClick={() => setStep(2)} 
          disabled={!nickname.trim()}
          className="rounded-full mx-auto bg-perspective-300 hover:bg-perspective-400 text-gray-800 font-normal"
          onKeyDown={(e) => handleKeyDown(e, () => setStep(2))}
        >
          Continue 👉
        </Button>
      </div>
    </div>
  );
};
