import { Suspense } from 'react';
import QuizResultsContent from './QuizResultsContent';

export default function QuizResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="ml-3 text-gray-600">Loading results...</p>
        </div>
      </div>
    }>
      <QuizResultsContent />
    </Suspense>
  );
}