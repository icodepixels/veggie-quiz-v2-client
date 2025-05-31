import { Metadata } from 'next';
import { getQuizById } from '@/app/actions/quizActions';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Get quiz data
  const quiz = await getQuizById(params.id);
  console.log("params", params);


  if (!quiz) {
    return {
      title: 'Quiz Not Found - Veggie Quiz',
      description: 'The requested quiz could not be found.',
    };
  }

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
}