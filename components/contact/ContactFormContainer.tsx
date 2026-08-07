'use client';

import React, { useState } from 'react';
import { ContactForm, ContactFormData } from './ContactForm';
import { useToast } from '@/components/providers/toast-provider';

export const ContactFormContainer: React.FC = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      toast.success(`Thank you, ${data.fullName}! Your enquiry has been received.`);
    } catch {
      toast.error('Unable to send message. Please try calling or WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
      onResetSuccess={() => setIsSuccess(false)}
    />
  );
};
