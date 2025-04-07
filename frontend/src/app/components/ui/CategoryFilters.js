import React from 'react';
import Dropdown from './Dropdown';
import { CATEGORY_GROUPS } from '../../utils/constants';

const CategoryFilters = ({
  selectedFilter,
  selectedCategory,
  onCategoryChange,
  isMobile
}) => {
  // Only render if in enterprise view
  if (selectedFilter !== 'enterprise') {
    return null;
  }

  // Determine which dropdown is active
  const isSportsActive = !selectedCategory ||
    selectedCategory === "sports_all" ||
    CATEGORY_GROUPS.SPORTS.slice(1).some(tool => tool.id === selectedCategory);

  const isAIActive = selectedCategory === "ai_all" ||
    CATEGORY_GROUPS.AI.slice(1).some(tool => tool.id === selectedCategory);

  // Find the currently selected option in the active dropdown
  const getSelectedValue = (group) => {
    if (group === 'sports') {
      if (!selectedCategory || selectedCategory === 'sports_all') {
        return 'sports_all';
      }
      const found = CATEGORY_GROUPS.SPORTS.find(option => option.id === selectedCategory);
      return found ? found.id : 'sports_all';
    } else {
      if (selectedCategory === 'ai_all') {
        return 'ai_all';
      }
      const found = CATEGORY_GROUPS.AI.find(option => option.id === selectedCategory);
      return found ? found.id : 'ai_all';
    }
  };

  return (
    <section className="p-6 pt-10 pb-10 flex flex-col sm:flex-row justify-center items-center bg-gray-100 mb-6 gap-8">
      {/* Sports Tools Dropdown */}
      <Dropdown
        title="Sports Tools"
        options={CATEGORY_GROUPS.SPORTS}
        selectedValue={getSelectedValue('sports')}
        onChange={onCategoryChange}
        isActive={isSportsActive}
      />

      {/* AI Tools Dropdown */}
      <Dropdown
        title="AI Tools"
        options={CATEGORY_GROUPS.AI}
        selectedValue={getSelectedValue('ai')}
        onChange={onCategoryChange}
        isActive={isAIActive}
      />
    </section>
  );
};

export default CategoryFilters;