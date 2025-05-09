'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchQuizzes } from '../store/quizSlice';

export default function QuizList() {
  const dispatch = useAppDispatch();
  const { quizzesByCategory, loading, error } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center py-8">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      {Object.entries(quizzesByCategory).map(([category, quizzes]) => (
        <div key={category} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.id}`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-semibold text-lg mb-2">{quiz.name}</h3>
                <p className="text-gray-600 text-sm">
                  {quiz.questions.length} questions
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}