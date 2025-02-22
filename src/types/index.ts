
export type Gender = "male" | "female" | "non-binary";
export type Orientation = "straight" | "gay" | "lesbian" | "bisexual";

export interface User {
  id: string;
  gender: Gender;
  orientation: Orientation;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}
