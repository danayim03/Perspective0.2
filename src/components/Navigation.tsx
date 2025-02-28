
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
  disabled?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ disabled = false }) => {
  const location = useLocation();
  
  return (
    <nav className="w-full fixed top-0 left-0 px-4 sm:px-6 py-3 bg-white z-20 flex justify-between font-mono shadow-sm">
      <Link 
        to={disabled ? "#" : "/"}
        onClick={(e) => disabled && e.preventDefault()}
        className={`font-medium text-sm sm:text-base ${
          location.pathname === "/" 
            ? "text-perspective-500" 
            : disabled 
              ? "text-gray-400 cursor-not-allowed" 
              : "text-gray-800 hover:text-perspective-500"
        }`}
      >
        Home
      </Link>
      <Link 
        to={disabled ? "#" : "/about"}
        onClick={(e) => disabled && e.preventDefault()}
        className={`font-medium text-sm sm:text-base ${
          location.pathname === "/about" 
            ? "text-perspective-500" 
            : disabled 
              ? "text-gray-400 cursor-not-allowed" 
              : "text-gray-800 hover:text-perspective-500"
        }`}
      >
        About
      </Link>
    </nav>
  );
};
