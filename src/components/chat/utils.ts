
export const toggleNavigation = (disabled: boolean) => {
  window.dispatchEvent(
    new CustomEvent('navToggle', { detail: { disabled } })
  );
};

// Detect iOS devices
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

// Prevent keyboard layout shifts more aggressively
export const preventLayoutShift = () => {
  document.documentElement.style.height = '100%';
  document.documentElement.style.position = 'fixed';
  document.documentElement.style.width = '100%';
  document.documentElement.style.overflow = 'hidden';
  
  document.body.style.height = '100%';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.overflow = 'auto';
  
  // Prevent scrolling to input when it gets focus
  document.addEventListener('focusin', (e) => {
    // Save current scroll position
    const scrollPos = window.scrollY;
    
    // Prevent default browser scroll behavior
    e.preventDefault();
    
    // Restore scroll position
    setTimeout(() => window.scrollTo(0, scrollPos), 10);
  }, { passive: false });
  
  // Prevent layout shift on input focus
  document.addEventListener('touchstart', (e) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') {
      // Prevent any default shifting
      const scrollPos = window.scrollY;
      setTimeout(() => window.scrollTo(0, scrollPos), 10);
    }
  }, { passive: false });
};
