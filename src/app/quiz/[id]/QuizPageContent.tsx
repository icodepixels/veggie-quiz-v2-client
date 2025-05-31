'use client';

import { usePathname } from 'next/navigation';
import QuizPageClient from './QuizPageClient';

export default function QuizPageContent() {
  const pathname = usePathname();
  const quizId = pathname.split('/').pop() || '';
  console.log("current route:", quizId);
  return <QuizPageClient quizId={quizId} />;
}