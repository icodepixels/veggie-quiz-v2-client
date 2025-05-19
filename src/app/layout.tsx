import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Providers } from '@/app/providers';
import AuthInitializer from './components/AuthInitializer';
import { Nunito, Fredoka } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Load Nunito font for body text
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

// Load Fredoka for headings and titles
const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Veggie Quiz",
  description: "Test your knowledge about vegetables!",
  other: {
    'google': 'notranslate',
    'content-language': 'en',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} ${fredoka.variable} antialiased`}>
      <head>
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="en" />
      </head>
      <body className={nunito.className}>
        <Providers>
          <AuthInitializer />
          <Navigation />
          <main className="max-w-7xl mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
