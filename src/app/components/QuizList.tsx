'use client';

import { useEffect, useState } from 'react';

interface Question {
  question_text: string;
  choices: string[];
  correct_answer_index: number;
  explanation: string;
  category: string;
  difficulty: string;
  image: string;
}

interface Quiz {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  difficulty: string;
  created_at: string;
  questions: Question[];
}

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        console.log('Starting fetch...');
        const response = await fetch('/api/quizzes');

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);

        if (!Array.isArray(data)) {
          throw new Error('Expected an array of quizzes but got something else');
        }

        setQuizzes(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <div className="text-center p-4">Loading quizzes...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="grid gap-6 p-4">
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-2">{quiz.name}</h2>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>Category: {quiz.category}</span>
            <span>Difficulty: {quiz.difficulty}</span>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Questions:</h3>
            <ul className="list-disc list-inside space-y-2">
              {quiz.questions.map((question, index) => (
                <li key={index} className="text-gray-700">
                  {question.question_text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}