'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '@/app/store/hooks';

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
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
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
      // Quiz is complete, save results and navigate to results page
      const totalQuestions = quiz?.questions.length ?? 0;
      const percentage = Math.round((score / totalQuestions) * 100);

      // Save results if user is authenticated
      if (isAuthenticated && token) {
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        fetch(`${API_BASE_URL}/quiz-results`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            quiz_id: quiz?.id,
            score: percentage,
            correct_answers: score,
            total_questions: totalQuestions,
          }),
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(data => {
              if (data.detail === 'You have already completed this quiz') {
                setMessage(data.detail);
              } else {
                throw new Error(data.detail || 'Failed to save result');
              }
            });
          }
        })
        .catch(error => {
          console.error('Error saving result:', error);
          setError(error instanceof Error ? error.message : 'Failed to save result');
        })
        .finally(() => {
          setIsSubmitting(false);
          router.push(`/quiz/${quiz?.id}/results?score=${score}&total=${totalQuestions}`);
        });
      } else {
        // If not authenticated, just go to results page
        router.push(`/quiz/${quiz?.id}/results?score=${score}&total=${totalQuestions}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Quiz not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                {currentQuestion.question_text}
              </h3>
              {currentQuestion.image && (
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={currentQuestion.image}
                    alt="Question image"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Answer choices */}
            <div className="space-y-4 mb-8">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedAnswer === index
                      ? index === currentQuestion.correct_answer_index
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : selectedAnswer !== null && index === currentQuestion.correct_answer_index
                      ? 'bg-green-100 border-green-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">{message}</p>
              </div>
            )}

            {/* Next button */}
            {selectedAnswer !== null && (
              <button
                onClick={handleNextQuestion}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}