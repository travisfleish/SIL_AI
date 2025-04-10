'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const SimpleHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo in center */}
        <div className="flex-1"></div>
        <div className="flex-1 flex justify-center">
          <div className="relative h-8">
            <Image
              src="/AI_Advantage.png"
              alt="AI Advantage Logo"
              width={100}
              height={32}
              className="object-contain"
            />
          </div>
        </div>

        {/* Menu button on right */}
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute w-full bg-[#1a1f2e] shadow-md z-50 border-t border-gray-700">
          <nav className="flex flex-col py-2">
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
                className="px-6 py-3 hover:bg-[#252a39] text-base font-medium"
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

export default SimpleHeader;