import type { Metadata, Viewport } from "next";
import { invitationTitle, invitationDescription } from "./wedding";
import "./globals.css";

export const metadata: Metadata = {
  // Deployment target from the existing GitHub Pages workflow; override for a custom host.
  metadataBase: new URL(
    process.env.SITE_URL ?? "https://sodiqov02.github.io/Kamoliddin-Parvina/",
  ),
  title: invitationTitle,
  description: invitationDescription,
  openGraph: {
    title: invitationTitle,
    description: invitationDescription,
    type: "website",
    locale: "uz_UZ",
    images: [
      { url: "./og.png", width: 1200, height: 630, alt: invitationTitle },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: invitationTitle,
    description: invitationDescription,
    images: ["./og.png"],
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FCF6EC",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <head>
        <link rel="icon" href="favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
