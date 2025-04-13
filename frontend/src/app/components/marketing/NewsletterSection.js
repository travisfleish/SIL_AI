'use client';

import React, { useState, useEffect } from 'react';
import useNewsletterForm from '../../hooks/useNewsletterForm';

const NewsletterSection = ({ variant = "fixed", onClose }) => {
  // Keep your existing component code...
  const [isMobile, setIsMobile] = useState(false);

  // Use the enhanced newsletter form hook
  const {
    email,
    setEmail,
    message,
    isSubmitting,
    isSuccess,
    error,
    handleSubscribe,
    runDiagnostic,
    debugInfo
  } = useNewsletterForm();

  // Add debug mode state
  const [showDebug, setShowDebug] = useState(false);

  // Your existing useEffect for mobile detection...
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

  // Add toggle debug function
  const toggleDebug = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!showDebug) {
      await runDiagnostic();
    }
    setShowDebug(!showDebug);
  };

  // Keep your existing component variables and styles...
  const wrapperClasses = isFixed
    ? `w-full ${isMobile ? 'py-8' : 'py-40'} flex flex-col items-center shadow-md mt-10 px-4 sm:px-8 relative overflow-hidden`
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

  // Your existing style classes...

  return (
    <section
      id={sectionId}
      className={wrapperClasses}
      style={wrapperStyles}
    >
      {/* Background */}
      <div style={bgStyles}></div>

      {/* Centered Header */}
      <div className="text-center mb-2 sm:mb-8 relative z-10">
        <h2 className={headingClass}>
           Don&apos;t Miss an AI Beat!
        </h2>
      </div>

      {/* Content container - reduced spacing for mobile */}
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center relative z-10 px-4 sm:px-8 lg:px-12">
        {/* Subtext - vertically aligned with form */}
        <div className="md:w-1/2 mb-3 md:mb-0 md:pr-6 text-white flex items-center text-center">
          <p className={subtextClass}>
            Sign up for more AI news, events, and resources from Sports Innovation Lab.
          </p>
        </div>

        {/* Right section - Form */}
        <div className="md:w-1/2 w-full">
          <form
            className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2'}`}
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className={buttonClass}
              style={isFloating ? { animation: 'pulse 2s infinite' } : {}}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Request Now"}
            </button>
          </form>

          {message && (
            <p className={`text-sm sm:text-base mt-2 font-medium text-center sm:text-left ${isSuccess ? 'text-green-300' : 'text-white'}`}>
              {message}
            </p>
          )}

          {/* Debug panel - hidden by default */}
          <div className="w-full mt-4">
            {/* Hidden debug trigger - subtle on the page */}
            <button
              onClick={toggleDebug}
              className="text-[8px] text-gray-400 opacity-30 hover:opacity-100 transition-opacity"
              aria-label={showDebug ? "Hide diagnostic information" : "Show diagnostic information"}
            >
              Diagnostic
            </button>

            {showDebug && (
              <div className="mt-2 p-3 bg-black/70 text-gray-300 rounded text-xs overflow-auto max-h-40">
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold text-xs">Diagnostic Information</h4>
                  <button
                    onClick={runDiagnostic}
                    className="text-xs underline text-blue-300"
                  >
                    Refresh
                  </button>
                </div>
                {debugInfo ? (
                  <pre className="text-[10px] whitespace-pre-wrap">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                ) : (
                  <p>No diagnostic information available</p>
                )}
              </div>
            )}
          </div>
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