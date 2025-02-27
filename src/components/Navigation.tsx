
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="w-full fixed top-0 left-0 p-4 bg-white shadow-sm z-10 flex justify-between">
      <Link 
        to="/"
        className={`font-medium ${location.pathname === "/" ? "text-perspective-500" : "text-gray-600 hover:text-perspective-500"}`}
      >
        Home
      </Link>
      <Link 
        to="/about"
        className={`font-medium ${location.pathname === "/about" ? "text-perspective-500" : "text-gray-600 hover:text-perspective-500"}`}
      >
        About
      </Link>
    </nav>
  );
};
