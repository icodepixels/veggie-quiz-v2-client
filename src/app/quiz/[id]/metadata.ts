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

  if (!quiz) {
    return {
      title: 'Quiz Not Found - Veggie Quiz',
      description: 'The requested quiz could not be found.',
    };
  }

  return {
    title: `${quiz.name} - Veggie Quiz`,
    description: quiz.description,
    openGraph: {
      title: `${quiz.name} - Veggie Quiz`,
      description: quiz.description,
      images: quiz.image ? [quiz.image] : ['/logo-v4.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${quiz.name} - Veggie Quiz`,
      description: quiz.description,
      images: quiz.image ? [quiz.image] : ['/logo-v4.png'],
    },
  };
}