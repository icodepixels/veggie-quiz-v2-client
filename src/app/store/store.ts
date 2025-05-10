import { configureStore } from '@reduxjs/toolkit';
import { quizReducer } from './quizSlice';
import { categoryReducer } from './categorySlice';
import { authReducer } from './authSlice';

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    category: categoryReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;