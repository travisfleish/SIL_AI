'use client';

import React from 'react';

const SimpleHeader = () => {
  return (
    <header className="w-full bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold">AI Advantage</span>
        </div>

        <nav className="hidden sm:block">
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">AI Marketmap</a></li>
            <li><a href="https://www.twinbrain.ai/blog" target="_blank" rel="noopener noreferrer" className="hover:underline">AI Blog</a></li>
          </ul>
        </nav>
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-4xl font-bold">AI Advantage Resources</h1>
        <p className="mt-2">Discover the best AI tools for sports professionals</p>
      </div>
    </header>
  );
};

export default SimpleHeader;