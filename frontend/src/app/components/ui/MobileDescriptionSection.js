'use client';

import React from 'react';

const MobileDescriptionSection = ({ isMobile }) => {
  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <div className="bg-gray-100 px-4 py-3 mt-10 text-center">
      <h2 className="text-base font-bold text-gray-800">
        AI <span className="text-blue-600">Advantage</span> Resources
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        Discover the best AI tools for sports professionals
      </p>
      <p className="text-sm text-gray-600 mt-1">
        Brought to you by Sports Innovation Lab
      </p>
    </div>
  );
};

export default MobileDescriptionSection;