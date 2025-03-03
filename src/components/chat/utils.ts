
export const toggleNavigation = (disabled: boolean) => {
  window.dispatchEvent(
    new CustomEvent('navToggle', { detail: { disabled } })
  );
};
