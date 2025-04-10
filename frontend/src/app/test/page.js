'use client';

import React, { useEffect, useState } from 'react';

export default function TestPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Log when the component mounts
    console.log('Test page mounted');
    setLoaded(true);
  }, []);

  return (
    <div className="p-8 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-4">Mobile Test Page</h1>
      <p className="mb-4">This is a minimal test page to check loading on mobile.</p>
      <div className="p-4 bg-green-100 rounded-lg">
        {loaded ? 'JavaScript is working!' : 'Loading...'}
      </div>
    </div>
  );
}