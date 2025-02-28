
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="w-full fixed top-0 left-0 px-4 sm:px-6 py-3 bg-white z-20 flex justify-between font-mono shadow-sm">
      <Link 
        to="/"
        className={`font-medium text-sm sm:text-base ${location.pathname === "/" ? "text-perspective-500" : "text-gray-800 hover:text-perspective-500"}`}
      >
        Home
      </Link>
      <Link 
        to="/about"
        className={`font-medium text-sm sm:text-base ${location.pathname === "/about" ? "text-perspective-500" : "text-gray-800 hover:text-perspective-500"}`}
      >
        About
      </Link>
    </nav>
  );
};
