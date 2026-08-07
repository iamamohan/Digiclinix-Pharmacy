'use client';

import React, { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Send, RotateCcw } from 'lucide-react';

export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  isSuccess?: boolean;
  onResetSuccess?: () => void;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  isSubmitting = false,
  isSuccess = false,
  onResetSuccess,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Phone Number (Recommendation 3)
    const phoneRegex = /^\+?[0-9\s\-]{10,15}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (10–15 digits)';
    }

    // Email Address (Recommendation 4)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    // Message
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);

    // Auto-focus first invalid input element
    if (newErrors.fullName) {
      nameInputRef.current?.focus();
    } else if (newErrors.phone) {
      phoneInputRef.current?.focus();
    } else if (newErrors.email) {
      emailInputRef.current?.focus();
    } else if (newErrors.subject) {
      subjectInputRef.current?.focus();
    } else if (newErrors.message) {
      messageInputRef.current?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: Connect this form submission to the backend contact inquiry API endpoint in a future phase.
    await onSubmit({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setSubject('');
    setMessage('');
    setErrors({});
    if (onResetSuccess) onResetSuccess();
  };

  const fadeUpProps = {
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' as const },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.5,
      ease: 'easeOut' as const,
    },
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50/70 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors duration-200" aria-label="Send us a message">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <motion.div {...fadeUpProps} className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Direct Inquiry
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight">
              Send Us a Message
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Fill out the form below and our clinical support team will get back to you shortly.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            {...fadeUpProps}
            className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft"
          >
            {/* Success State View (Recommendation 9) */}
            {isSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200/60 dark:border-emerald-800/60">
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-manrope">
                  Thank You!
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  We&apos;ve received your enquiry. Our healthcare support team will contact you soon.
                </p>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
                    onClick={handleReset}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              /* Active Form View */
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-full-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={nameInputRef}
                      id="contact-full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                      }}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'error-full-name' : undefined}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.fullName && (
                      <p id="error-full-name" className="text-xs text-red-500 mt-1 font-medium">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={phoneInputRef}
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'error-phone' : undefined}
                      placeholder="e.g. +91 91820 15238"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && (
                      <p id="error-phone" className="text-xs text-red-500 mt-1 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Address & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={emailInputRef}
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'error-email' : undefined}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && (
                      <p id="error-email" className="text-xs text-red-500 mt-1 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={subjectInputRef}
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value);
                        if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                      }}
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby={errors.subject ? 'error-subject' : undefined}
                      placeholder="e.g. Prescription Delivery Inquiry"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.subject && (
                      <p id="error-subject" className="text-xs text-red-500 mt-1 font-medium">
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    ref={messageInputRef}
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                    }}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'error-message' : undefined}
                    placeholder="Write your enquiry or prescription message details here..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  {errors.message && (
                    <p id="error-message" className="text-xs text-red-500 mt-1 font-medium">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    leftIcon={<Send className="w-4 h-4" aria-hidden="true" />}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
