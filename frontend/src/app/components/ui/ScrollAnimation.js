'use client';

import React, { useEffect, useRef, useState, Children, cloneElement, isValidElement } from 'react';

/**
 * ScrollAnimation component that animates both the container and its children when they enter the viewport
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be animated
 * @param {string} props.animation - Animation type: 'fade-up', 'fade-in', 'slide-in-left', 'slide-in-right', 'scale-up'
 * @param {number} props.delay - Delay in milliseconds before animation starts (default: 0)
 * @param {number} props.duration - Animation duration in milliseconds (default: 800)
 * @param {number} props.threshold - Value between 0-1 indicating how much of the element must be visible (default: 0.1)
 * @param {string} props.className - Additional CSS classes to apply
 * @param {boolean} props.staggerChildren - Whether to stagger child animations (default: false)
 */
const ScrollAnimation = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  threshold = 0.1,
  className = '',
  staggerChildren = true,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Skip animation if there's no window (during SSR)
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: threshold,
      }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  // Animation styles based on the animation type
  const getAnimationStyle = () => {
    const baseStyle = {
      opacity: 0,
      transform: 'none',
      transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
      transitionDelay: `${delay}ms`,
    };

    const visibleStyle = {
      opacity: 1,
      transform: 'none',
      transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
      transitionDelay: `${delay}ms`,
    };

    // Initial styles based on animation type
    switch (animation) {
      case 'fade-up':
        baseStyle.transform = 'translateY(30px)';
        break;
      case 'fade-down':
        baseStyle.transform = 'translateY(-30px)';
        break;
      case 'fade-in':
        // Just opacity change, no transform needed
        break;
      case 'slide-in-left':
        baseStyle.transform = 'translateX(-50px)';
        break;
      case 'slide-in-right':
        baseStyle.transform = 'translateX(50px)';
        break;
      case 'scale-up':
        baseStyle.transform = 'scale(0.9)';
        break;
      case 'scale-down':
        baseStyle.transform = 'scale(1.1)';
        break;
      default:
        baseStyle.transform = 'translateY(20px)';
    }

    return isVisible ? visibleStyle : baseStyle;
  };

  // Animate children with optional staggering
  const animateChildren = () => {
    return Children.map(children, (child, index) => {
      if (!isValidElement(child)) return child;

      // Determine child animation delay if staggering is enabled
      const childDelay = staggerChildren ? index * 100 : 0;

      // Merge existing styles with animation styles
      const childStyle = {
        ...(child.props.style || {}),
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : (
          animation === 'fade-up' ? 'translateY(30px)' :
          animation === 'fade-down' ? 'translateY(-30px)' :
          animation === 'slide-in-left' ? 'translateX(-50px)' :
          animation === 'slide-in-right' ? 'translateX(50px)' :
          animation === 'scale-up' ? 'scale(0.9)' :
          animation === 'scale-down' ? 'scale(1.1)' :
          'translateY(20px)'
        ),
        transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
        transitionDelay: `${delay + childDelay}ms`
      };

      // Clone the child with additional animation styles
      return cloneElement(child, {
        style: childStyle,
        className: `${child.props.className || ''} ${staggerChildren ? 'stagger-children' : ''}`
      });
    });
  };

  return (
    <div
      ref={elementRef}
      className={`w-full ${className}`}
      style={{...getAnimationStyle(), width: '100%'}}
      {...props}
    >
      {animateChildren()}
    </div>
  );
};

export default ScrollAnimation;