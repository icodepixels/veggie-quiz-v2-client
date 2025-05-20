'use client';

import { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export default function DynamicMetaTags({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: MetaTagsProps) {
  useEffect(() => {
    // Helper function to update or create a meta tag
    const updateMetaTag = (name: string, content: string | undefined, property = false) => {
      if (!content) return;

      // Select based on name or property attribute
      const attr = property ? 'property' : 'name';
      const selector = `meta[${attr}="${name}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement;

      if (tag) {
        // Update existing tag
        tag.content = content;
      } else {
        // Create new tag
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        tag.content = content;
        document.head.appendChild(tag);
      }
    };

    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description
    updateMetaTag('description', description);

    // Update OpenGraph tags
    updateMetaTag('og:title', ogTitle, true);
    updateMetaTag('og:description', ogDescription, true);
    updateMetaTag('og:image', ogImage, true);

    // Update Twitter tags
    updateMetaTag('twitter:title', twitterTitle, true);
    updateMetaTag('twitter:description', twitterDescription, true);
    updateMetaTag('twitter:image', twitterImage, true);

  }, [title, description, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, twitterImage]);

  // This component doesn't render anything
  return null;
}