
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

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Create a custom navigation controller
const NavigationController = () => {
  const [navDisabled, setNavDisabled] = useState(false);
  const location = useLocation();

  // Track page views in Google Analytics
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-8LC18G9X4M", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location.pathname]);

  // Listen for navigation state changes from a custom event
  useEffect(() => {
    const handleNavToggle = (event: CustomEvent) => {
      setNavDisabled(event.detail.disabled);
    };

    window.addEventListener("navToggle" as any, handleNavToggle);
    return () => {
      window.removeEventListener("navToggle" as any, handleNavToggle);
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
