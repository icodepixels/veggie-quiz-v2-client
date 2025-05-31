import { Suspense } from 'react';
import QuizPageContent from './QuizPageContent';

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizPageContent />
    </Suspense>
  );
}