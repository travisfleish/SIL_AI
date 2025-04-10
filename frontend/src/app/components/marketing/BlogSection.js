'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBlogPosts } from '../../../lib/blog-util';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);

  // Detect if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const posts = await fetchBlogPosts(3);
        // Clean up the excerpt to remove author attribution and ensure URLs are absolute
        const cleanedPosts = posts.map(post => ({
          ...post,
          title: sanitizeText(post.title),
          excerpt: sanitizeText(removeAuthorFromExcerpt(post.excerpt, post.author)),
          // Ensure URL is absolute
          url: ensureAbsoluteUrl(post.url)
        }));
        setBlogs(cleanedPosts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Sanitize text to handle apostrophes
  const sanitizeText = (text) => {
    if (!text) return '';
    // Replace apostrophes with typographically correct ones to avoid React escaping issues
    return text.replace(/'/g, "'");
  };

  // Helper function to ensure URLs are absolute
  const ensureAbsoluteUrl = (url) => {
    if (!url) return 'https://www.twinbrain.ai/blog';

    // If the URL already starts with http:// or https://, it's already absolute
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // If it's a relative URL, make it absolute by prepending the TwinBrain domain
    return `https://www.twinbrain.ai${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Helper function to remove "By: Author Name" from excerpts
  const removeAuthorFromExcerpt = (excerpt, author) => {
    if (!excerpt || !author) return excerpt;

    // Remove "By: Author Name" pattern
    let cleaned = excerpt.replace(new RegExp(`By:\\s*${author}`, 'i'), '');

    // Also remove "By: Author" pattern
    cleaned = cleaned.replace(/By:\s*[^.,;]+/i, '');

    // Also remove attribution at the end with dot
    cleaned = cleaned.replace(/\.\s*By:?\s*[^.,;]+\.?$/i, '.');

    // Trim and clean up
    return cleaned.trim();
  };

  // Carousel controls
  const nextSlide = () => {
    if (blogs.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
  };

  const prevSlide = () => {
    if (blogs.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + blogs.length) % blogs.length);
  };

  // Touch controls for swipe gesture on mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum swipe distance

    if (diff > threshold) {
      // Swipe left, go to next
      nextSlide();
    } else if (diff < -threshold) {
      // Swipe right, go to previous
      prevSlide();
    }
  };

  return (
    <section className="w-full py-30 text-white relative">
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/SIL_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)',
          zIndex: 0
        }}
      />

      {/* Dark overlay to ensure text is readable */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-25">
          <h2 className="text-4xl font-bold mb-12">The AI Blog You Can&apos;t Miss from TwinBrain.ai</h2>
          <p className="text-xl mb-6 max-w-4xl mx-auto">
            Sports Innovation Lab & Microsoft are proud to partner with TwinBrain to bring the sports industry
            meaningful perspectives on AI that can help to drive your business forward TODAY
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-300">Loading latest blog posts...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-300">No blog posts available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Mobile Carousel View */}
            {isMobile ? (
              <div className="relative mx-auto max-w-md">
                {/* Carousel container */}
                <div
                  ref={carouselRef}
                  className="overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Blog post carousel */}
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {blogs.map((blog, index) => (
                      <div
                        key={blog.id || Math.random().toString(36).substring(2, 9)}
                        className="w-full flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col"
                      >
                        {/* Image container */}
                        <a
                          href={blog.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-60 bg-gray-700 relative block overflow-hidden"
                        >
                          {blog.imageUrl ? (
                            <img
                              src={blog.imageUrl}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                                const placeholder = document.createElement('div');
                                placeholder.className = 'text-gray-500 text-center';
                                placeholder.innerText = 'Image unavailable';
                                e.target.parentNode.appendChild(placeholder);
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500">No image</span>
                              </div>
                            </div>
                          )}
                        </a>

                        {/* Content area */}
                        <div className="p-6 flex-grow flex flex-col">
                          <div className="mb-2 flex items-center text-sm text-gray-400">
                            {blog.author && (
                              <span className="mr-2 text-sm">{blog.author}</span>
                            )}
                            {blog.date && (
                              <>
                                {blog.author && <span className="mr-2">•</span>}
                                <span className="text-sm">{blog.date}</span>
                              </>
                            )}
                          </div>

                          <a
                            href={blog.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-300 transition-colors"
                          >
                            <h3 className="text-xl font-bold mb-4">{blog.title}</h3>
                          </a>

                          <p className="text-gray-300 mb-6 flex-grow text-sm line-clamp-3">{blog.excerpt}</p>

                          <a
                            href={blog.url}
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-auto text-sm font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Read more <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation arrows - only show if multiple blogs */}
                {blogs.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 p-2 rounded-full text-white hover:bg-white/50 transition"
                      aria-label="Previous blog"
                    >
                      <ChevronLeft size={24} />
                    </button>

                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 p-2 rounded-full text-white hover:bg-white/50 transition"
                      aria-label="Next blog"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Pagination dots */}
                {blogs.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {blogs.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          currentIndex === index ? 'bg-blue-500' : 'bg-gray-500'
                        }`}
                        aria-label={`Go to blog ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Desktop View (original grid layout)
              <div className="grid grid-cols-1 gap-12 mx-auto max-w-3xl">
                {blogs.map((blog) => (
                  <div
                    key={blog.id || Math.random().toString(36).substring(2, 9)}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col h-full"
                  >
                    {/* Much larger image area - now clickable */}
                    <a
                      href={blog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-96 bg-gray-700 relative block overflow-hidden hover:opacity-90 transition-opacity"
                    >
                      {blog.imageUrl ? (
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                            const placeholder = document.createElement('div');
                            placeholder.className = 'text-gray-500 text-center';
                            placeholder.innerText = 'Image unavailable';
                            e.target.parentNode.appendChild(placeholder);
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        </div>
                      )}
                    </a>
                    {/* Increased padding for content area */}
                    <div className="p-10 flex-grow flex flex-col">
                      <div className="mb-4 flex items-center text-sm text-gray-400">
                        {blog.author && (
                          <span className="mr-2 text-base">{blog.author}</span>
                        )}
                        {blog.date && (
                          <>
                            {blog.author && <span className="mr-2">•</span>}
                            <span className="text-base">{blog.date}</span>
                          </>
                        )}
                      </div>
                      {/* Title is now a link */}
                      <a
                        href={blog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-300 transition-colors"
                      >
                        <h3 className="text-2xl font-bold mb-6">{blog.title}</h3>
                      </a>
                      <p className="text-gray-300 mb-8 flex-grow text-lg leading-relaxed">{blog.excerpt}</p>
                      <a
                        href={blog.url}
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-auto text-lg font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read more <ArrowRight className="ml-2 h-6 w-6" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BlogSection;