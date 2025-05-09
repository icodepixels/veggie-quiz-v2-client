import { configureStore } from '@reduxjs/toolkit';
import { quizReducer } from './quizSlice';
import { categoryReducer } from './categorySlice';

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;