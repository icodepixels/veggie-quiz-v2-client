'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import AuthForm from '@/app/components/AuthForm';
import { signIn } from '@/app/store/authSlice';
import DynamicMetaTags from '@/app/components/DynamicMetaTags';

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
  const [quiz, setQuiz] = useState<{
    id: number;
    name: string;
    description: string;
    image?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const score = Number(searchParams.get('score'));
  const total = Number(searchParams.get('total'));
  // Default to a green theme if no valid theme color is provided
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

  // Validate if the theme is a proper hex color, otherwise use default green
  // Get theme-specific styling classes
  const getThemeClasses = (themeColor: string) => {
    // Generate theme classes based on the hex color
    const decodedColor = decodeURIComponent(themeColor);

    // Set default classes (amber/earth tones as default)
    const defaultClasses = {
      border: 'border-amber-500',
      text: 'text-amber-700',
      bg: 'bg-amber-500',
      hoverBg: 'hover:bg-amber-600',
      bgLight: 'bg-amber-50',
      borderLight: 'border-amber-200',
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-amber-600',
      borderColor: decodedColor
    };

    // Green colors (#388E3C, #66BB6A, #43A047)
    if (decodedColor.match(/#(388E3C|66BB6A|43A047)/i)) {
        return {
        border: 'border-green-600',
        text: 'text-green-700',
        bg: 'bg-green-600',
        hoverBg: 'hover:bg-green-700',
        bgLight: 'bg-green-50',
        borderLight: 'border-green-200',
        gradientFrom: 'from-green-500',
        gradientTo: 'to-green-700',
        borderColor: decodedColor
      };
    }

    // Orange/brown colors (#FF8A30, #F57C00, #3E2C1A)
    if (decodedColor.match(/#(FF8A30|F57C00|3E2C1A)/i)) {
        return {
        border: 'border-amber-500',
        text: 'text-amber-700',
        bg: 'bg-amber-500',
        hoverBg: 'hover:bg-amber-600',
        bgLight: 'bg-amber-50',
        borderLight: 'border-amber-200',
        gradientFrom: 'from-amber-400',
        gradientTo: 'to-amber-600',
        borderColor: decodedColor
      };
    }

    // Light yellow (#FBE9A7)
    if (decodedColor.match(/#FBE9A7/i)) {
        return {
        border: 'border-yellow-300',
        text: 'text-yellow-800',
        bg: 'bg-yellow-400',
        hoverBg: 'hover:bg-yellow-500',
        bgLight: 'bg-yellow-50',
        borderLight: 'border-yellow-200',
        gradientFrom: 'from-yellow-300',
        gradientTo: 'to-yellow-400',
        borderColor: decodedColor
      };
    }

    return defaultClasses;
  };

  // Make sure we're using the actual hex color theme
  const decodedTheme = decodeURIComponent(theme);

  // Validate the theme format is a proper hex color
  const isValidHexColor = /^#([0-9A-F]{3}){1,2}$/i.test(decodedTheme);
  const validThemeColor = isValidHexColor ? decodedTheme : '#388E3C';

  const themeClasses = getThemeClasses(validThemeColor);

  // Determine the result category and color
  const getResultCategory = () => {
    if (percentage >= 90) return { text: 'Outstanding!', icon: '🌱' };
    if (percentage >= 70) return { text: 'Great Job!', icon: '🌿' };
    if (percentage >= 50) return { text: 'Good Effort!', icon: '🌻' };
    return { text: 'Keep Growing!', icon: '🌱' };
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
        {/* Score Display */}
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

        {/* Messages */}
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
          <div className={`mb-6 p-4 ${themeClasses.bgLight} rounded-xl border-2 ${themeClasses.borderLight}`}>
            <div className="flex items-start">
              <svg className={`w-5 h-5 ${themeClasses.text} mt-0.5 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={`${themeClasses.text}`}>{message}</p>
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
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
              className="w-full text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center shadow-sm"
                            style={{
                backgroundColor: validThemeColor
              }}
              onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(90%)'}
              onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(100%)'}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </button>
          <button
            onClick={() => router.back()}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center"
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
    <>
      {quiz ? (
        <DynamicMetaTags
          title={`Results: ${quiz.name} - Veggie Quiz`}
          description={`You scored ${score}/${total} (${percentage}%)! See how well you did on the ${quiz.name} quiz! ${quiz.description}`}
          ogTitle={`Results: ${quiz.name} - Veggie Quiz`}
          ogDescription={`You scored ${score}/${total} (${percentage}%)! See how well you did on the ${quiz.name} quiz! ${quiz.description}`}
          ogImage={quiz.image}
          twitterTitle={`Results: ${quiz.name} - Veggie Quiz`}
          twitterDescription={`You scored ${score}/${total} (${percentage}%)! See how well you did on the ${quiz.name} quiz! ${quiz.description}`}
          twitterImage={quiz.image}
        />
      ) : (
        <DynamicMetaTags
          title={isLoading ? "Loading Results - Veggie Quiz" : "Quiz Results - Veggie Quiz"}
          description={isLoading ? "Loading your quiz results..." : "View your quiz results!"}
        />
      )}
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        {isLoading && !quiz ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="ml-3 text-gray-600">Loading results...</p>
          </div>
        ) : (
      <div className="max-w-3xl mx-auto">
        {/* Results Content */}
        <div className={`${!isAuthenticated ? 'blur-sm' : ''}`}>
          <ResultsContent />
        </div>
      </div>
        )}

      {/* Auth Modal */}
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
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
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
                        className="font-medium transition-colors"
                        style={{ color: validThemeColor }}
                        onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      Create one here
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signin')}
                        className="font-medium transition-colors"
                        style={{ color: validThemeColor }}
                        onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
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
    </>
  );
}