'use client';

import { useState, useEffect } from 'react';

const useNewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Clean up any pending timers when the component unmounts
  useEffect(() => {
    return () => {
      // This effect cleanup will run when the component unmounts
      // and handle any pending state updates
    };
  }, []);

  const handleSubscribe = async (e) => {
    // We don't call preventDefault here anymore - it will be handled by the component

    // Don't allow multiple simultaneous submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    setMessage('');

    // Check for online status first - critical for mobile
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setError('You appear to be offline. Please check your connection.');
      setMessage('You appear to be offline. Please check your connection.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Validate email
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      console.log('Submitting email:', email);

      // Make API call
      const response = await fetch(`/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        // Handle HTTP error responses (4xx, 5xx)
        setError(data.error || `Error: ${response.status}`);
        setMessage(data.error || 'Failed to subscribe. Please try again later.');
        setIsSuccess(false);
      } else if (data.error) {
        // Handle application-level errors
        setError(data.error);
        setMessage(data.error);
        setIsSuccess(false);
      } else {
        // Handle success
        setIsSuccess(true);
        setMessage(data.message || "Thank you for subscribing!");
        setEmail("");

        // Hide success message after 5 seconds
        // Use a variable to capture the timeout ID
        const timeoutId = setTimeout(() => {
          setIsSuccess(false);
          setMessage("");
        }, 5000);

        // We return a cleanup function that the useEffect in the component can use
        return () => clearTimeout(timeoutId);
      }
    } catch (err) {
      // Handle exceptions (network errors, etc.)
      console.error('Newsletter form error:', err);
      setError(err.message || 'Failed to subscribe. Please try again later.');
      setMessage(err.message || 'Failed to subscribe. Please try again later.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    message,
    setMessage,
    isSubmitting,
    isSuccess,
    error,
    handleSubscribe
  };
};

export default useNewsletterForm;