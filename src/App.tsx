
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { Navigation } from "./components/Navigation";

const queryClient = new QueryClient();

// Create a custom navigation controller
const NavigationController = () => {
  const [navDisabled, setNavDisabled] = useState(false);
  const location = useLocation();

  // Listen for navigation state changes from a custom event
  useEffect(() => {
    // Define event handler for enabling/disabling navigation
    const handleNavToggle = (event: CustomEvent) => {
      setNavDisabled(event.detail.disabled);
    };

    // Define event handler for when resetToWelcome is dispatched
    const handleResetToWelcome = () => {
      console.log("App caught resetToWelcome event");
      // Make sure navigation is enabled when resetting
      setNavDisabled(false);
    };

    // Add event listeners
    window.addEventListener('navToggle' as any, handleNavToggle);
    window.addEventListener('resetToWelcome', handleResetToWelcome);

    // Clean up
    return () => {
      window.removeEventListener('navToggle' as any, handleNavToggle);
      window.removeEventListener('resetToWelcome', handleResetToWelcome);
    };
  }, []);

  return (
    <>
      <Navigation disabled={navDisabled} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <NavigationController />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
