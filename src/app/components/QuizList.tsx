'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchQuizzes } from '../store/quizSlice';

export default function QuizList() {
  const dispatch = useAppDispatch();
  const { quizzesByCategory, loading, error } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    // Only fetch if we don't have any quizzes loaded
    if (Object.keys(quizzesByCategory).length === 0) {
      dispatch(fetchQuizzes());
    }
  }, [dispatch, quizzesByCategory]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Growing your quiz garden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600">Oops! Something went wrong: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {Object.entries(quizzesByCategory).map(([category, quizzes]) => (
        <div key={category} className="bg-white overflow-hidden">
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {quizzes.map((quiz, idx) => {
                // Custom border colors using hex values
                const borderColors = [
                  '#388E3C', '#FBE9A7', '#FF8A30', '#F57C00',
                  '#3E2C1A', '#66BB6A', '#43A047'
                ];
                const themeColors = [
                  'blue',
                  'pink',
                  'teal'
                ];
                const borderColor = borderColors[idx % borderColors.length];
                const themeColor = themeColors[idx % themeColors.length];

                return (
                  <Link
                    key={quiz.id}
                    href={`/quiz/${quiz.id}?theme=${themeColor}`}
                    className={`bg-white rounded-2xl shadow-md border-2 flex flex-col p-6 w-full transition-transform hover:scale-105`}
                    style={{ borderColor }}
                  >
                    {quiz.image && (
                      <div className="relative w-full mb-5 overflow-hidden group">
                        <div className="pb-[100%]"></div> {/* Creates a square aspect ratio */}
                        <div className="absolute inset-0 border-2 rounded-lg z-10 transition-all duration-300 group-hover:border-0" style={{ borderColor }} />
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-20" />
                        <Image
                          src={quiz.image}
                          alt={quiz.name}
                          width={500}
                          height={500}
                          className="rounded-lg object-cover absolute inset-0 w-full h-full transform transition-transform duration-500 group-hover:scale-110 z-0"
                        />
                      </div>
                    )}
                    {/* Name and title */}
                    <div className="mb-2">
                      <div className="font-bold text-lg text-gray-900">{quiz.name}</div>
                    </div>
                    {/* Main text */}
                    <div className="text-gray-800 text-base mt-2 flex-1">
                      {quiz.description || 'Test your knowledge with this engaging quiz!'}
                    </div>
                    <div className="mt-4">
                      <span
                        className="text-sm underline transition-colors"
                        style={{ color: borderColor, textDecoration: 'underline' }}
                        onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(80%)'}
                        onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(100%)'}
                      >
                        Play Quiz
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}