export type Gender = "male" | "female" | "non-binary";
export type Orientation = "straight" | "gay" | "lesbian" | "bisexual";

// Keep role for backward compatibility with existing components
export type Role = "getter" | "giver";

export interface User {
  id: string;
  role: Role; // Keeping this for compatibility but it's no longer the primary matching criterion
  gender: Gender;
  targetGender?: Gender; // The gender of the person they want to chat with
  bubbleColor?: string; // User's preferred chat bubble color
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  bubbleColor?: string; // Optional color for the message bubble
}
