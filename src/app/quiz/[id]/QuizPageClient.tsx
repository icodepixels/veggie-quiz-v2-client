'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchQuizById, clearCurrentQuiz } from '@/app/store/quizSlice';

interface QuizPageClientProps {
  quizId: string;
}

// Custom CSS for theme-specific gradient animation and card shadow
const getGradientStyle = (theme: string) => {
  const themeColor = decodeURIComponent(theme);
  const gradientColors = `linear-gradient(to right, white, ${themeColor}, ${themeColor}, white)`;

  return {
    backgroundImage: gradientColors,
    backgroundSize: '200% 100%',
    animation: 'gradientMove 8s linear infinite',
  };
};

export default function QuizPageClient({ quizId }: QuizPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = searchParams.get('theme') || '#388E3C';
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const hasFetchedRef = useRef(false);

  const dispatch = useAppDispatch();
  const { currentQuiz: quiz, loading, error } = useAppSelector((state) => state.quiz);

  const getThemeClasses = (themeColor: string) => {
    const decodedColor = decodeURIComponent(themeColor);

    const defaultClasses = {
      border: 'border-amber-500',
      text: 'text-amber-700',
      bg: 'bg-amber-500',
      hoverBg: 'hover:bg-amber-600',
      bgLight: 'bg-amber-50',
      borderLight: 'border-amber-200',
      correct: 'bg-amber-50 border-amber-500 text-amber-700'
    };

    if (decodedColor.match(/#(388E3C|66BB6A|43A047)/i)) {
      return {
        border: 'border-green-600',
        text: 'text-green-700',
        bg: 'bg-green-600',
        hoverBg: 'hover:bg-green-700',
        bgLight: 'bg-green-50',
        borderLight: 'border-green-200',
        correct: 'bg-green-50 border-green-600 text-green-700'
      };
    }

    if (decodedColor.match(/#(FF8A30|F57C00|3E2C1A)/i)) {
      return {
        border: 'border-amber-500',
        text: 'text-amber-700',
        bg: 'bg-amber-500',
        hoverBg: 'hover:bg-amber-600',
        bgLight: 'bg-amber-50',
        borderLight: 'border-amber-200',
        correct: 'bg-amber-50 border-amber-500 text-amber-700'
      };
    }

    if (decodedColor.match(/#FBE9A7/i)) {
      return {
        border: 'border-yellow-300',
        text: 'text-yellow-800',
        bg: 'bg-yellow-400',
        hoverBg: 'hover:bg-yellow-500',
        bgLight: 'bg-yellow-50',
        borderLight: 'border-yellow-200',
        correct: 'bg-yellow-50 border-yellow-400 text-yellow-800'
      };
    }

    return defaultClasses;
  };

  const themeClasses = getThemeClasses(theme);
  const gradientStyle = getGradientStyle(theme);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    dispatch(fetchQuizById(quizId));

    return () => {
      dispatch(clearCurrentQuiz());
    };
  }, [dispatch, quizId]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !quiz?.questions) return;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === quiz.questions[currentQuestionIndex].correct_answer_index) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!quiz?.questions) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const totalQuestions = quiz.questions.length;
      router.push(`/quiz/${quiz.id}/results?score=${score}&total=${totalQuestions}&theme=${theme}`);
    }
  };

  if (loading || !quiz?.questions) {
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
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={gradientStyle}></div>
          </div>

          <div className="relative bg-white rounded-xl m-0.5 overflow-hidden z-10">
            <div className="bg-white px-6 pt-6 pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-2xl font-extrabold text-gray-900 border-l-4 pl-3 quiz-title" style={{ borderColor: decodeURIComponent(theme) }}>{quiz.name}</h2>
                <span className={`text-gray-700 text-sm font-medium px-2 py-0.5 rounded-full ${themeClasses.bgLight} border ${themeClasses.borderLight} whitespace-nowrap self-start sm:self-auto`}>
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
              </div>
            </div>

            <div className="p-6">
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

              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  {currentQuestion.question_text}
                </h3>
              </div>

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
                      <span className="text-gray-800">{choice}</span>
                    </div>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="mb-8 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="flex items-start">
                    <svg className={`w-5 h-5 ${themeClasses.text} mt-0.5 mr-2 min-w-5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-800">{currentQuestion.explanation}</p>
                  </div>
                </div>
              )}

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