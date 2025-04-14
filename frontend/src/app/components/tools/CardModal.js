import React, { useEffect, useRef, useState } from 'react';
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
  const modalContentRef = useRef(null);
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);

  // Add responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Detect screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      // Consider mobile for screens narrower than 768px
      setIsMobile(window.innerWidth < 768);

      // Get current viewport height
      setViewportHeight(window.innerHeight);

      // Debug screen dimensions
      console.log(`Modal - Screen size: ${window.innerWidth}x${window.innerHeight}`);
    };

    // Initial check
    checkScreenSize();

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle escape key to close modal and click outside
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

    const handleClickOutside = (e) => {
      // Check if click is outside the modal content AND not on navigation buttons
      const isOutsideModal = modalContentRef.current && !modalContentRef.current.contains(e.target);
      const isOnLeftButton = leftButtonRef.current && leftButtonRef.current.contains(e.target);
      const isOnRightButton = rightButtonRef.current && rightButtonRef.current.contains(e.target);

      if (isOutsideModal && !isOnLeftButton && !isOnRightButton) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling while modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hasMultipleTools, tools.length, onClose, setCurrentToolIndex]);

  if (!isOpen || !currentTool) return null;

  // Get image URL for the current tool
  const imageUrl = currentTool.screenshot_url && currentTool.screenshot_url.trim() !== ""
    ? currentTool.screenshot_url
    : "/default-screenshot.png";

  // Calculate optimal modal height based on viewport
  const maxModalHeight = viewportHeight * 0.9; // 90% of viewport height

  // Calculate image height - maintain large size on desktop, only scale down on small screens
  let imageHeight = 500; // Default large height for desktop

  // Only reduce size if viewport is too small
  if (viewportHeight < 800) {
    // Dynamic scaling for smaller screens
    imageHeight = Math.min(400, maxModalHeight * 0.6);
  }

  // Further reduce for true mobile devices
  if (isMobile) {
    imageHeight = Math.min(300, maxModalHeight * 0.5);
  }

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/30 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Outer container - Keep full size on large screens, only scale down when necessary */}
      <div className="relative w-full max-w-6xl">
        {/* Navigation buttons - Responsive positioning and size */}
        {hasMultipleTools && (
          <>
            <button
              ref={leftButtonRef}
              onClick={() => setCurrentToolIndex(prev =>
                prev === 0 ? tools.length - 1 : prev - 1
              )}
              className={`absolute left-0 top-1/2 z-20 bg-white/90 
                ${isMobile ? 'p-2 -translate-x-1/3' : 'p-3 -translate-x-1/2'} 
                -translate-y-1/2 rounded-full shadow-md hover:bg-gray-100 transition-transform hover:scale-110`}
              aria-label="Previous tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "24"} height={isMobile ? "18" : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              ref={rightButtonRef}
              onClick={() => setCurrentToolIndex(prev =>
                (prev + 1) % tools.length
              )}
              className={`absolute right-0 top-1/2 z-20 bg-white/90 
                ${isMobile ? 'p-2 translate-x-1/3' : 'p-3 translate-x-1/2'} 
                -translate-y-1/2 rounded-full shadow-md hover:bg-gray-100 transition-transform hover:scale-110`}
              aria-label="Next tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "24"} height={isMobile ? "18" : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Modal content - Responsive sizing and overflow handling */}
        <div
          ref={modalContentRef}
          className="bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn"
          style={{ maxHeight: `${maxModalHeight}px` }}
        >
          {/* Header with category - Smaller on mobile */}
          <div className="w-full bg-blue-100 py-2 md:py-3 px-3 md:px-4 flex justify-between items-center sticky top-0 z-10">
            <span className="font-bold text-blue-800 text-base md:text-xl">
              {category}
            </span>

            <button
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900 p-1"
              aria-label="Close modal"
            >
              <X size={isMobile ? 20 : 24} />
            </button>
          </div>

          {/* Main content area with overflow scrolling - Use min-height for large screens */}
          <div className="relative overflow-y-auto"
               style={{
                 maxHeight: `calc(${maxModalHeight}px - 100px)`,
                 minHeight: isMobile ? 'auto' : '400px'
               }}>
            {/* Image container with dynamic height */}
            <div className="relative w-full bg-gray-100 overflow-hidden" style={{ height: `${imageHeight}px` }}>
              <Image
                src={imageUrl}
                alt={`${currentTool.name} Screenshot`}
                width={1280}
                height={800}
                className="w-full h-full object-contain"
                unoptimized
              />

              {/* Tool counter (e.g., "1/3") - positioned exactly like in card */}
              {hasMultipleTools && (
                <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full opacity-80">
                  {currentToolIndex + 1}/{tools.length}
                </div>
              )}
            </div>

            {/* Tool details content - Smaller padding on mobile */}
            <div className="p-3 md:p-6">
              {/* Tool details */}
              <div className="text-center max-w-2xl mx-auto">
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2 md:mb-4`}>
                  <a
                    href={currentTool.source_url}
                    className="text-blue-600 hover:underline flex items-center justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {currentTool.name}
                    <ExternalLink className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                  </a>
                </h2>

                <p className={`text-gray-700 ${isMobile ? 'text-sm' : 'text-lg'} mb-3 md:mb-6`}>
                  {currentTool.short_description}
                </p>

                {/* Additional details - Hide on very small screens */}
                {currentTool.long_description && !isMobile && (
                  <div className="text-left bg-gray-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
                    <h3 className="font-semibold mb-2">About this tool:</h3>
                    <p className="text-gray-700 text-sm md:text-base">{currentTool.long_description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer with page indicator - simple and minimal */}
          <div className="py-2 md:py-3 bg-gray-50 flex justify-center items-center border-t border-gray-200">
            <div className="text-gray-600 font-medium text-xs md:text-sm">
              {currentToolIndex + 1} / {tools.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;