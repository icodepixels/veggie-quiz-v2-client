import { Metadata } from 'next';
import { headers } from 'next/headers';

type Props = {
  children: React.ReactNode
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

export async function generateMetadata(): Promise<Metadata> {
  try {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    const quizId = pathname.split('/').pop();

    if (!quizId) {
      return {
        title: 'Veggie Quiz',
        description: 'Test your knowledge about vegetables!',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/quizzes/${quizId}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return {
        title: 'Veggie Quiz',
        description: 'Test your knowledge about vegetables!',
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
      title: 'Veggie Quiz',
      description: 'Test your knowledge about vegetables!',
    };
  }
}

export default function QuizLayout({ children }: Props) {
  return children;
}