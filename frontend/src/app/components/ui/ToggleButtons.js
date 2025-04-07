const React = require('react');
const { FILTERS } = require('../../utils/constants');

const ToggleButtons = ({
  selectedFilter,
  onFilterChange
}) => {
  return React.createElement("section", {
    className: "p-4 flex justify-center mt-10"
  },
    React.createElement("div", {
      className: "inline-flex rounded-md shadow-sm"
    },
      FILTERS.map((filter, index) =>
        React.createElement("button", {
          key: filter.id,
          onClick: () => onFilterChange(filter.id),
          className: `
            px-6 py-3 text-lg font-bold
            ${index === 0 ? "rounded-l-lg" : ""}
            ${index === FILTERS.length - 1 ? "rounded-r-lg" : ""}
            ${selectedFilter === filter.id 
              ? "bg-blue-600 text-white z-10" 
              : "bg-white text-gray-900 hover:bg-gray-300"}
            border border-gray-300
            ${index > 0 && "-ml-px"}
            transition
          `
        }, filter.name)
      )
    )
  );
};

module.exports = ToggleButtons;