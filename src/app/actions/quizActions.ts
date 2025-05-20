const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function getQuizById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);
    if (!response.ok) {
      throw new Error('Quiz not found');
    }
    const quiz = await response.json();
    return quiz;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return null;
  }
}