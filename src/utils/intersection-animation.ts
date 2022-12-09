import { animationFadeIn, fadeInElementOnScroll } from "./animation.css";

export function animateOnIntersection(element: HTMLElement | null) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // If the element is visible
      if (entry.isIntersecting) {
        // Add the animation class
        entry.target.classList.add(animationFadeIn);
      }
    });
  });
  const elements = element?.querySelectorAll(`.${fadeInElementOnScroll}`);

  elements?.forEach((el) => {
    if (el) {
      observer.observe(el);
    }
  });
}
