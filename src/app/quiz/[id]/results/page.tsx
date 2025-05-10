'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function QuizResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const score = Number(searchParams.get('score'));
  const total = Number(searchParams.get('total'));
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    const saveResult = async () => {
      if (!isAuthenticated || !token) return;

      setIsSubmitting(true);
      setError(null);
      setMessage(null);

      try {
        const quizId = window.location.pathname.split('/')[2];
        if (!quizId) {
          throw new Error('Quiz ID is required');
        }

        const response = await fetch(`${API_BASE_URL}/quiz-results`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            quiz_id: Number(quizId),
            score: percentage,
            correct_answers: score,
            total_questions: total,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.detail === 'You have already completed this quiz') {
            setMessage(errorData.detail);
          } else {
            throw new Error(errorData.detail || 'Failed to save result');
          }
        }
      } catch (error) {
        console.error('Error saving result:', error);
        setError(error instanceof Error ? error.message : 'Failed to save result');
      } finally {
        setIsSubmitting(false);
      }
    };

    saveResult();
  }, [isAuthenticated, token, score, total, percentage]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Quiz Results
            </h3>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 mb-4">
                <span className="text-4xl font-bold text-blue-600">
                  {percentage}%
                </span>
              </div>
              <p className="text-lg text-gray-600">
                You got {score} out of {total} questions correct
              </p>
              {error && (
                <p className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
              {message && (
                <p className="mt-2 text-sm text-blue-600">
                  {message}
                </p>
              )}
              {isSubmitting && (
                <p className="mt-2 text-sm text-gray-600">
                  Saving your result...
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </button>
              <button
                onClick={() => router.back()}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}