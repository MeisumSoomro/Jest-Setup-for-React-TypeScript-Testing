'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export const FeedbackSystem = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ feedback }),
      });
      toast.success('Feedback submitted successfully');
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Feedback form */}
    </form>
  );
}; 