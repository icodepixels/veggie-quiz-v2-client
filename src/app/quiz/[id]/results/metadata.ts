import { Metadata, Viewport } from 'next';
import { getQuizById } from '@/app/actions/quizActions';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateViewport({ params }: Props): Promise<Viewport> {
  try {
    const quiz = await getQuizById(params.id);

    if (!quiz) {
      return {
        themeColor: '#388E3C',
        width: 'device-width',
        initialScale: 1,
      };
    }

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

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  // Get quiz data
  const quiz = await getQuizById(params.id);
  console.log("quiz", params);

  if (!quiz) {
    return {
      title: 'Quiz Results Not Found - Veggie Quiz',
      description: 'The requested quiz results could not be found.',
    };
  }

  // Try to get score information from search params
  const score = searchParams.score ? Number(searchParams.score) : null;
  const total = searchParams.total ? Number(searchParams.total) : null;
  const scoreText = score !== null && total !== null
    ? `You scored ${score}/${total} (${Math.round((score / total) * 100)}%)! `
    : '';

  // Use the quiz image or fall back to the default logo
  const imageUrl = quiz.image || '/logo-v4.png';
  // Ensure the URL is absolute
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://veggiequiz.com'}${imageUrl}`;

  return {
    title: `Results: ${quiz.name} - Veggie Quiz`,
    description: `${scoreText}See how well you did on the ${quiz.name} quiz! ${quiz.description}`,
    keywords: [`${quiz.name} results`, 'quiz results', 'veggie quiz', 'plant-based nutrition', 'nutrition quiz results'],
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
      title: `Results: ${quiz.name} - Veggie Quiz`,
      description: `${scoreText}See how well you did on the ${quiz.name} quiz! ${quiz.description}`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://veggiequiz.com'}/quiz/${params.id}/results`,
      siteName: 'Veggie Quiz',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: `${quiz.name} Results`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Results: ${quiz.name} - Veggie Quiz`,
      description: `${scoreText}See how well you did on the ${quiz.name} quiz! ${quiz.description}`,
      images: [fullImageUrl],
      creator: '@veggiequiz',
    },
    other: {
      'revisit-after': '7 days',
    }
  };
}