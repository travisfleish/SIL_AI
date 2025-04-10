'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';

export default function TestPage2() {
  const [stage, setStage] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log('Test page 2 loaded');

      // Advance to next stage after 1 second
      const timer = setTimeout(() => {
        setStage(1);
      }, 1000);

      return () => clearTimeout(timer);
    } catch (err) {
      setError(`Error in useEffect: ${err.message}`);
      console.error(err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Only try to load the header if we're at stage 1 or beyond */}
      {stage >= 1 ? <Header /> : <div className="p-4 bg-blue-200">Header will load here</div>}

      <main className="p-4">
        <h1 className="text-2xl font-bold my-4">Test Page 2</h1>

        <div className="p-4 bg-green-100 rounded-lg mb-4">
          Stage: {stage} - JavaScript is working!
        </div>

        {error && (
          <div className="p-4 bg-red-100 rounded-lg mb-4">
            Error: {error}
          </div>
        )}

        <button
          onClick={() => setStage(stage + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Advance to next stage manually
        </button>
      </main>
    </div>
  );
}