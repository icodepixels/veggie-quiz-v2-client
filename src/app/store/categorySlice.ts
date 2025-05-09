import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface CategoryState {
  categories: string[];
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { getState }) => {
    const state = getState() as { category: CategoryState };
    // If we already have categories, don't fetch again
    if (state.category.categories.length > 0) {
      return state.category.categories;
    }

    const response = await fetch(`${API_BASE_URL}/quiz-categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data.categories;
  }
);

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const categoryReducer = categorySlice.reducer;