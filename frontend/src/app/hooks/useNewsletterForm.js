'use client';

const { useState } = require('react');

const useNewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      // Validate email
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Make API call
      const response = await fetch(`/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setMessage(data.error);
      } else {
        setIsSuccess(true);
        setMessage("Thank you for subscribing!");
        setEmail("");

        // Hide success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
          setMessage("");
        }, 5000);
      }
    } catch (err) {
      setError(err.message || 'Failed to subscribe. Please try again later.');
      setMessage(err.message || 'Failed to subscribe. Please try again later.');
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

module.exports = useNewsletterForm;