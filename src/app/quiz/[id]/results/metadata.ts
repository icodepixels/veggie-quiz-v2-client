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
      title: 'Quiz Results Not Found - Veggie Quiz',
      description: 'The requested quiz results could not be found.',
    };
  }

  return {
    title: `Results: ${quiz.name} - Veggie Quiz`,
    description: `See how well you did on the ${quiz.name} quiz! ${quiz.description}`,
    openGraph: {
      title: `Results: ${quiz.name} - Veggie Quiz`,
      description: `See how well you did on the ${quiz.name} quiz! ${quiz.description}`,
      images: quiz.image ? [quiz.image] : ['/logo-v4.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Results: ${quiz.name} - Veggie Quiz`,
      description: `See how well you did on the ${quiz.name} quiz! ${quiz.description}`,
      images: quiz.image ? [quiz.image] : ['/logo-v4.png'],
    },
  };
}