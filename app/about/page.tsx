import React from 'react';
import { Metadata } from 'next';
import { AboutHero } from '@/components/about/AboutHero';
import { CompanyStory } from '@/components/about/CompanyStory';
import { MissionVision } from '@/components/about/MissionVision';
import { CoreValues } from '@/components/about/CoreValues';
import { WhyChooseUs } from '@/components/about/WhyChooseUs';
import { Stats } from '@/components/about/Stats';
import { HealthcareCommitments } from '@/components/about/HealthcareCommitments';
import { Location } from '@/components/about/Location';
import { AboutCTA } from '@/components/about/AboutCTA';

export const metadata: Metadata = {
  title: 'About Us | Digiclinix Pharmacy & Healthcare',
  description:
    'Learn about Digiclinix Pharmacy, our clinical commitment to genuine medicines, patient-first care, certified pharmacists, and fast delivery.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Digiclinix Pharmacy & Healthcare',
    description:
      'Learn about Digiclinix Pharmacy, our clinical commitment to genuine medicines, patient-first care, and fast delivery.',
    siteName: 'Digiclinix Pharmacy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Digiclinix Pharmacy',
    description: 'Learn about Digiclinix Pharmacy and our clinical care commitments.',
  },
};

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* 1. About Hero */}
      <AboutHero />

      {/* 2. Company Story */}
      <CompanyStory />

      {/* 3. Mission & Vision */}
      <MissionVision />

      {/* 4. Core Values */}
      <CoreValues />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Statistics */}
      <Stats />

      {/* 7. Healthcare Commitments */}
      <HealthcareCommitments />

      {/* 8. Location & Operating Hours */}
      <Location />

      {/* 9. Call to Action */}
      <AboutCTA />
    </div>
  );
}
