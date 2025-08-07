// frontend/src/app/hooks/useNewsletterForm.js
'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@formspree/react';

const useNewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Use Formspree hook with your form ID
  const [state, handleFormspreeSubmit] = useForm("xdkdpekp");

  // Handle form submission
  const handleSubscribe = async (e) => {
    if (e) e.preventDefault();

    // Validate email before submission
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address');
      return { success: false, error: 'Invalid email' };
    }

    // Create form data for Formspree
    const formData = new FormData();
    formData.append('email', email);
    formData.append('source', 'SportsTech AI Newsletter');
    formData.append('timestamp', new Date().toISOString());

    // Submit to Formspree
    await handleFormspreeSubmit(formData);

    return { success: true };
  };

  // Handle Formspree state changes
  useEffect(() => {
    if (state.succeeded) {
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setEmail(''); // Clear email field

      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } else if (state.errors && state.errors.length > 0) {
      // Handle Formspree errors
      const errorMessage = state.errors
        .map(err => err.message)
        .join(', ');
      setMessage(errorMessage || 'Failed to subscribe. Please try again.');
    }
  }, [state.succeeded, state.errors]);

  return {
    email,
    setEmail,
    message,
    setMessage,
    isSubmitting: state.submitting,
    isSuccess: state.succeeded,
    error: state.errors?.[0]?.message || '',
    handleSubscribe,
    // Expose Formspree state if needed
    formspreeState: state
  };
};

export default useNewsletterForm;