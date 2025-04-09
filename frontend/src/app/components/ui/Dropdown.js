import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({
  title,
  options,
  selectedValue,
  onChange,
  isActive = false,
  width
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown open/closed
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle option selection
  const handleSelect = (option) => {
    onChange(option.id);
    setIsOpen(false);
  };

  // Find the currently selected option
  const selected = options.find(option => option.id === selectedValue) || options[0];

  // Determine what text to display on the button
  const displayText = selected ? selected.name : title;

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block"
      style={{ width: width ? `${width}px` : 'auto' }}
    >
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className={`flex justify-center items-center w-full px-4 py-3 text-lg font-bold
                  border border-gray-300 rounded-lg shadow-md
                  ${isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}
                  transition whitespace-nowrap`}
      >
        <span className="mr-4">{displayText}</span>
        <ChevronDown size={20} className={`transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200"
          style={{ width: width ? `${width}px` : 'auto' }}
        >
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`block w-full text-left px-4 py-3 hover:bg-gray-100 text-base whitespace-nowrap
                        ${selectedValue === option.id ? "bg-blue-50 font-bold" : ""}`}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;