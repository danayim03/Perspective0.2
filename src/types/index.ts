
export type Gender = "male" | "female" | "non-binary";
export type Orientation = "straight" | "gay" | "lesbian" | "bisexual";
export type Role = "getter" | "giver";

export interface User {
  id: string;
  role: Role;
  gender: Gender;
  orientation: Orientation;
  targetGender?: Gender; // The gender of the person they want perspective about
  targetOrientation?: Orientation; // The orientation of the person they want perspective about
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}
