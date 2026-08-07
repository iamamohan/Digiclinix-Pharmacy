import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Digiclinix Pharmacy',
    short_name: 'Digiclinix',
    description: 'Licensed Pharmaceutical Provider — Clinics, Diagnostics & Pharmacy',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1220',
    theme_color: '#9333ea',
    icons: [
      {
        src: '/logo/digiclinix-icon-transparent.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo/digiclinix-icon-transparent.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
