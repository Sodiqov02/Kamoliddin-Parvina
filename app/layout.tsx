import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://aziz-malika-invitation.anibus.chatgpt.site'),
  title: 'Kamoliddin & Parvina — свадебное приглашение',
  description: 'Будем счастливы видеть вас на нашей свадьбе в Ofarin toʻyxona. Начало в 18:00.',
  openGraph: {
    title: 'Kamoliddin & Parvina — свадебное приглашение',
    description: 'Ofarin toʻyxona · 18:00',
    type: 'website',
    images: [{ url: '/og.png', width: 1733, height: 910, alt: 'Kamoliddin & Parvina — свадебное приглашение' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kamoliddin & Parvina — свадебное приглашение',
    description: 'Ofarin toʻyxona · 18:00',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
