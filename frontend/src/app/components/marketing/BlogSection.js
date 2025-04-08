'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchBlogPosts } from '../../../lib/blog-util';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const posts = await fetchBlogPosts(3);
        // Clean up the excerpt to remove author attribution and ensure URLs are absolute
        const cleanedPosts = posts.map(post => ({
          ...post,
          excerpt: removeAuthorFromExcerpt(post.excerpt, post.author),
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
          <h2 className="text-4xl font-bold mb-12">The AI Blog You Can't Miss from TwinBrain.ai</h2>
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
          <div className="grid grid-cols-1 gap-12 mx-auto max-w-3xl">
            {blogs.map((blog) => (
              <div
                key={blog.id || Math.random().toString(36).substring(2, 9)}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col h-full"
              >
                {/* Much larger image area */}
                <div className="h-96 bg-gray-700 relative">
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
                </div>
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
                  <h3 className="text-2xl font-bold mb-6">{blog.title}</h3>
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
      </div>
    </section>
  );
};

export default BlogSection;