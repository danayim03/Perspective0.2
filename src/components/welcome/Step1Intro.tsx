
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
        <div className="relative mx-auto max-w-xs md:max-w-sm mb-8">
          {/* Message bubble with iMessage-style arrow but using Pool Day color */}
          <div className="relative">
            <div className="bg-[#92D1FF] text-black p-4 rounded-2xl text-left shadow-sm">
              <p className="min-h-[1.5rem]">
                {displayedFirstLine}
              </p>
            </div>
            {/* Curved arrow positioned at bottom left */}
            <div className="absolute left-4 bottom-[-8px] w-3 h-3 overflow-hidden">
              <div className="absolute transform rotate-45 bg-[#92D1FF] w-4 h-4 -left-1 -top-2"></div>
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-medium">Perspective 🍵</h1>
      </div>

      <div className="space-y-3">
        <Input 
          placeholder={nicknameInputFocused ? "" : "Enter a nickname to chat"}
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
