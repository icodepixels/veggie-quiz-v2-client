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

        {/* Primary Meta Tags */}
        <meta name="title" content="Veggie Quiz - Fun Plant-Based Nutrition Learning" />
        <meta name="description" content="Discover the science of plant-based nutrition through fun, bite-sized quizzes. Learn how fruits, veggies, herbs, and legumes fuel your body and protect your health." />
        <meta name="keywords" content="veggie quiz, plant-based nutrition, healthy eating, nutrition education, vegetable facts, fruit facts, herbs, legumes, health quiz, nutrition quiz, healthy living" />
        <meta name="author" content="Veggie Quiz" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://veggiequiz.com/" />
        <meta property="og:title" content="Veggie Quiz - Fun Plant-Based Nutrition Learning" />
        <meta property="og:description" content="Discover the science of plant-based nutrition through fun, bite-sized quizzes. Learn how fruits, veggies, herbs, and legumes fuel your body and protect your health." />
        <meta property="og:image" content="/logo-v4.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://veggiequiz.com/" />
        <meta property="twitter:title" content="Veggie Quiz - Fun Plant-Based Nutrition Learning" />
        <meta property="twitter:description" content="Discover the science of plant-based nutrition through fun, bite-sized quizzes. Learn how fruits, veggies, herbs, and legumes fuel your body and protect your health." />
        <meta property="twitter:image" content="//logo-v4.png" />

        {/* Favicon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#388E3C" />
        <meta name="msapplication-TileColor" content="#388E3C" />
        <meta name="theme-color" content="#388E3C" />
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
