'use client';

import React, { useState } from 'react';

const NewsletterSection = ({ variant = "fixed", onClose }) => {
  // Different styles based on variant
  const isFixed = variant === "fixed";
  const isFloating = variant === "floating";

  // Base wrapper classes and styles
  const wrapperClasses = isFixed
    ? "w-full py-24 flex flex-col items-center shadow-md mt-10 px-4 sm:px-8 relative overflow-hidden"
    : "fixed bottom-0 w-full text-white py-16 shadow-xl z-50 overflow-hidden";

  const wrapperStyles = {
    position: isFixed ? 'relative' : 'fixed',
    animation: isFloating ? 'slideUp 0.5s ease-out' : undefined
  };

  // Background div styles
  const bgStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "url('/Logo_BG.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0
  };

  // Create a unique ID for the newsletter section
  const sectionId = isFixed ? "fixed-newsletter" : "floating-newsletter";

  // State for form
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setMessage("Thank you for subscribing!");
    setEmail('');
  };

  return (
    <section
      id={sectionId}
      className={wrapperClasses}
      style={wrapperStyles}
    >
      {/* Background */}
      <div style={bgStyles}></div>

      {/* Content container */}
      <div className={`max-w-6xl w-full flex flex-col lg:flex-row items-start justify-between relative z-10 ${isFixed ? 'mt-20 mb-20' : ''} px-4 sm:px-8 lg:px-12`}>
        {/* Left section - Text */}
        <div className="lg:w-1/2 mb-8 lg:mb-0 text-left text-white">
          <h2 className="text-2xl md:text-5xl font-bold whitespace-nowrap">
            Don't Miss and AI Beat!
          </h2>
          <p className="mt-2 text-xl">
            <span className="font-semibold">Sign up for more AI news, events, and resources from Sports Innovation Lab.</span>
          </p>
        </div>

        {/* Right section - Form */}
        <div className="lg:w-1/2 w-full flex justify-end">
          <form className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 py-3 rounded-lg text-gray-900 border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-full sm:w-auto flex-grow text-base shadow-md"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition shadow-md w-full sm:w-auto whitespace-nowrap"
              style={isFloating ? { animation: 'pulse 2s infinite' } : {}}
            >
              Request Now
            </button>
          </form>
          {message && (
            <p className="text-lg mt-2 font-medium text-center sm:text-left text-white">{message}</p>
          )}
        </div>
      </div>

      {/* Close button (only for floating variant) */}
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