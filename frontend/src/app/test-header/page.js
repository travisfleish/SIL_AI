'use client';

import React from 'react';

// Extremely simplified header with no images, refs, or complex styling
const SimpleHeader = () => {
  return (
    <header className="w-full bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold">AI Advantage</span>
        </div>

        <nav className="hidden sm:block">
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">Menu Item 1</a></li>
            <li><a href="#" className="hover:underline">Menu Item 2</a></li>
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

export default function TestHeaderPage() {
  return (
    <div className="min-h-screen bg-white">
      <SimpleHeader />

      <main className="p-4">
        <h1 className="text-2xl font-bold my-4">Header Test Page</h1>
        <p>This page uses a simplified header component.</p>
      </main>
    </div>
  );
}