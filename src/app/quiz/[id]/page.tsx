'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

// Custom CSS for theme-specific gradient animation and card shadow
const getGradientStyle = (theme: string) => {
  let gradientColors;

  switch (theme) {
    case 'pink':
      gradientColors = 'linear-gradient(to right, white, #FFF3D6, #FF8A30, #F57C00, #FF8A30, #FFF3D6, white)';
      break;
    case 'teal':
      gradientColors = 'linear-gradient(to right, white, #66BB6A, #388E3C, #43A047, #388E3C, #66BB6A, white)';
      break;
    default: // blue
      gradientColors = 'linear-gradient(to right, white, #FBE9A7, #FF8A30, #3E2C1A, #FF8A30, #FBE9A7, white)';
      break;
  }

  return {
    backgroundImage: gradientColors,
    backgroundSize: '200% 100%',
    animation: 'gradientMove 8s linear infinite',
  };
};

const cardShadowStyle = {
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface Question {
  id: number;
  question_text: string;
  choices: string[];
  correct_answer_index: number;
  explanation: string;
  image?: string;
}

interface Quiz {
  id: number;
  name: string;
  description: string;
  image?: string;
  questions: Question[];
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = searchParams.get('theme') || 'blue';
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'pink':
        return {
          border: 'border-pink-400',
          text: 'text-pink-600',
          bg: 'bg-pink-500',
          hoverBg: 'hover:bg-pink-600',
          bgLight: 'bg-pink-50',
          borderLight: 'border-pink-200',
          correct: 'bg-pink-50 border-pink-500 text-pink-700'
        };
      case 'teal':
        return {
          border: 'border-teal-400',
          text: 'text-teal-600',
          bg: 'bg-teal-500',
          hoverBg: 'hover:bg-teal-600',
          bgLight: 'bg-teal-50',
          borderLight: 'border-teal-200',
          correct: 'bg-teal-50 border-teal-500 text-teal-700'
        };
      default: // blue
        return {
          border: 'border-blue-400',
          text: 'text-blue-600',
          bg: 'bg-blue-500',
          hoverBg: 'hover:bg-blue-600',
          bgLight: 'bg-blue-50',
          borderLight: 'border-blue-200',
          correct: 'bg-blue-50 border-blue-500 text-blue-700'
        };
    }
  };

  const themeClasses = getThemeClasses(theme);

  const gradientStyle = getGradientStyle(theme);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      try {
        const quizId = params.id;
        if (!quizId) {
          throw new Error('Quiz ID is required');
        }

        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }
        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch quiz');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === quiz?.questions[currentQuestionIndex].correct_answer_index) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length ?? 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz is complete, navigate to results page
      const totalQuestions = quiz?.questions.length ?? 0;
      router.push(`/quiz/${quiz?.id}/results?score=${score}&total=${totalQuestions}&theme=${theme}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Growing your quiz garden...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error || 'Quiz not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={cardShadowStyle}>
          {/* Theme-based Gradient Border Container */}
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={gradientStyle}></div>
          </div>

          {/* Main Quiz Container with very small margin to show the gradient border */}
          <div className="relative bg-white rounded-xl m-0.5 overflow-hidden z-10">
            <div className="bg-white px-6 pt-6 pb-2">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-extrabold text-gray-900 border-l-4 pl-3" style={{ borderColor: theme === 'blue' ? '#60a5fa' : theme === 'pink' ? '#f472b6' : '#2dd4bf' }}>{quiz.name}</h2>
                <span className={`text-gray-700 text-sm font-medium px-2 py-0.5 rounded-full ${themeClasses.bgLight} border ${themeClasses.borderLight} whitespace-nowrap`}>
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Your Progress</span>
                  <span>Score: {score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${themeClasses.bg} h-2.5 rounded-full transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  {currentQuestion.question_text}
                </h3>
              </div>

              {/* Answer choices */}
              <div className="space-y-4 mb-8">
                {currentQuestion.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? index === currentQuestion.correct_answer_index
                          ? themeClasses.correct
                          : 'bg-pink-50 border-pink-500 text-pink-700'
                        : selectedAnswer !== null && index === currentQuestion.correct_answer_index
                        ? themeClasses.correct
                        : `bg-white border-gray-200 hover:border-${theme}-300 hover:bg-${theme}-50`
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 mr-3">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {choice}
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="mb-8 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="flex items-start">
                    <svg className={`w-5 h-5 ${themeClasses.text} mt-0.5 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-800">{currentQuestion.explanation}</p>
                  </div>
                </div>
              )}

              {/* Next button */}
              {selectedAnswer !== null && (
                <button
                  onClick={handleNextQuestion}
                  className={`w-full ${themeClasses.bg} text-white py-3 px-4 rounded-xl ${themeClasses.hoverBg} transition-colors flex items-center justify-center shadow-sm`}
                >
                  {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Animation keyframes */}
        <style jsx global>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}</style>
      </div>
    </div>
  );
}