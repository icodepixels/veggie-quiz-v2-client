'use client';

import { usePathname } from 'next/navigation';
import QuizPageWrapper from './QuizPageWrapper';

export default function QuizPage() {
  const pathname = usePathname();
  const quizId = pathname.replace('/quiz/', '');
  console.log("quizId", quizId);

  return <QuizPageWrapper params={{ id: quizId }} />;
}