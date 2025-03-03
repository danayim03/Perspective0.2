
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
    e.preventDefault();
    // Prevent default browser scroll behavior
    window.scrollTo(0, 0);
  }, { passive: false });
};
