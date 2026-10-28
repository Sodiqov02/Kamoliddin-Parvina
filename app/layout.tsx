import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kamoliddin-parvina.vercel.app'),
  title: 'Kamoliddin & Parvinaxon — toʻy taklifnomasi',
  description: 'Kamoliddin va Parvinaxonning toʻy taklifnomasi.',
  openGraph: {
    title: 'Kamoliddin & Parvinaxon — toʻy taklifnomasi',
    description: '13-noyabr 2026 · Shabnam toʻyxonasi · 18:00',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Kamoliddin & Parvinaxon — 13-noyabr 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kamoliddin & Parvinaxon — toʻy taklifnomasi',
    description: '13-noyabr 2026 · Shabnam toʻyxonasi · 18:00',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <head>
        <link rel="icon" href="favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('click', function (event) {
            var button = event.target.closest('[data-open-invitation]');
            if (!button || window.__invitationOpenedEarly) return;
            window.__invitationOpenedEarly = true;
            document.body.classList.add('invitation-opening');
            document.querySelector('.story .scene')?.classList.add('scene--active');
          }, true);
        ` }} />
      </body>
    </html>
  );
}
