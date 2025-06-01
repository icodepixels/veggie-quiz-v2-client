import { Metadata, Viewport } from 'next';

type Props = {
  children: React.ReactNode;
  params: { id: string };
}

// This function will be called at build time to generate static paths
export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const response = await fetch(`${baseUrl}/quizzes`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return [];
  }

  const quizzes = await response.json();
  return quizzes.map((quiz: { id: number }) => ({
    id: quiz.id.toString(),
  }));
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/quizzes/${params.id}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return {
        themeColor: '#388E3C',
        width: 'device-width',
        initialScale: 1,
      };
    }

    const quiz = await response.json();
    const themeColor = quiz.theme_color || '#388E3C';

    return {
      themeColor,
      width: 'device-width',
      initialScale: 1,
    };
  } catch {
    return {
      themeColor: '#388E3C',
      width: 'device-width',
      initialScale: 1,
    };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/quizzes/${params.id}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return {
        title: 'Quiz Not Found - Veggie Quiz',
        description: 'The requested quiz could not be found.',
      };
    }

    const quiz = await response.json();

    // Use the quiz image or fall back to the default logo
    const imageUrl = quiz.image || '/logo-v4.png';
    // Ensure the URL is absolute
    const fullImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://veggiequiz.com'}${imageUrl}`;

    return {
      title: `${quiz.name} - Veggie Quiz`,
      description: quiz.description,
      keywords: [`${quiz.name}`, 'veggie quiz', 'plant-based nutrition', 'vegetable facts', 'nutrition education'],
      authors: [{ name: 'Veggie Quiz' }],
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
        title: `${quiz.name} - Veggie Quiz`,
        description: quiz.description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://veggiequiz.com'}/quiz/${params.id}`,
        siteName: 'Veggie Quiz',
        locale: 'en_US',
        type: 'website',
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: quiz.name,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${quiz.name} - Veggie Quiz`,
        description: quiz.description,
        images: [fullImageUrl],
        creator: '@veggiequiz',
      },
      other: {
        'revisit-after': '7 days',
      }
    };
  } catch {
    return {
      title: 'Quiz Not Found - Veggie Quiz',
      description: 'The requested quiz could not be found.',
    };
  }
}

export default async function QuizLayout({ children, params }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const response = await fetch(`${baseUrl}/quizzes/${params.id}`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    return children;
  }

  return (
    <>
      {children}
    </>
  );
}