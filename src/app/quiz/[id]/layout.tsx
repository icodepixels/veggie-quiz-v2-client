import { Viewport } from 'next';

interface Props {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

async function getQuiz(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const response = await fetch(`${baseUrl}/quizzes/${id}`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
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

export default async function QuizLayout({ children, params }: Props) {
  const quiz = await getQuiz(params.id);

  if (!quiz) {
    return children;
  }

  return (
    <>
      {children}
    </>
  );
}