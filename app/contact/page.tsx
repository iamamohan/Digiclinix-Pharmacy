import React from 'react';
import { Metadata } from 'next';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { ContactFormContainer } from '@/components/contact/ContactFormContainer';
import { ContactMap } from '@/components/contact/ContactMap';
import { FAQ } from '@/components/contact/FAQ';
import { ContactCTA } from '@/components/contact/ContactCTA';

export const metadata: Metadata = {
  title: 'Contact Us | Digiclinix Pharmacy Support & Location',
  description:
    'Get in touch with Digiclinix Pharmacy. Reach out for medicine inquiries, prescription support, delivery assistance, and store location details.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Digiclinix Pharmacy Support & Location',
    description:
      'Get in touch with Digiclinix Pharmacy. Reach out for medicine inquiries, prescription support, and store location details.',
    siteName: 'Digiclinix Pharmacy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Digiclinix Pharmacy',
    description: 'Get in touch with Digiclinix Pharmacy support and pharmacists.',
  },
};

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* 1. Contact Hero */}
      <ContactHero />

      {/* 2. Contact Information Cards */}
      <ContactInfo />

      {/* 3. Contact Form (Client state wrapper) */}
      <ContactFormContainer />

      {/* 4. Location Map */}
      <ContactMap />

      {/* 5. Frequently Asked Questions */}
      <FAQ />

      {/* 6. Contact CTA Banner */}
      <ContactCTA />
    </div>
  );
}
