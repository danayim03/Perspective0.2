
import { KeyboardEvent } from "react";

export const handleKeyDown = (
  e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>, 
  action: () => void
) => {
  if (e.key === 'Enter') {
    action();
  }
};
