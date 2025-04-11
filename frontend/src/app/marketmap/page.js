'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/layout/Footer';
import BlogSection from '../components/marketing/BlogSection';
import { Inter } from 'next/font/google';
import { Download } from 'lucide-react';
import useMediaQuery from '../hooks/useMediaQuery';
import ScrollAnimation from '../components/ui/ScrollAnimation';

// Configure font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function MarketMapPage() {
  const isMobile = useMediaQuery();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  // Magnification parameters
  const zoom = 2.0;
  const magnifierSize = 300;

  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (containerRef.current && !isMobile && magnifierEnabled) {
      const { left, top } = containerRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      setPosition({ x, y });
    }
  };

  // Toggle magnifier on/off
  const toggleMagnifier = () => {
    setMagnifierEnabled(!magnifierEnabled);
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    // Create a link element
    const link = document.createElement('a');
    // Set the href to the PDF file path
    link.href = '/AI_For_Sports_Market_Map.pdf';
    // Set download attribute with filename
    link.download = 'AI_For_Sports_Market_Map.pdf';
    // Append to document
    document.body.appendChild(link);
    // Trigger click
    link.click();
    // Remove link from document
    document.body.removeChild(link);
  };

  return (
          <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#2a50a3" }}>
      {/* Header with background */}
      <header className="w-full relative text-white shadow-lg">
        {/* Background Image and Overlay */}
        <div className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/SIL_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%)',
          }}
        />
        <div className="absolute inset-0 bg-black/70 z-1" />

        <div className="relative z-10 px-4 py-6 mb-6">
          {/* Top: Logo + Nav */}
          <div className="flex items-center justify-between w-full mb-6">
            {/* Left: Combined Logos */}
            <div className="flex items-center space-x-3 ml-8 mt-5">
              <Link href="/" className="transition-opacity hover:opacity-90">
                <Image
                  src="/AI_Advantage.png"
                  alt="AI Advantage Logo"
                  width={isMobile ? 40 : 100}
                  height={isMobile ? 40 : 80}
                />
              </Link>
              <span className="text-white font-bold text-xl">×</span>
              <a
                href="https://www.sportsilab.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/sil-logo.png"
                  alt="Sports Innovation Lab Logo"
                  width={isMobile ? 70 : 140}
                  height={isMobile ? 25 : 60}
                />
              </a>
            </div>

            {/* Navigation links */}
            <nav className="hidden sm:flex gap-6 mr-10 text-lg text-white font-semibold">
              <Link href="/" className="hover:text-blue-300 transition-colors">Home</Link>
              <Link href="/marketmap" className="text-blue-300">AI Marketmap</Link>
              <a href="https://www.twinbrain.ai/blog" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">AI Blog</a>
            </nav>
          </div>

          {/* Title and Magnifier Button */}
          <ScrollAnimation animation="fade-down" duration={800}>
            <div className="text-center mb-6">
              <h1 className={`${inter.className} text-4xl sm:text-5xl font-semibold tracking-tight mt-12 mb-15`}>
                AI For Sports <span className="font-extrabold">Marketmap</span>
              </h1>

              {/* Toggle Magnifier Button */}
              <div className="mt-4">
                <button
                  onClick={toggleMagnifier}
                  className={`px-4 py-2 rounded-lg transition-colors ${magnifierEnabled ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold shadow-md cursor-pointer`}
                >
                  {magnifierEnabled ? 'Disable Magnifying Glass' : 'Enable Magnifying Glass'}
                </button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full flex flex-col flex-1" style={{ backgroundColor: "#2a50a3" }}>
        {/* Interactive SVG Map */}
        <ScrollAnimation animation="fade-up" delay={200} duration={1000}>
          <div className="w-full">
            <div
              ref={containerRef}
              className="relative w-full h-full"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => magnifierEnabled && setIsHovering(true)}
              onMouseLeave={() => magnifierEnabled && setIsHovering(false)}
            >
              {/* Base SVG image */}
              <img
                src="/AI_For_Sports_Market_Map.svg"
                alt="AI For Sports Market Map"
                className="w-full h-auto"
                style={{ display: 'block' }}
              />

              {/* Magnifying glass effect - only shown when enabled */}
              {magnifierEnabled && isHovering && !isMobile && (
                <div
                  className="absolute rounded-full pointer-events-none overflow-hidden"
                  style={{
                    width: `${magnifierSize}px`,
                    height: `${magnifierSize}px`,
                    left: `${position.x - magnifierSize/2}px`,
                    top: `${position.y - magnifierSize/2}px`,
                    border: '3px solid white',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                    zIndex: 25
                  }}
                >
                  {/* Using a direct div with background-position for more reliable zooming */}
                  <div
                    style={{
                      width: `${magnifierSize}px`,
                      height: `${magnifierSize}px`,
                      backgroundImage: `url('/AI_For_Sports_Market_Map.svg')`,
                      backgroundPosition: `-${position.x * zoom - magnifierSize/2}px -${position.y * zoom - magnifierSize/2}px`,
                      backgroundSize: `${containerRef.current?.offsetWidth * zoom}px auto`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  />

                  {/* Lens effects */}
                  <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15)' }} />
                  <div
                    className="absolute rounded-full"
                    style={{
                      top: '10%',
                      left: '10%',
                      width: '25%',
                      height: '25%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                      opacity: 0.6
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </ScrollAnimation>

        {/* Instructions for mobile users */}
        {isMobile && (
          <div className="text-center p-4 bg-blue-50 mb-8 mx-4 rounded-lg shadow-sm">
            <p className="text-blue-800">
              For better viewing experience, download the PDF version of the market map below.
            </p>
          </div>
        )}

        {/* Extended area with download button */}
        <div className="py-16 relative" style={{ backgroundColor: "#2a50a3" }}>
          {/* Center the button */}
          <div className="flex justify-center">
            <button
              onClick={handleDownloadPDF}
              className="px-10 py-4 mb-10 rounded-lg transition-all bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xl shadow-lg flex items-center space-x-3 mx-auto transform hover:scale-105 duration-300 cursor-pointer"
            >
              <Download size={28} />
              <span>Download AI For Sports Market Map PDF</span>
            </button>
          </div>
        </div>

        {/* Removed Download Button Section */}
      </main>

      {/* Blog Section */}
      <div className="relative">
        <BlogSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}