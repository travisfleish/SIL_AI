const React = require('react');
const { FILTERS } = require('../../utils/constants');

const ToggleButtons = ({
  selectedFilter,
  onFilterChange,
  isMobile
}) => {
  return React.createElement("section", {
    className: "p-3 flex justify-center mb-5" // Reduced outer padding
  },
    React.createElement("div", {
      className: "inline-flex rounded-lg shadow-sm" // Maintained shadow
    },
      FILTERS.map((filter, index) =>
        React.createElement("button", {
          key: filter.id,
          onClick: () => onFilterChange(filter.id),
          className: `
            ${isMobile ? 'px-5' : 'px-6'} py-2.5 text-base font-medium
            ${index === 0 ? "rounded-l-lg" : ""}
            ${index === FILTERS.length - 1 ? "rounded-r-lg" : ""}
            ${selectedFilter === filter.id 
              ? "bg-blue-600 text-white" // Clean active state
              : "bg-white text-gray-800 hover:text-blue-700"} 
            border border-gray-200
            ${index > 0 && "-ml-px"}
            transition-colors duration-150
          `
        }, isMobile && filter.shortName ? filter.shortName : filter.name)
      )
    )
  );
};

module.exports = ToggleButtons;