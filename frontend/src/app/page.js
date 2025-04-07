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

const useToolFiltering = () => {
  const [tools, setTools] = React.useState([]);
  const [selectedFilter, setSelectedFilter] = React.useState('personal');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  
  const fetchTools = React.useCallback(async () => {
    try {
      // Reset category when switching to personal
      if (selectedFilter === 'personal') {
        setSelectedCategory('');
      }

      const response = await fetch(`/api/tools?type=${selectedFilter}${selectedCategory ? `&sector=${selectedCategory}` : ''}`);

      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }

      const data = await response.json();
      console.log('Fetched tools:', data);
      setTools(data);
    } catch (error) {
      console.error('Error fetching tools:', error);
      setTools([]); // Set to empty array on error
    }
  }, [selectedFilter, selectedCategory]);

  // Modify setSelectedFilter to reset category
  const modifiedSetSelectedFilter = React.useCallback((filter) => {
    setSelectedFilter(filter);
    if (filter === 'personal') {
      setSelectedCategory('');
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools, selectedFilter, selectedCategory]);

  return {
    tools,
    selectedFilter,
    selectedCategory,
    setSelectedFilter: modifiedSetSelectedFilter,
    setSelectedCategory,
    fetchTools
  };
};

export default function Home() {
  // Use custom hooks for state management
  const {
    tools,
    selectedFilter,
    selectedCategory,
    setSelectedFilter,
    setSelectedCategory,
    fetchTools
  } = useToolFiltering();

  // Media query hook
  const isMobile = useMediaQuery();

  // Fetch tools when filter or category changes
  useEffect(() => {
    fetchTools(selectedFilter, selectedCategory);
  }, [selectedFilter, selectedCategory, fetchTools]);

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

      {/* Tool Grid */}
      <ToolGrid
        tools={tools}
        selectedFilter={selectedFilter}
        selectedCategory={selectedCategory}
      />

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