'use client';

import React from 'react';
import Header from '../layout/Header';
import { useNewsletterForm } from '../../hooks/useNewsletterForm';

export default function MobileFallback() {
  const { email, setEmail, message, handleSubscribe } = useNewsletterForm();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="p-4 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold my-6 text-center">AI Advantage Resources</h1>

        <div className="mb-8">
          <div className="grid grid-cols-2 gap-2">
            <button className="py-3 bg-blue-600 text-white font-bold rounded-lg">
              Personal
            </button>
            <button className="py-3 bg-gray-200 text-gray-800 font-bold rounded-lg">
              Enterprise
            </button>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Popular AI Tools</h2>
          <p className="text-gray-700 mb-4">
            We&apos;re showing a simplified version of this page for better mobile performance.
          </p>
          <p className="text-gray-600 text-sm">
            Visit on desktop for the full experience with all tools and features.
          </p>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Stay Updated</h2>
          <p className="mb-4">Sign up for our newsletter for the latest in sports and AI.</p>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <button
              type="submit"
              className="w-full py-2 bg-yellow-500 text-white font-bold rounded"
            >
              Subscribe
            </button>
          </form>
          {message && (
            <p className="mt-2 text-center font-medium">{message}</p>
          )}
        </div>
      </main>
    </div>
  );
}