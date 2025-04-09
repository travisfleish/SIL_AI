import React from 'react';
import { DEMO_CATEGORIES } from '../../utils/constants';
import CategoryCard from './CategoryCard';
import EnterpriseToolCard from './EnterpriseToolCard';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const AdvancedToolGrid = ({
  tools,
  selectedFilter,
  selectedCategory
}) => {
  // For mobile view, check if we're on client-side and window exists
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Create a container animation for the whole section
  const sectionAnimation = useScrollAnimation({
    animation: 'fade-in',
    duration: 600,
    threshold: 0.05
  });

  // Check if any tools are available
  if (!tools || tools.length === 0) {
    return (
      <section className="p-6 w-full">
        <div className="flex justify-center items-center min-h-[300px]">
          <p className="text-gray-500 text-lg">
            {tools ? "No tools found matching your criteria." : "Loading tools..."}
          </p>
        </div>
      </section>
    );
  }

  // Function to render individual tool cards with animations
  const renderToolCard = (tool, index) => {
    // Each tool gets its own animation hook
    const cardAnimation = useScrollAnimation({
      animation: 'fade-up',
      delay: index * 100, // Staggered appearance
      duration: 600,
      threshold: 0.1
    });

    return (
      <div
        key={tool.id || index}
        ref={cardAnimation.ref}
        style={cardAnimation.style}
        className="mb-6 p-4 border rounded-lg shadow-lg bg-white flex flex-col items-center text-center"
      >
        <img
          src={tool.screenshot_url || "/default-screenshot.png"}
          alt={`${tool.name} Screenshot`}
          className="w-full h-auto rounded-lg mb-4"
        />
        <h3 className="text-lg font-bold">{tool.name}</h3>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1 mb-2">
          {selectedFilter === 'personal'
            ? (tool.category || DEMO_CATEGORIES[index % DEMO_CATEGORIES.length])
            : (tool.sector || "")}
        </span>
        <p className="text-gray-600 text-center">{tool.short_description}</p>
      </div>
    );
  };

  // Function to render category cards with animations
  const renderCategoryCard = (category, index) => {
    const categoryAnimation = useScrollAnimation({
      animation: 'fade-up',
      delay: index * 100,
      duration: 800,
      threshold: 0.1
    });

    return (
      <div
        key={category}
        ref={categoryAnimation.ref}
        style={categoryAnimation.style}
      >
        <CategoryCard
          category={category}
          tools={tools}
          categoryIndex={index}
          demoCategories={DEMO_CATEGORIES}
        />
      </div>
    );
  };

  // Function to render enterprise tool cards with animations
  const renderEnterpriseCard = (tool, index) => {
    const enterpriseAnimation = useScrollAnimation({
      animation: 'fade-up',
      delay: index * 100,
      duration: 800,
      threshold: 0.1
    });

    return (
      <div
        key={tool.id || index}
        ref={enterpriseAnimation.ref}
        style={enterpriseAnimation.style}
      >
        <EnterpriseToolCard tool={tool} />
      </div>
    );
  };

  // For mobile view
  if (isMobile) {
    return (
      <section
        className="p-6 w-full"
        ref={sectionAnimation.ref}
        style={sectionAnimation.style}
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md">
            {tools.map((tool, index) => renderToolCard(tool, index))}
          </div>
        </div>
      </section>
    );
  }

  // For desktop view - different layouts based on filter
  if (selectedFilter === 'personal') {
    // Personal mode: Category-based grid - 3x3 grid for 9 categories
    return (
      <section
        className="p-6 w-full"
        ref={sectionAnimation.ref}
        style={sectionAnimation.style}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {DEMO_CATEGORIES.map((category, index) =>
            renderCategoryCard(category, index)
          )}
        </div>
      </section>
    );
  } else {
    // Enterprise mode: Grid with staggered animations for each tool card
    return (
      <section
        className="p-8 w-full"
        ref={sectionAnimation.ref}
        style={sectionAnimation.style}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {tools.map((tool, index) =>
            renderEnterpriseCard(tool, index)
          )}
        </div>
      </section>
    );
  }
};

export default AdvancedToolGrid;