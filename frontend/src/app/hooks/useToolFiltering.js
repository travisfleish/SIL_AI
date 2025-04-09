import { useState, useCallback, useEffect } from 'react';
import { CATEGORY_GROUPS } from '../utils/constants';

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

    // Determine the current group (sports or AI)
    const currentGroup = category === 'sports_all' ||
      CATEGORY_GROUPS.SPORTS.some(c => c.id === category) ? 'sports' : 'ai';

    // If switching to 'all' within the same group, set to the all category
    if (category === 'sports_all' || category === 'ai_all') {
      setSelectedCategory(category);
      return;
    }

    // Check if the category exists in the current group
    const isValidCategory = currentGroup === 'sports'
      ? CATEGORY_GROUPS.SPORTS.some(c => c.id === category)
      : CATEGORY_GROUPS.AI.some(c => c.id === category);

    // If valid category, set it. Otherwise, set to the corresponding 'all' category
    setSelectedCategory(
      isValidCategory
        ? category
        : (currentGroup === 'sports' ? 'sports_all' : 'ai_all')
    );
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