'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const MobileHeader = ({ isMarketMap = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aiLogoLoaded, setAiLogoLoaded] = useState(true);
  const [silLogoLoaded, setSilLogoLoaded] = useState(true);

  // Navigation items
  const navItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "AI Marketmap",
      href: "/marketmap",
      onClick: (e) => {
        if (window.location.pathname === "/marketmap") {
          e.preventDefault();
        }
      }
    },
    {
      label: "AI Blog",
      href: "https://www.twinbrain.ai/blog",
      target: "_blank",
      rel: "noopener noreferrer"
    }
  ];

  return (
    <>
      {/* Fixed-height header with black background */}
      <header className="relative w-full h-[60px] py-0 bg-black text-white shadow-sm z-20 flex items-center">
        <div className="flex items-center justify-between px-4 w-full">
          {/* Logo area with three-column layout */}
          <div className="flex items-center w-1/3">
            {/* SIL Logo - On the left */}
            <div className="flex items-center h-[40px]">
              {silLogoLoaded ? (
                <Image
                  src="/sil-logo.png"
                  alt="Sports Innovation Lab Logo"
                  width={70}
                  height={25}
                  className="object-contain w-auto h-[28px]"
                  onError={() => setSilLogoLoaded(false)}
                  priority={true}
                />
              ) : (
                <div className="h-[28px] w-[70px] bg-gray-800 rounded flex items-center justify-center">
                  <span className="text-xs text-white">SIL</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Advantage Logo - Centered */}
          <div className="flex items-center justify-center w-1/3">
            <div className="flex items-center h-[40px] mt-3.5">
              <img
                src="/AI_Advantage.png"
                alt="AI Advantage Logo"
                className="h-[120px] w-auto"
                style={{ filter: 'brightness(1.2) contrast(1.1)' }}
                onError={() => setAiLogoLoaded(false)}
              />
            </div>
          </div>

          {/* Menu button - On the right */}
          <div className="flex justify-end w-1/3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X size={28} />
              ) : (
                <div className="flex flex-col space-y-2">
                  <div className="w-7 h-0.5 bg-white"></div>
                  <div className="w-7 h-0.5 bg-white"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Dropdown menu with Tailwind CSS transitions */}
        <div
          className={`absolute w-full top-[60px] z-50 transform transition-all duration-300 ease-in-out ${
            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 z-0 bg-black"></div>

          <nav className="flex flex-col py-4 mb-4 relative z-10">
            {navItems.map((item) => (
            <a
                key={item.label}
                href={item.href}
                target={item.target}
                rel={item.rel}
                onClick={(e) => {
                  if (item.onClick) item.onClick(e);
                  setMenuOpen(false);
                }}
                className="px-6 py-3 text-white hover:bg-gray-800 text-base font-medium text-center transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Hero Section */}
      <MobileHeroSection isMarketMap={isMarketMap} />
    </>
  );
};

// Mobile Hero Section Component with updated title and subheading
const MobileHeroSection = ({ isMarketMap }) => {
  const [displayText, setDisplayText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);

  // Define text to type based on isMarketMap
  const fullText = isMarketMap ? "AI Marketmap" : "Empowering Sports Innovation";
  const typingSpeed = 80; // milliseconds per character

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    let timer;

    const typeText = () => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex));
        currentIndex++;
        timer = setTimeout(typeText, typingSpeed);
      } else {
        setTypingComplete(true);
      }
    };

    // Start typing animation after a short delay
    const startDelay = setTimeout(() => {
      typeText();
    }, 400);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      clearTimeout(startDelay);
    };
  }, [fullText]);

  // Parse display text to apply different styles
  const renderAdvantageTitle = () => {
    // Text color classes based on isMarketMap
    const textClass = isMarketMap ? "text-white" : "text-gray-900";
    const cursorColor = isMarketMap ? "bg-white" : "bg-gray-900";

    if (isMarketMap) {
      return (
        <>
          <span className={`font-normal ${textClass}`}>{displayText}</span>
          {!typingComplete && <span className={`inline-block w-[2px] h-[1em] ${cursorColor} ml-1 animate-[blink_1s_step-end_infinite]`}></span>}
        </>
      );
    } else {
      // Split the text at each character to check if we need to bold parts of it
      const parts = [];
      let innovationStarted = false;

      // Go through each character and determine if it should be bold
      // This handles the case where Innovation is partially typed
      for (let i = 0; i < displayText.length; i++) {
        const currentChar = displayText[i];

        // Check if we're starting to type "Innovation"
        if (!innovationStarted && displayText.substring(i).startsWith("I")) {
          // Check if the substring from this point could be the start of "Innovation"
          const restOfWord = "Innovation".substring(0, displayText.length - i);
          if ("Innovation".startsWith(restOfWord)) {
            innovationStarted = true;
          }
        }

        // Add the character with appropriate styling
        parts.push(
          <span
            key={i}
            className={`${innovationStarted ? 'font-bold' : 'font-normal'} ${textClass}`}
          >
            {currentChar}
          </span>
        );
      }

      return (
        <>
          {parts}
          {!typingComplete && <span className={`inline-block w-[2px] h-[1em] ${cursorColor} ml-1 animate-[blink_1s_step-end_infinite]`}></span>}
        </>
      );
    }
  };

  // Determine the background color based on isMarketMap
  const bgColorClass = isMarketMap ? "" : "bg-gray-100";

  // Create dynamic background style for marketmap
  const sectionStyle = isMarketMap ? { backgroundColor: "#213f99" } : {};

  // Define the accent color for sports/professionals
  const accentColor = isMarketMap ? 'text-yellow-400' : 'text-blue-700';

  return (
    <section
      className={`${bgColorClass} pt-16 px-4 text-center z-10`}
      style={sectionStyle}
    >
      <h1 className="text-4xl font-bold mb-8">
        {renderAdvantageTitle()}
      </h1>
      <p className={`text-base ${isMarketMap ? 'text-gray-100' : 'text-gray-700'} font-normal mb-3 mx-auto max-w-lg leading-relaxed`}>
        Top AI tools and services curated to help <span className={`${accentColor} font-bold`}>sports</span> <span className={`${accentColor} font-bold`}>professionals</span> unlock new possibilities and become leaders in their industry
      </p>
    </section>
  );
};

export default MobileHeader;