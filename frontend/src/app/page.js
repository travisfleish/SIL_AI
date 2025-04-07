'use client';

import React, { useEffect } from 'react';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SponsorCarousel from './components/marketing/SponsorCarousel';
import NewsletterSection from './components/marketing/NewsletterSection';
import YouTubeSection from './components/marketing/YouTubeSection';
import ToggleButtons from './components/ui/ToggleButtons';
import CategoryFilters from './components/ui/CategoryFilters';
import ToolGrid from './components/tools/ToolGrid';
import CollapsibleChatbot from './components/tools/CollapsibleChatbot';

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

  // Log status changes for debugging
  useEffect(() => {
    console.log('Current state:', {
      filter: selectedFilter,
      category: selectedCategory,
      toolCount: tools.length
    });
  }, [selectedFilter, selectedCategory, tools.length]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center relative">
      {/* Header Component */}
      <Header />

      {/* Sponsor Carousel */}
      <SponsorCarousel />

      {/* Toggle Buttons for Personal/Enterprise View */}
      <ToggleButtons
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* Category Filters for Enterprise View */}
      {selectedFilter === 'enterprise' && (
        <CategoryFilters
          selectedFilter={selectedFilter}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isMobile={isMobile}
        />
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

      {/* Tool Grid */}
      {!loading && !error && (
        <ToolGrid
          tools={tools}
          selectedFilter={selectedFilter}
          selectedCategory={selectedCategory}
        />
      )}

      {/* Fixed Newsletter Section */}
      <NewsletterSection variant="fixed" />

      {/* YouTube Section */}
      <YouTubeSection />

      {/* Footer */}
      <Footer />

      {/* Collapsible Chatbot */}
      <CollapsibleChatbot />
    </div>
  );
}