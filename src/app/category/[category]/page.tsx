'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchQuizzes } from '@/app/store/quizSlice';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export default function CategoryPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { quizzesByCategory, loading, error } = useAppSelector((state) => state.quiz);
  const category = capitalizeFirstLetter(params.category as string);
  const quizzes = quizzesByCategory[category] || [];

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
      <h1 className="text-3xl font-bold mb-8">{category}</h1>
      {quizzes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No quizzes available for this category.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {quiz.image && (
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={quiz.image}
                    alt={quiz.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold mb-2">{quiz.name}</h2>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {quiz.questions.length} questions
                </span>
                <span className="text-sm text-gray-500">
                  Difficulty: {quiz.difficulty}
                </span>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Start Quiz
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}