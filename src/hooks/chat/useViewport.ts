
import { useState, useEffect, useRef } from "react";

export function useViewport() {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const initialLayoutSet = useRef(false);

  // Handle viewport height changes
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      window.scrollTo(0, 0);
    };
    
    const handleVisualViewportResize = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
        window.scrollTo(0, 0);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportResize);
    }
    
    window.scrollTo(0, 0);
    initialLayoutSet.current = true;
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
      }
    };
  }, []);

  return {
    viewportHeight
  };
}
