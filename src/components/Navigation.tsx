
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface NavigationProps {
  disabled?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ disabled = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle home navigation with state reset
  const handleHomeClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    // When navigating home, dispatch an event to reset to welcome state
    window.dispatchEvent(new CustomEvent('resetToWelcome'));
    navigate('/');
  };
  
  return (
    <nav className="w-full fixed top-0 left-0 px-4 sm:px-6 py-3 bg-white z-20 flex justify-between font-mono shadow-sm">
      <Link 
        to="#"
        onClick={handleHomeClick}
        className={`font-medium text-sm sm:text-base ${
          location.pathname === "/" 
            ? disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-perspective-500" 
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
            ? disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-perspective-500" 
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
