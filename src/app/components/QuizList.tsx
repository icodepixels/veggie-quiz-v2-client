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
    dispatch(fetchQuizzes());
  }, [dispatch]);

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
    <div className="space-y-12">
      {Object.entries(quizzesByCategory).map(([category, quizzes]) => (
        <div key={category} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-4 relative overflow-hidden">
            {/* Decorative leaf pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M0,0 L100,0 L100,100 L0,100 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                />
                <path
                  d="M20,20 Q40,0 60,20 T100,20 M20,50 Q40,30 60,50 T100,50 M20,80 Q40,60 60,80 T100,80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center relative">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {category}
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/quiz/${quiz.id}`}
                  className="group relative block bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors flex-1 pr-2">
                        {quiz.name}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 whitespace-nowrap flex-shrink-0">
                        {quiz.questions.length} questions
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {quiz.description || 'Test your knowledge with this engaging quiz!'}
                    </p>
                    <div className="flex items-center text-emerald-600 group-hover:translate-x-2 transition-transform">
                      <span className="text-sm font-medium">Start Quiz</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  {quiz.image && (
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Image
                        src={quiz.image}
                        alt={quiz.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}