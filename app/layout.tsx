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
  metadataBase: new URL('https://aziz-malika-invitation.anibus.chatgpt.site'),
  title: 'Kamoliddin & Parvina — toʻy taklifnomasi',
  description: 'Kamoliddin va Parvinaning toʻy taklifnomasi.',
  openGraph: {
    title: 'Kamoliddin & Parvina — toʻy taklifnomasi',
    description: '26-sentabr 2026 · Ofarin toʻyxona · 18:00',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Kamoliddin & Parvina — 26-sentabr 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kamoliddin & Parvina — toʻy taklifnomasi',
    description: '26-sentabr 2026 · Ofarin toʻyxona · 18:00',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
