import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Question {
  id: number;
  quiz_id: number;
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

interface QuizState {
  quizzesByCategory: { [key: string]: Quiz[] };
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export const fetchQuizzes = createAsyncThunk(
  'quiz/fetchQuizzes',
  async () => {
    const response = await fetch(`${API_BASE_URL}/quizzes`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Expected an array of quizzes but got something else');
    }

    return data as Quiz[];
  }
);

const initialState: QuizState = {
  quizzesByCategory: {},
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        // Group quizzes by category
        const groupedQuizzes = action.payload.reduce((acc: { [key: string]: Quiz[] }, quiz) => {
          if (!acc[quiz.category]) {
            acc[quiz.category] = [];
          }
          acc[quiz.category].push(quiz);
          return acc;
        }, {});

        state.quizzesByCategory = groupedQuizzes;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const quizReducer = quizSlice.reducer;