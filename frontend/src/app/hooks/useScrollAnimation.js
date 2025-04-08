'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook that detects when an element is visible in the viewport
 * and triggers animations accordingly.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.animation - Animation type: 'fade-up', 'fade-in', etc.
 * @param {number} options.threshold - Percentage of element visible to trigger animation (0-1)
 * @param {number} options.delay - Delay before animation starts (ms)
 * @param {number} options.duration - Animation duration (ms)
 * @param {boolean} options.once - Whether to run the animation only once or every time it enters viewport
 * @returns {Object} - The ref to attach to your element and whether it's visible
 */
const useScrollAnimation = ({
  animation = 'fade-up',
  threshold = 0.1,
  delay = 0,
  duration = 800,
  once = true
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;

    const currentRef = elementRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        // If the element is intersecting and either:
        // 1. We want animations to repeat (once === false), or
        // 2. It hasn't been animated yet (isVisible === false)
        if (entry.isIntersecting && (!once || !isVisible)) {
          setIsVisible(true);
        } else if (!entry.isIntersecting && !once) {
          // Reset visibility if we want animations to repeat
          setIsVisible(false);
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once, isVisible]);

  // Generate the animation styles based on animation type and visibility
  const getAnimationStyles = () => {
    // Base styles
    const styles = {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'none' : '',
      transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
      transitionDelay: `${delay}ms`,
    };

    // Add transform based on animation type (when not visible)
    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          styles.transform = 'translateY(30px)';
          break;
        case 'fade-down':
          styles.transform = 'translateY(-30px)';
          break;
        case 'slide-in-left':
          styles.transform = 'translateX(-50px)';
          break;
        case 'slide-in-right':
          styles.transform = 'translateX(50px)';
          break;
        case 'scale-up':
          styles.transform = 'scale(0.9)';
          break;
        case 'scale-down':
          styles.transform = 'scale(1.1)';
          break;
        // Default is just opacity change
      }
    }

    return styles;
  };

  // Create className string for CSS-based animations
  const getAnimationClass = () => {
    const baseClass = 'animate-on-scroll';
    const typeClass = animation;
    const visibleClass = isVisible ? 'animate-visible' : '';
    const durationClass = `duration-${duration}`;
    const delayClass = delay > 0 ? `delay-${delay}` : '';

    return [baseClass, typeClass, visibleClass, durationClass, delayClass]
      .filter(Boolean)
      .join(' ');
  };

  return {
    ref: elementRef,
    isVisible,
    style: getAnimationStyles(),
    className: getAnimationClass(),
  };
};

export default useScrollAnimation;