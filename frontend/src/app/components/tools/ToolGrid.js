import React from 'react';
import { DEMO_CATEGORIES } from '../../utils/constants';
import CategoryCard from './CategoryCard';
import EnterpriseToolCard from './EnterpriseToolCard';

const ToolGrid = ({
  tools,
  selectedFilter,
  selectedCategory
}) => {
  // For mobile view, check if we're on client-side and window exists
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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

  // For mobile view, render a simple card
  if (isMobile) {
    return (
      <section className="p-6 w-full">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md">
            {tools.map((tool, index) => (
              <div
                key={tool.id || index}
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
            ))}
          </div>
        </div>
      </section>
    );
  }

  // For desktop view - different layouts based on filter
  if (selectedFilter === 'personal') {
    // Personal mode: Category-based grid
    return (
      <section className="p-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {DEMO_CATEGORIES.map((demoCategory, categoryIndex) => (
            <CategoryCard
              key={demoCategory}
              category={demoCategory}
              tools={tools}
              categoryIndex={categoryIndex}
              demoCategories={DEMO_CATEGORIES}
            />
          ))}
        </div>
      </section>
    );
  } else {
    // Enterprise mode: Simple grid of tools filtered by sector
    return (
      <section className="p-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <EnterpriseToolCard
              key={tool.id || index}
              tool={tool}
            />
          ))}
        </div>
      </section>
    );
  }
};

export default ToolGrid;