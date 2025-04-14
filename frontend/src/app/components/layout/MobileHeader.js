'use client';

import React, { useState, useEffect } from 'react';
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
      {/* Simplified header with black background */}
      <header className="relative w-full py-4 bg-black text-white shadow-sm z-20">
        <div className="flex items-center justify-between px-4">
          {/* Logo area with proper vertical alignment */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 flex items-center justify-center">
                {aiLogoLoaded ? (
                  <Image
                    src="/AI_Advantage.png"
                    alt="AI Advantage Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                    onError={() => setAiLogoLoaded(false)}
                    priority={true}
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs text-white">AI</span>
                  </div>
                )}
              </div>
              <span className="text-white font-bold text-lg mx-1">×</span>
              <div className="h-8 flex items-center">
                {silLogoLoaded ? (
                  <Image
                    src="/sil-logo.png"
                    alt="Sports Innovation Lab Logo"
                    width={70}
                    height={25}
                    className="object-contain"
                    onError={() => setSilLogoLoaded(false)}
                    priority={true}
                  />
                ) : (
                  <div className="h-8 w-[70px] bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs text-white">SIL</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu button with two parallel lines */}
          <div className="flex justify-end">
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

        {/* Dropdown menu with black background */}
        {menuOpen && (
          <div className="absolute w-full z-50">
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
        )}
      </header>

      {/* Mobile Hero Section - with adjusted padding */}
      <MobileHeroSection isMarketMap={isMarketMap} />
    </>
  );
};

// Mobile Hero Section Component with adjusted padding
const MobileHeroSection = ({ isMarketMap }) => {
  const [displayText, setDisplayText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [showSportsWord, setShowSportsWord] = useState(false);

  // Define text to type based on isMarketMap
  const fullText = isMarketMap ? "AI Marketmap" : "AI Advantage";
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

        // Show sports word with delay after typing completes
        setTimeout(() => setShowSportsWord(true), 300);
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

  // Animation styles for the bouncing word
  const bounceAnimationStyle = {
    transform: 'translateY(-20px)',
    opacity: 0,
    display: 'inline-block',
    fontWeight: 'bold',
  };

  const visibleBounceStyle = {
    transform: 'translateY(0)',
    opacity: 1,
    transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease'
  };

  // Parse display text to apply different styles
  const renderAdvantageTitle = () => {
    // Split text into parts for styling
    const aiPart = displayText.startsWith('AI') ? 'AI ' : displayText;
    const secondPart = displayText.length > 3 ? displayText.substring(3) : '';

    return (
      <>
        <span className="font-normal text-gray-900">{aiPart}</span>
        {secondPart && <span className="font-bold text-gray-900">{secondPart}</span>}
        {!typingComplete && <span className="inline-block w-[2px] h-[1em] bg-gray-900 ml-1 animate-[blink_1s_step-end_infinite]"></span>}
      </>
    );
  };

  return (
    <section className="bg-gray-100 text-gray-900 pt-16 px-4 text-center z-10">
      <h1 className="text-4xl font-bold mb-2">
        {renderAdvantageTitle()}
      </h1>
      <p className="text-base text-gray-700 font-normal flex justify-center items-center mb-5">
        Resources for{' '}
        <span
          style={{
            ...bounceAnimationStyle,
            ...(showSportsWord ? visibleBounceStyle : {})
          }}
          className="mx-1 text-blue-700"
        >
          sports
        </span>{' '}
        professionals
      </p>
    </section>
  );
};

export default MobileHeader;