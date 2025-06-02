'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import AuthForm from '@/app/components/AuthForm';
import { signIn, signOut } from '@/app/store/authSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function QuizResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [quiz, setQuiz] = useState<{
    id: number;
    name: string;
    description: string;
    image?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const score = Number(searchParams.get('score'));
  const total = Number(searchParams.get('total'));
  const theme = searchParams.get('theme') || '#388E3C';
  const percentage = Math.round((score / total) * 100);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizId = window.location.pathname.split('/')[2];
        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }
        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const handleAuthSubmit = async (email: string) => {
    setError(null);
    setMessage(null);

    try {
      if (authMode === 'signup') {
        // Extract username from email (everything before @)
        const username = email.split('@')[0];
        const createResponse = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username }),
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create account');
        }
      }

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

      // Get user details
      const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await userResponse.json();

      dispatch(signIn({
        user: userData,
        token: access_token,
      }));

      setMessage(authMode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setError(null);
    setMessage(null);
  };

  const getResultCategory = () => {
    if (percentage >= 90) return { text: 'Outstanding!', icon: '🌱' };
    if (percentage >= 70) return { text: 'Great Job!', icon: '🌿' };
    if (percentage >= 50) return { text: 'Good Effort!', icon: '🌻' };
    return { text: 'Keep Growing!', icon: '🌱' };
  };

  const resultCategory = getResultCategory();

  useEffect(() => {
    const saveResult = async () => {
      if (!isAuthenticated || !token) {
        console.log('Not authenticated or no token available');
        return;
      }

      setError(null);
      setMessage(null);

      try {
        const quizId = window.location.pathname.split('/')[2];
        if (!quizId) {
          throw new Error('Quiz ID is required');
        }

        // Validate token before making the request
        const validateResponse = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!validateResponse.ok) {
          // Token is invalid, sign out the user
          dispatch(signOut());
          throw new Error('Your session has expired. Please sign in again.');
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
        } else {
          setMessage('Results saved successfully!');
        }
      } catch (error) {
        console.error('Error saving result:', error);
        setError(error instanceof Error ? error.message : 'Failed to save result');
      }
    };

    saveResult();
  }, [isAuthenticated, token, score, total, percentage, dispatch]);

  const validThemeColor = theme.startsWith('#') ? theme : '#388E3C';

  const themeClasses = {
    text: 'text-green-800',
    bg: 'bg-green-400',
    hoverBg: 'hover:bg-green-500',
    bgLight: 'bg-green-50',
    borderLight: 'border-green-200',
    correct: 'bg-green-50 border-green-400 text-green-800'
  };

  if (isLoading && !quiz) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="ml-3 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className={`${!isAuthenticated ? 'blur-sm' : ''}`}>
          <div className="bg-white shadow-md rounded-2xl overflow-hidden border-2" style={{ borderColor: validThemeColor }}>
            <div className="bg-white px-6 pt-6 pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h2 className="text-2xl font-extrabold text-gray-900 border-l-4 pl-3 quiz-title" style={{ borderColor: validThemeColor }}>
                  {resultCategory.text}
                </h2>
                <span className={`text-gray-700 text-sm font-medium px-2 py-0.5 rounded-full ${themeClasses.bgLight} border ${themeClasses.borderLight} self-start sm:self-auto`}>
                  Quiz Complete
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br border-4 mb-4"
                  style={{
                    borderColor: validThemeColor,
                    background: `linear-gradient(to bottom right, ${validThemeColor}22, white)`
                  }}>
                  <span className={`text-4xl font-bold ${themeClasses.text}`}>
                    {percentage}%
                  </span>
                </div>
                <p className="text-lg text-gray-600">
                  You got {score} out of {total} questions correct
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 rounded-xl border-2 border-red-200">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {message && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-800">{message}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => router.push(`/quiz/${quiz?.id}`)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-2xl shadow-md max-w-md w-full p-8 relative border-2" style={{ borderColor: validThemeColor }}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{ background: `linear-gradient(to bottom right, ${validThemeColor}, ${validThemeColor}99)` }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {authMode === 'signin' ? 'Sign in to save your results' : 'Create an account to save your results'}
                </h3>
                <p className="text-gray-600">
                  {authMode === 'signin'
                    ? 'Sign in to track your progress and compare your results over time.'
                    : 'Create an account to track your progress and compare your results over time.'}
                </p>
              </div>

              <AuthForm
                mode={authMode}
                onSubmit={handleAuthSubmit}
                error={error}
              />

              <div className="mt-6 text-center">
                <button
                  onClick={toggleAuthMode}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {authMode === 'signin'
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}