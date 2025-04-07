import { useState, useCallback, useEffect } from 'react';

export const useToolFiltering = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('personal');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchTools = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build the endpoint URL based on current selections
      let endpoint = `/api/tools?type=${selectedFilter}`;

      // Handle special category IDs for all tools in a group
      if (selectedCategory === 'sports_all') {
        endpoint += '&group=sports';
      }
      else if (selectedCategory === 'ai_all') {
        endpoint += '&group=ai';
      }
      else if (selectedCategory && selectedCategory !== '') {
        endpoint += `&sector=${encodeURIComponent(selectedCategory)}`;
      }

      console.log('Fetching tools from:', endpoint);

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Fetched ${data.length} tools`);

      if (data.error) {
        throw new Error(data.error);
      }

      setTools(data);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError(err.message || 'Failed to fetch tools');
      setTools([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, selectedCategory]);

  // Handle filter type change (Personal/Enterprise)
  const handleFilterChange = useCallback((filter) => {
    setSelectedFilter(filter);

    // Reset or set appropriate category when switching filters
    if (filter === 'personal') {
      setSelectedCategory('');
    } else if (filter === 'enterprise') {
      // Default to all sports tools when switching to enterprise
      setSelectedCategory('sports_all');
    }
  }, []);

  // Handle category selection change
  const handleCategoryChange = useCallback((category) => {
    console.log('Category changed to:', category);
    setSelectedCategory(category);
  }, []);

  // Fetch tools whenever the filter or category changes
  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  return {
    tools,
    loading,
    error,
    selectedFilter,
    selectedCategory,
    setSelectedFilter: handleFilterChange,
    setSelectedCategory: handleCategoryChange,
    fetchTools
  };
};