import { Metadata } from 'next';
import QuizPageClient from './QuizPageClient';

// Server component for metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const quizId = params.id;
    if (!quizId) {
      return {
        title: 'Quiz Not Found - Veggie Quiz',
        description: 'The requested quiz could not be found.',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/quizzes/${quizId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        title: 'Quiz Not Found - Veggie Quiz',
        description: 'The requested quiz could not be found.',
      };
    }

    const quiz = await response.json();

    return {
      title: `${quiz.name} - Veggie Quiz`,
      description: quiz.description,
      openGraph: {
        title: `${quiz.name} - Veggie Quiz`,
        description: quiz.description,
        images: quiz.image ? [quiz.image] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${quiz.name} - Veggie Quiz`,
        description: quiz.description,
        images: quiz.image ? [quiz.image] : undefined,
      },
    };
  } catch {
    return {
      title: 'Quiz Not Found - Veggie Quiz',
      description: 'The requested quiz could not be found.',
    };
  }
}

// Server component that renders the client component
export default function QuizPage({ params }: { params: { id: string } }) {
  return <QuizPageClient quizId={params.id} />;
}