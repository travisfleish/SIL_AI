const React = require('react');
const { FILTERS } = require('../../utils/constants');

const ToggleButtons = ({
  selectedFilter,
  onFilterChange,
  isMobile // Use isMobile prop to determine display text
}) => {
  return React.createElement("section", {
    className: "p-4 flex justify-center mt-4 mb-2" // Reduced top margin
  },
    React.createElement("div", {
      className: "inline-flex rounded-md"
    },
      FILTERS.map((filter, index) =>
        React.createElement("button", {
          key: filter.id,
          onClick: () => onFilterChange(filter.id),
          className: `
            ${isMobile ? 'px-5' : 'px-8'} py-3 text-lg font-bold mt-3 mb-3
            ${index === 0 ? "rounded-l-lg" : ""}
            ${index === FILTERS.length - 1 ? "rounded-r-lg" : ""}
            ${selectedFilter === filter.id 
              ? "bg-blue-600 text-white z-10" 
              : "bg-white text-gray-900 hover:bg-gray-300"}
            border border-gray-300
            ${index > 0 && "-ml-px"}
            transition
          `
        }, isMobile && filter.shortName ? filter.shortName : filter.name)
      )
    )
  );
};

module.exports = ToggleButtons;