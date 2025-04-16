import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Red_Hat_Display } from 'next/font/google';
import MobileMenu from './MobileMenu';

// Configure font
const redHat = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['700'],  // You can adjust weights as needed
  display: 'swap',
});

// Header component
const Header = ({ onMenuToggle, isMarketMap = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef(null);

  // State for typing animation
  const [displayText, setDisplayText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);

  // State for animated word
  const [showSportsWord, setShowSportsWord] = useState(false);

  // Define text to type based on isMarketMap
  const fullText = isMarketMap ? "AI Marketmap" : "AI Advantage Resources";
  const typingSpeed = 100; // milliseconds per character

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
        setTimeout(() => setShowSportsWord(true), 400);
      }
    };

    // Start typing animation after a short delay
    const startDelay = setTimeout(() => {
      typeText();
    }, 500);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      clearTimeout(startDelay);
    };
  }, [fullText]);

  // Navigation items
  const navItems = [
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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle menu handler
  const toggleMenu = () => {
    const newMenuState = !menuOpen;
    setMenuOpen(newMenuState);
    onMenuToggle?.(newMenuState);
  };

  // Parse display text to apply different styles for marketmap
  const renderMarketmapTitle = () => {
    // Split "AI Marketmap" into parts for styling
    const aiPart = displayText.startsWith('AI') ? 'AI ' : displayText;
    const marketmapPart = displayText.length > 3 ? displayText.substring(3) : '';

    return (
      <>
        <span className="font-normal text-white">{aiPart}</span>
        {marketmapPart && <span className="font-bold text-white">{marketmapPart}</span>}
        {!typingComplete && <span className="inline-block w-[2px] h-[1em] bg-white ml-1 animate-[blink_1s_step-end_infinite]"></span>}
      </>
    );
  };

  // Parse display text to apply different styles for advantage resources
  const renderAdvantageTitle = () => {
    // Split "AI Advantage Resources" into parts for styling
    const aiPart = displayText.startsWith('AI') ? 'AI ' : displayText;
    const advantagePart = displayText.length > 3 && displayText.includes('Advantage')
      ? 'Advantage ' : '';
    const resourcesPart = displayText.includes('Resources') ? 'Resources' : '';

    // Calculate where each part starts in the string
    const advantageStart = fullText.indexOf('Advantage');
    const resourcesStart = fullText.indexOf('Resources');

    return (
      <>
        <span className="font-normal text-white">{aiPart}</span>
        {displayText.length > advantageStart && (
          <span className="font-bold text-white">
            {displayText.substring(advantageStart, resourcesStart).trim() + ' '}
          </span>
        )}
        {displayText.length > resourcesStart && (
          <span className="font-normal text-white">
            {displayText.substring(resourcesStart)}
          </span>
        )}
        {!typingComplete && <span className="inline-block w-[2px] h-[1em] bg-white ml-1 animate-[blink_1s_step-end_infinite]"></span>}
      </>
    );
  };

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

  return (
    <header
      ref={headerRef}
      className="relative w-full text-white shadow-lg px-4 pt-0 pb-8 md:pt- md:pb-20"
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Image and Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/SIL_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)',
          zIndex: 0
        }}
      />

      {/* Dark overlay to ensure text is readable */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1
        }}
      />

      {/* Content container */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {/* Top: Logo + Hamburger + Nav */}
        <div className="flex items-center justify-between w-full mb-6 md:mb-8">
          {/* Left: Combined Logos */}
          <div className="flex items-center ml-8">
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src="/AI_Advantage.png"
                  alt="AI Advantage Logo"
                  width={isMobile ? 40 : 140}
                  height={isMobile ? 40 : 80}
                  className="object-contain relative top-0"
                  style={{ transform: 'translateY(5px)' }} // Fine-tune vertical position
                />
              </div>
            </Link>
            <span className="text-white font-bold text-2xl mx-4 ml-2.5">×</span>
            <a
              href="https://www.sportsilab.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
              style={{ transform: 'translateY(-4px)' }}
            >
              <Image
                src="/sil-logo.png"
                alt="Sports Innovation Lab Logo"
                width={isMobile ? 70 : 140}
                height={isMobile ? 25 : 60}
                className="object-contain"
              />
            </a>
            <span className="text-white font-bold text-2xl mx-4 ml-2.5">×</span>
            <a
              href="https://www.microsoft.com/en-us/garage/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Image
                src="/microsoft-logo.png"
                alt="Microsoft Logo"
                width={isMobile ? 70 : 50}
                height={isMobile ? 25 : 60}
                className="object-contain"
                style={{ transform: 'translateY(-4px)' }}
              />
            </a>
          </div>
          {/* Desktop Nav - UPDATED: Changed text sizes to be much larger */}
          <nav className="hidden sm:flex gap-6 text-xl sm:text-2xl md:text-xl text-white font-semibold mr-16">
            {navItems.map((item) => {
              // Check if this is an internal route
              if (!item.target) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={item.onClick}
                    className="hover:underline"
                  >
                    {item.label}
                  </Link>
                );
              }

              // External links remain as <a> tags
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.target}
                  rel={item.rel}
                  onClick={item.onClick}
                  className="hover:underline"
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Mobile Hamburger */}
          <div className="sm:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Title Section with Typing Animation */}
        <div className="text-center mt-4 pb-8 md:pb-12">
          <h1 className={`${redHat.className} text-5xl sm:text-7xl md:text-7xl leading-tight mt-15 mb-3 tracking-tight`}>
            {isMarketMap ? renderMarketmapTitle() : renderAdvantageTitle()}
          </h1>

          {/* Subtitle with animated sports word */}
          <p className={`hidden sm:block text-lg sm:text-xl md:text-2xl mt-2 font-light transition-opacity duration-1000 ${typingComplete ? 'opacity-100' : 'opacity-0'}`}>
            {isMarketMap ? (
              <>
                Explore the AI tools ecosystem for{' '}
                <span
                  style={{
                    ...bounceAnimationStyle,
                    ...(showSportsWord ? visibleBounceStyle : {})
                  }}
                >
                  sports
                </span>{' '}
                professionals
              </>
            ) : (
              <>
                Discover the best AI tools for{' '}
                <span
                  style={{
                    ...bounceAnimationStyle,
                    ...(showSportsWord ? visibleBounceStyle : {})
                  }}
                >
                  sports
                </span>{' '}
                professionals
              </>
            )}
          </p>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        headerRef={headerRef}
        navItems={navItems}
      />
    </header>
  );
};

export default Header;