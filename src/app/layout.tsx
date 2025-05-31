import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Providers } from '@/app/providers';
import AuthInitializer from './components/AuthInitializer';
import { Nunito, Fredoka } from 'next/font/google';
import Script from 'next/script';

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
  description: "Discover the science of plant-based nutrition through fun, bite-sized quizzes. Learn how fruits, veggies, herbs, and legumes fuel your body and protect your health.",
  keywords: ["veggie quiz", "plant-based nutrition", "healthy eating", "nutrition education", "vegetable facts", "fruit facts", "herbs", "legumes", "health quiz", "nutrition quiz", "healthy living"],
  authors: [{ name: "Veggie Quiz" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://veggiequiz.com/',
    title: 'Veggie Quiz - Fun Plant-Based Nutrition Learning',
    description: 'Discover the science of plant-based nutrition through fun, bite-sized quizzes. Learn how fruits, veggies, herbs, and legumes fuel your body and protect your health.',
    siteName: 'Veggie Quiz',
    images: [
      {
        url: '/logo-v4.png',
        width: 1200,
        height: 630,
        alt: 'Veggie Quiz Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veggie Quiz - Fun Plant-Based Nutrition Learning',
    description: 'Discover the science of plant-based nutrition through fun, bite-sized quizzes. Learn how fruits, veggies, herbs, and legumes fuel your body and protect your health.',
    images: ['/logo-v4.png'],
    creator: '@veggiequiz',
  },
  other: {
    'google': 'notranslate',
    'content-language': 'en',
    'revisit-after': '7 days',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#388E3C',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#388E3C',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} ${fredoka.variable} antialiased`}>
      <body>
        <Providers>
          <AuthInitializer />
          <Navigation />
          {children}
        </Providers>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1G7YWC1HSM"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1G7YWC1HSM', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
