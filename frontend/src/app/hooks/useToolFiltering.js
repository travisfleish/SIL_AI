import { useState, useMemo } from 'react';

export const useToolFiltering = (initialTools = []) => {
  const [tools, setTools] = useState(initialTools);
  const [selectedFilter, setSelectedFilter] = useState('personal');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchTools = async (filter, category) => {
    try {
      const response = await fetch(`/api/tools?type=${filter}&sector=${category || ''}`);
      const data = await response.json();

      // Randomly certify one tool if desired
      if (data.length > 0) {
        const certifiedIndex = Math.floor(Math.random() * data.length);
        data[certifiedIndex].certified = true;
      }

      setTools(data);
    } catch (error) {
      console.error("Error fetching tools:", error);
      setTools([]);
    }
  };

  // Filtered tools based on current selection
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      // For enterprise view, filter by sector
      if (selectedFilter === 'enterprise') {
        return selectedCategory
          ? tool.sector === selectedCategory
          : true;
      }

      // For personal view, return all tools
      return true;
    });
  }, [tools, selectedFilter, selectedCategory]);

  return {
    tools: filteredTools,
    selectedFilter,
    selectedCategory,
    setSelectedFilter,
    setSelectedCategory,
    fetchTools
  };
};