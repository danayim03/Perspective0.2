
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

interface WelcomeScreenProps {
  onComplete: (user: Omit<User, "id">) => void;
}

export const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [role, setRole] = useState<Role | "">("");
  const [gender, setGender] = useState<Gender | "">("");
  const [orientation, setOrientation] = useState<Orientation | "">("");
  const [targetGender, setTargetGender] = useState<Gender | "">("");
  const [targetOrientation, setTargetOrientation] = useState<Orientation | "">("");

  const handleSubmit = () => {
    if (role && gender && orientation) {
      onComplete({
        role,
        gender,
        orientation,
        ...(role === "getter" && {
          targetGender,
          targetOrientation,
        }),
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-perspective-100 to-perspective-200 p-4">
      <Card className="w-full max-w-md p-8 backdrop-blur-lg bg-white/90 rounded-2xl shadow-xl animate-fade-in">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">Perspective</h1>
            <p className="text-gray-600">Share your perspective or get advice</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                I want to...
              </label>
              <Select onValueChange={(value) => setRole(value as Role)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="getter">
                    💡 Get perspective about my situation
                  </SelectItem>
                  <SelectItem value="giver">
                    🍵 Give perspective to others
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                I identify as
              </label>
              <Select onValueChange={(value) => setGender(value as Gender)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                My orientation is
              </label>
              <Select
                onValueChange={(value) => setOrientation(value as Orientation)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your orientation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight">Straight</SelectItem>
                  <SelectItem value="gay">Gay</SelectItem>
                  <SelectItem value="lesbian">Lesbian</SelectItem>
                  <SelectItem value="bisexual">Bisexual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "getter" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    My crush identifies as
                  </label>
                  <Select
                    onValueChange={(value) => setTargetGender(value as Gender)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select their gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Their orientation is
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setTargetOrientation(value as Orientation)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select their orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="straight">Straight</SelectItem>
                      <SelectItem value="gay">Gay</SelectItem>
                      <SelectItem value="lesbian">Lesbian</SelectItem>
                      <SelectItem value="bisexual">Bisexual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button
              onClick={handleSubmit}
              disabled={
                !role ||
                !gender ||
                !orientation ||
                (role === "getter" && (!targetGender || !targetOrientation))
              }
              className="w-full bg-perspective-500 hover:bg-perspective-600 text-white transition-all duration-300"
            >
              {role === "getter" ? "Get Perspective" : "Give Perspective"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
