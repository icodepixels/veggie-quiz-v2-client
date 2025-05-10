import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    email: string;
    username: string;
  };
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify({
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
        }));
      }
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
    },
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const serializedState = localStorage.getItem('auth');
          if (serializedState) {
            const parsedState = JSON.parse(serializedState);
            state.isAuthenticated = parsedState.isAuthenticated;
            state.user = parsedState.user;
            state.token = parsedState.token;
          }
        } catch (err) {
          // If there's an error, keep the initial state
          console.error('Failed to load auth state from localStorage:', err);
        }
      }
    },
  },
});

export const { signIn, signOut, initializeAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;