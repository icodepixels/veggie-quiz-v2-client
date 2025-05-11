'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import AuthForm from '@/app/components/AuthForm';
import { signIn } from '@/app/store/authSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function QuizResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const score = Number(searchParams.get('score'));
  const total = Number(searchParams.get('total'));
  const percentage = Math.round((score / total) * 100);

  // Determine the result category and color
  const getResultCategory = () => {
    if (percentage >= 90) return { text: 'Outstanding!', color: 'from-green-500 to-green-600', icon: '🌱' };
    if (percentage >= 70) return { text: 'Great Job!', color: 'from-green-400 to-green-500', icon: '🌿' };
    if (percentage >= 50) return { text: 'Good Effort!', color: 'from-yellow-400 to-yellow-500', icon: '🌻' };
    return { text: 'Keep Growing!', color: 'from-orange-400 to-orange-500', icon: '🌱' };
  };

  const resultCategory = getResultCategory();

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

  const handleAuthSuccess = async (email: string): Promise<void> => {
    try {
      setError(null);

      // Step 1: Get token
      const tokenResponse = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Invalid email');
      }

      const { access_token } = await tokenResponse.json();

      // Step 2: Get user details
      const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await userResponse.json();

      // Step 3: Update Redux store
      dispatch(signIn({
        user: userData,
        token: access_token,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  const ResultsContent = () => (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-green-100">
      <div className={`bg-gradient-to-r ${resultCategory.color} px-6 py-8 text-center`}>
        <div className="text-6xl mb-4">{resultCategory.icon}</div>
        <h2 className="text-3xl font-bold text-white mb-2">{resultCategory.text}</h2>
        <p className="text-white text-opacity-90">You&apos;ve completed the quiz!</p>
      </div>

      <div className="p-8">
        {/* Score Display */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-50 to-white border-4 border-green-100 mb-4">
            <span className="text-4xl font-bold text-green-600">
              {percentage}%
            </span>
          </div>
          <p className="text-lg text-gray-600">
            You got {score} out of {total} questions correct
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-800">{message}</p>
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-600">Saving your result...</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </button>
          <button
            onClick={() => router.back()}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Results Content */}
        <div className={`${!isAuthenticated ? 'blur-sm' : ''}`}>
          <ResultsContent />
        </div>
      </div>

      {/* Auth Modal */}
      {!isAuthenticated && (
        <div className="fixed top-16 left-0 right-0 bottom-0 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative border border-green-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {authMode === 'signin' ? 'Sign in to see your results' : 'Create an account to see your results'}
              </h2>
              <p className="text-gray-600">
                {authMode === 'signin'
                  ? 'Sign in to view and save your quiz results'
                  : 'Create an account to view and save your quiz results'}
              </p>
            </div>

            <AuthForm
              mode={authMode}
              onSubmit={handleAuthSuccess}
              submitButtonText={authMode === 'signin' ? 'Sign In' : 'Create Account'}
              error={error}
            />

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {authMode === 'signin' ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signup')}
                      className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                    >
                      Create one here
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signin')}
                      className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                    >
                      Sign in here
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}