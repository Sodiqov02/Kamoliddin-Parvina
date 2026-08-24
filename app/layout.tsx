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
  title: 'Азиз & Малика — свадебное приглашение',
  description: 'Мы будем счастливы разделить с вами день нашей свадьбы.',
  openGraph: {
    title: 'Азиз & Малика — свадебное приглашение',
    description: '12 сентября 2026. Откройте наше приглашение.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Азиз & Малика — свадебное приглашение',
    description: '12 сентября 2026. Откройте наше приглашение.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
