'use client';

import React, { useEffect, useState } from 'react';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ToggleButtons from './components/ui/ToggleButtons';
import CategoryFilters from './components/ui/CategoryFilters';
import ToolGrid from './components/tools/ToolGrid';
import NewsletterSection from './components/marketing/NewsletterSection';
import BlogSection from './components/marketing/BlogSection';

// Import the animations CSS
import './animations.css';

// Simplified media query hook with safer mobile detection
const useMediaQuery = () => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Set initial value based on window width
    if (typeof window !== 'undefined') {
      setMatches(window.innerWidth < 768);

      // Add resize listener with debounce for performance
      let resizeTimer;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setMatches(window.innerWidth < 768);
        }, 100);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return matches;
};

// Import useToolFiltering hook (updated version with loading/error states)
import { useToolFiltering } from './hooks/useToolFiltering';

// Error boundary component for catching and reporting errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // You could log this error to a service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-800 rounded-lg m-4">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">We're sorry, but there was an error loading this page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Home() {
  // State to track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  // State to track if initial render is complete (avoid animations on first load)
  const [isInitialRender, setIsInitialRender] = useState(true);

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

  // Check for mobile once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);

      // After initial render is complete, set isInitialRender to false
      setTimeout(() => {
        setIsInitialRender(false);
      }, 500);

      // Setup error logging
      window.onerror = function(message, source, lineno, colno, error) {
        console.error('Global error:', {message, source, lineno, colno, error});
        return false;
      };
    }
  }, []);

  // Get responsive state
  const isMobileView = useMediaQuery();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center relative">
        {/* Header Component - No animation needed */}
        <Header />

        {/* Toggle Buttons for Personal/Enterprise View - No animations on mobile */}
        <div className="w-full">
          <ToggleButtons
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        {/* Category Filters for Enterprise View - No animations on mobile */}
        {selectedFilter === 'enterprise' && (
          <div className="w-full">
            <CategoryFilters
              selectedFilter={selectedFilter}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              isMobile={isMobileView}
            />
          </div>
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

        {/* Tool Grid - No animations on mobile */}
        {!loading && !error && (
          <div className="w-full">
            <ToolGrid
              tools={tools}
              selectedFilter={selectedFilter}
              selectedCategory={selectedCategory}
            />
          </div>
        )}

        {/* Fixed Newsletter Section - No animations on mobile */}
        <div className="w-full">
          <NewsletterSection variant="fixed" />
        </div>

        {/* Blog Section - No animations on mobile */}
        <div className="w-full">
          <BlogSection />
        </div>

        {/* Footer - No animations */}
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
}