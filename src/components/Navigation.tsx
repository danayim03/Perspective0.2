
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
    e.preventDefault();
    
    if (disabled) {
      return;
    }
    
    // When navigating home, always dispatch the resetToWelcome event
    // This ensures we always go back to the welcome screen
    console.log("Home button clicked, dispatching resetToWelcome event");
    window.dispatchEvent(new CustomEvent('resetToWelcome'));
    
    // If we're not already on the home page, navigate there
    if (location.pathname !== '/') {
      navigate('/');
    }
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
