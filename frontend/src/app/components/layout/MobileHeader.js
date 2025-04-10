'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  // Navigation items
  const navItems = [
    {
      label: "AI Marketmap",
      href: "#",
      onClick: (e) => e.preventDefault()
    },
    {
      label: "AI Blog",
      href: "https://www.twinbrain.ai/blog",
      target: "_blank",
      rel: "noopener noreferrer"
    }
  ];

   return (
    <header className="relative w-full bg-[#121620] text-white shadow-lg">
      {/* Main header bar */}
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="relative h-14 w-14 flex items-center justify-center">
            {imageLoaded ? (
              <img
                src="/AI_Advantage.png"
                alt="AI Advantage Logo"
                className="max-h-full max-w-full object-contain"
                onError={() => setImageLoaded(false)}
              />
            ) : (
              <span className="text-xl font-bold">AI</span>
            )}
          </div>
        </div>

        {/* Empty middle space */}
        <div className="flex-1"></div>

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

      {/* Dropdown menu - now same color as header with no border */}
      {menuOpen && (
        <div className="absolute w-full bg-[#121620] shadow-md z-50">
          <nav className="flex flex-col py-3">
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
                className="px-6 py-4 hover:bg-[#1e2433] text-base font-medium text-center"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;