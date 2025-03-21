export type Gender = "male" | "female" | "non-binary";

export interface User {
  id: string;
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
