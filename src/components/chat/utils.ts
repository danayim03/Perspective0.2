
export const toggleNavigation = (disabled: boolean) => {
  window.dispatchEvent(
    new CustomEvent('navToggle', { detail: { disabled } })
  );
};

// Add utility for detecting iOS devices
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

// Add utility to prevent keyboard layout shifts
export const preventLayoutShift = () => {
  // This specifically targets iOS Safari
  if (isIOS()) {
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }
};
