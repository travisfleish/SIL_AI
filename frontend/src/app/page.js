'use client';

import React, { useEffect, useState } from 'react';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SponsorCarousel from './components/marketing/SponsorCarousel';
import NewsletterSection from './components/marketing/NewsletterSection';
import BlogSection from './components/marketing/BlogSection';
import ToggleButtons from './components/ui/ToggleButtons';
import CategoryFilters from './components/ui/CategoryFilters';
import ToolGrid from './components/tools/ToolGrid';
import ScrollAnimation from './components/ui/ScrollAnimation';

// Import the animations CSS
import './animations.css';

// Simplified hook functionality
const useMediaQuery = () => {
  const [matches, setMatches] = React.useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(max-width: 768px)');
      setMatches(media.matches);

      const listener = (e) => setMatches(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  return matches;
};

// Import useToolFiltering hook (updated version with loading/error states)
import { useToolFiltering } from './hooks/useToolFiltering';

// Simple Header Component that works on mobile
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

// Simple Mobile Fallback Component
const MobileFallback = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setMessage("Thank you for subscribing!");
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Use SimpleHeader instead of Header */}
      <SimpleHeader />

      <main className="p-4 max-w-lg mx-auto">
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
};

export default function Home() {
  // Use custom hooks for state management with enhanced states
  const {
    tools,
    loading,
    error,
    selectedFilter,
    selectedCategory,
    setSelectedFilter,
    setSelectedCategory,
  } = useToolFiltering();

  // Media query hook
  const isMobile = useMediaQuery();

  // State to track if we're on a mobile device to trigger fallback
  const [usesMobileFallback, setUsesMobileFallback] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Check if we need to use the mobile fallback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Enable mobile fallback if screen width is below threshold
      setUsesMobileFallback(window.innerWidth < 768);
      setHasMounted(true);

      // Add global error handler
      window.onerror = function(message, source, lineno, colno, error) {
        console.error('Global error:', message, source, lineno, colno);
        return false;
      };
    }
  }, []);

  // Log status changes for debugging
  useEffect(() => {
    console.log('Current state:', {
      filter: selectedFilter,
      category: selectedCategory,
      toolCount: tools.length
    });
  }, [selectedFilter, selectedCategory, tools.length]);

  // Show loading state until client-side code has determined device type
  if (!hasMounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Render simplified mobile fallback if on mobile
  if (usesMobileFallback) {
    return <MobileFallback />;
  }

  // Regular desktop experience
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center relative">
      {/* Header Component - No animation needed */}
      <Header />

      {/* Toggle Buttons for Personal/Enterprise View */}
      <ScrollAnimation animation="fade-in" duration={800}>
        <ToggleButtons
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      </ScrollAnimation>

      {/* Category Filters for Enterprise View */}
      {selectedFilter === 'enterprise' && (
        <ScrollAnimation animation="fade-up" delay={200}>
          <CategoryFilters
            selectedFilter={selectedFilter}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isMobile={isMobile}
          />
        </ScrollAnimation>
      )}

      {/* Loading State */}
      {loading && (
        <div className="w-full p-12 flex justify-center">
          <div className="animate-pulse text-xl">Loading tools...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="w-full p-12 flex justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      )}

      {/* Tool Grid - Using ScrollAnimation */}
      {!loading && !error && (
        <ScrollAnimation animation="fade-up" delay={300} duration={1000} className="w-full">
          <ToolGrid
            tools={tools}
            selectedFilter={selectedFilter}
            selectedCategory={selectedCategory}
          />
        </ScrollAnimation>
      )}

      {/* Fixed Newsletter Section - Using ScrollAnimation */}
      <ScrollAnimation animation="fade-up" threshold={0.5} className="w-full">
        <NewsletterSection variant="fixed" />
      </ScrollAnimation>

      {/* Blog Section - Using ScrollAnimation */}
      <ScrollAnimation animation="fade-up" threshold={0.1} className="w-full">
        <BlogSection />
      </ScrollAnimation>

      {/* Footer - Quick fade in with no upward movement */}
      <ScrollAnimation animation="fade-in" duration={600} className="w-full">
        <Footer />
      </ScrollAnimation>
    </div>
  );
}