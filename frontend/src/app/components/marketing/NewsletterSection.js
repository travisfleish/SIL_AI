'use client';

import React, { useState, useEffect } from 'react';

const NewsletterSection = ({ variant = "fixed", onClose }) => {
  // Different styles based on variant
  const isFixed = variant === "fixed";
  const isFloating = variant === "floating";

  // Detect if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // This is critical to prevent page refresh

    // Don't proceed if already submitting or no email
    if (isSubmitting || !email) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      // Basic client-side validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMessage('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      // Make API call with fetch
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Get the response data
      const data = await response.json();

      // Handle success or error
      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message || 'Thank you for subscribing!');
        setEmail('');

        // Clear success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
          setMessage('');
        }, 5000);
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter submission error:', error);
      setIsSuccess(false);
      setMessage('Could not connect to our server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Base wrapper classes and styles
  const wrapperClasses = isFixed
    ? `w-full ${isMobile ? 'py-8' : 'py-40'} flex flex-col items-center shadow-md mt-10 px-4 sm:px-8 relative overflow-hidden`
    : "fixed bottom-0 w-full text-white py-16 shadow-xl z-50 overflow-hidden";

  return (
    <section
      id={isFixed ? "fixed-newsletter" : "floating-newsletter"}
      className={wrapperClasses}
      style={{
        position: isFixed ? 'relative' : 'fixed',
        animation: isFloating ? 'slideUp 0.5s ease-out' : undefined
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/Logo_BG.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      ></div>

      {/* Centered Header */}
      <div className="text-center mb-2 sm:mb-8 relative z-10">
        <h2 className={isMobile ? "text-2xl mb-3 font-bold text-white" : "text-4xl md:text-5xl mb-10 font-bold text-white"}>
           Don&apos;t Miss an AI Beat!
        </h2>
      </div>

      {/* Content container */}
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center relative z-10 px-4 sm:px-8 lg:px-12">
        {/* Subtext */}
        <div className="md:w-1/2 mb-3 md:mb-0 md:pr-6 text-white flex items-center text-center">
          <p className={isMobile ? "text-sm font-medium text-center mb-2" : "text-lg md:text-xl font-semibold text-center"}>
            Sign up for more AI news, events, and resources from Sports Innovation Lab.
          </p>
        </div>

        {/* Form */}
        <div className="md:w-1/2 w-full">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:flex-grow px-4 py-2 rounded-lg text-gray-900 border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
                disabled={isSubmitting}
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Request Now'}
              </button>
            </div>
          </form>

          {message && (
            <p className={`mt-2 text-sm sm:text-base font-medium text-center sm:text-left ${isSuccess ? 'text-green-300' : 'text-white'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Close button */}
      {isFloating && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-white hover:text-yellow-200 transition z-20"
          aria-label="Close newsletter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </section>
  );
};

export default NewsletterSection;