import React, { useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, X } from 'lucide-react';

const CardModal = ({
  isOpen,
  onClose,
  category,
  tools,
  currentToolIndex,
  setCurrentToolIndex
}) => {
  const currentTool = tools[currentToolIndex];
  const hasMultipleTools = tools.length > 1;

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();

      // Arrow keys for navigation if multiple tools
      if (hasMultipleTools) {
        if (e.key === 'ArrowLeft') {
          setCurrentToolIndex(prev =>
            prev === 0 ? tools.length - 1 : prev - 1
          );
        } else if (e.key === 'ArrowRight') {
          setCurrentToolIndex(prev =>
            (prev + 1) % tools.length
          );
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling while modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hasMultipleTools, tools.length, onClose, setCurrentToolIndex]);

  if (!isOpen || !currentTool) return null;

  // Get image URL for the current tool
  const imageUrl = currentTool.screenshot_url && currentTool.screenshot_url.trim() !== ""
    ? currentTool.screenshot_url
    : "/default-screenshot.png";

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/30 z-50 flex items-center justify-center p-4">
      {/* Outer container to allow for buttons to extend beyond card */}
      <div className="relative max-w-4xl w-full">
        {/* Navigation buttons - positioned outside but still fully visible */}
        {hasMultipleTools && (
          <>
            <button
              onClick={() => setCurrentToolIndex(prev =>
                prev === 0 ? tools.length - 1 : prev - 1
              )}
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/90 p-3 rounded-full shadow-md hover:bg-gray-100 transition-transform hover:scale-110"
              aria-label="Previous tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={() => setCurrentToolIndex(prev =>
                (prev + 1) % tools.length
              )}
              className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-20 bg-white/90 p-3 rounded-full shadow-md hover:bg-gray-100 transition-transform hover:scale-110"
              aria-label="Next tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Modal content */}
        <div className="bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
          {/* Header with category */}
          <div className="w-full bg-blue-100 py-3 px-4 flex justify-between items-center sticky top-0">
            <span className="font-bold text-blue-800 text-xl">
              {category}
            </span>

            <button
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900 p-1"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content area */}
          <div className="p-6 overflow-y-auto flex-grow relative">
            {/* Tool image - with counter overlay */}
            <div className="relative w-full mb-8">
              <Image
                src={imageUrl}
                alt={`${currentTool.name} Screenshot`}
                width={1920}
                height={1080}
                className="w-full h-auto rounded-md shadow-md"
                unoptimized
              />

              {/* Tool counter (e.g., "1/3") - positioned exactly like in card */}
              {hasMultipleTools && (
                <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full opacity-80">
                  {currentToolIndex + 1}/{tools.length}
                </div>
              )}
            </div>

            {/* Tool details */}
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold flex items-center justify-center mb-4">
                <a
                  href={currentTool.source_url}
                  className="text-blue-600 hover:underline flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentTool.name}
                  <ExternalLink className="ml-2 w-5 h-5" />
                </a>
              </h2>

              <p className="text-gray-700 text-lg mb-6">{currentTool.short_description}</p>

              {/* Additional details could be added here */}
              {currentTool.long_description && (
                <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">About this tool:</h3>
                  <p className="text-gray-700">{currentTool.long_description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer with page indicator - simple and minimal */}
          <div className="py-3 bg-gray-50 flex justify-center items-center">
            <div className="text-gray-600 font-medium text-sm">
              {currentToolIndex + 1} / {tools.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;