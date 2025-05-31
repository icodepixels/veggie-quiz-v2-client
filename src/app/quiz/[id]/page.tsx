'use client';

import { usePathname } from 'next/navigation';
import QuizPageClient from './QuizPageClient';

export default function QuizPage() {
  const pathname = usePathname();
  const quizId = pathname.split('/').pop() || '46';
  return <QuizPageClient quizId={quizId} />;
}