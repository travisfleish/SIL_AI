import React from 'react';
import Image from 'next/image';
import { DEMO_CATEGORIES } from '../../utils/constants';
import CategoryCard from './CategoryCard';
import EnterpriseToolCard from './EnterpriseToolCard';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const ToolGrid = ({ tools, selectedFilter, selectedCategory }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const sectionAnimation = useScrollAnimation({
    animation: 'fade-in',
    duration: 600,
    threshold: 0.05,
  });

  if (!tools || tools.length === 0) {
    return (
      <section className="p-6 w-full">
        <div className="flex justify-center items-center min-h-[300px]">
          <p className="text-gray-500 text-lg">
            {tools
              ? 'No tools found matching your criteria.'
              : 'Loading tools...'}
          </p>
        </div>
      </section>
    );
  }

  const ToolCard = ({ tool, index }) => {
    const animation = useScrollAnimation({
      animation: 'fade-up',
      delay: index * 100,
      duration: 600,
      threshold: 0.1,
    });

    return (
      <div
        ref={animation.ref}
        style={animation.style}
        className="mb-6 p-4 border rounded-lg shadow-lg bg-white flex flex-col items-center text-center"
      >
        <Image
          src={tool.screenshot_url || '/default-screenshot.png'}
          alt={`${tool.name} Screenshot`}
          width={400}
          height={250}
          className="w-full h-auto rounded-lg mb-4 object-cover"
        />
        <h3 className="text-lg font-bold">{tool.name}</h3>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1 mb-2">
          {selectedFilter === 'personal'
            ? tool.category ||
              DEMO_CATEGORIES[index % DEMO_CATEGORIES.length]
            : tool.sector || ''}
        </span>
        <p className="text-gray-600 text-center">{tool.short_description}</p>
      </div>
    );
  };

  const CategoryCardWrapper = ({ category, index }) => {
    const animation = useScrollAnimation({
      animation: 'fade-up',
      delay: index * 100,
      duration: 800,
      threshold: 0.1,
    });

    return (
      <div ref={animation.ref} style={animation.style}>
        <CategoryCard
          category={category}
          tools={tools}
          categoryIndex={index}
          demoCategories={DEMO_CATEGORIES}
        />
      </div>
    );
  };

  const EnterpriseCard = ({ tool, index }) => {
    const animation = useScrollAnimation({
      animation: 'fade-up',
      delay: index * 100,
      duration: 800,
      threshold: 0.1,
    });

    return (
      <div ref={animation.ref} style={animation.style}>
        <EnterpriseToolCard tool={tool} />
      </div>
    );
  };

  // Mobile layout
  if (isMobile) {
    return (
      <section
        className="p-6 w-full"
        ref={sectionAnimation.ref}
        style={sectionAnimation.style}
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md">
            {tools.map((tool, index) => (
              <ToolCard key={tool.id || index} tool={tool} index={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop - personal view
  if (selectedFilter === 'personal') {
    return (
      <section
        className="p-6 w-full"
        ref={sectionAnimation.ref}
        style={sectionAnimation.style}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {DEMO_CATEGORIES.map((category, index) => (
            <CategoryCardWrapper
              key={category}
              category={category}
              index={index}
            />
          ))}
        </div>
      </section>
    );
  }

  // Desktop - enterprise view
  return (
    <section
      className="p-8 w-full"
      ref={sectionAnimation.ref}
      style={sectionAnimation.style}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {tools.map((tool, index) => (
          <EnterpriseCard key={tool.id || index} tool={tool} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ToolGrid;
