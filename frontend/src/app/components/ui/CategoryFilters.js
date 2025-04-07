const React = require('react');
const { CATEGORIES } = require('../../utils/constants');

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

  return React.createElement("section", {
    className: "p-4 pt-8 flex justify-center bg-gray-100 mb-5"
  },
    React.createElement("div", {
      className: "inline-flex flex-wrap rounded-md shadow-sm"
    },
      CATEGORIES.map((category, index) =>
        React.createElement("button", {
          key: category.id,
          onClick: () => onCategoryChange(category.id),
          className: `
            px-6 py-3 text-md font-bold
            border border-gray-300
            ${index === 0 ? "rounded-l-lg" : ""}
            ${index === CATEGORIES.length - 1 ? "rounded-r-lg" : ""}
            ${selectedCategory === category.id 
              ? "bg-blue-600 text-white z-10" 
              : "bg-gray-150 text-gray-900 hover:bg-gray-300"}
            ${index > 0 && "-ml-px"}
            transition
            whitespace-nowrap
          `
        }, isMobile && category.mobileName ? category.mobileName : category.name)
      )
    )
  );
};

module.exports = CategoryFilters;