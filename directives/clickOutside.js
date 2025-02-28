export const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      // Check if the click was outside the element
      if (!(el === event.target || el.contains(event.target))) {
        // Call the provided function
        binding.value(event);
      }
    };
    document.addEventListener('click', el._clickOutside);
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside);
  }
};