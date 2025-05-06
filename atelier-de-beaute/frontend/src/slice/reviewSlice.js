import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async thunk to fetch reviews for a product
export const fetchReviewsByProduct = createAsyncThunk(
  'reviews/fetchReviewsByProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      return response.data.reviews;
    } catch (err) {
      if (!err.response) {
        return rejectWithValue(`Failed to fetch reviews for product ID ${productId}: Network error or server is down`);
      }
      const { status, data } = err.response;
      if (status === 404) {
        return rejectWithValue(`Failed to fetch reviews for product ID ${productId}: Product not found`);
      } else if (status === 500) {
        return rejectWithValue(`Failed to fetch reviews for product ID ${productId}: Server error`);
      }
      return rejectWithValue(data?.error || `Failed to fetch reviews for product ID ${productId}: ${err.message}`);
    }
  }
);

// Async thunk to post a new review
export const postReview = createAsyncThunk(
  'reviews/postReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        return rejectWithValue(`Failed to submit review for product ID ${productId}: Network error or server is down`);
      }
      const { status, data } = err.response;
      if (status === 404) {
        return rejectWithValue(`Failed to submit review for product ID ${productId}: Product not found`);
      } else if (status === 400) {
        return rejectWithValue(`Failed to submit review for product ID ${productId}: ${data?.error || 'Invalid review data'}`);
      } else if (status === 401) {
        return rejectWithValue(`Failed to submit review for product ID ${productId}: Unauthorized - please log in`);
      } else if (status === 500) {
        return rejectWithValue(`Failed to submit review for product ID ${productId}: Server error`);
      }
      return rejectWithValue(data?.error || `Failed to submit review for product ID ${productId}: ${err.message}`);
    }
  }
);

// Async thunk to update a review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        return rejectWithValue(`Failed to update review ID ${reviewId}: Network error or server is down`);
      }
      const { status, data } = err.response;
      if (status === 404) {
        return rejectWithValue(`Failed to update review ID ${reviewId}: Review not found`);
      } else if (status === 400) {
        return rejectWithValue(`Failed to update review ID ${reviewId}: ${data?.error || 'Invalid review data'}`);
      } else if (status === 401) {
        return rejectWithValue(`Failed to update review ID ${reviewId}: Unauthorized - please log in`);
      } else if (status === 403) {
        return rejectWithValue(`Failed to update review ID ${reviewId}: You do not have permission to edit this review`);
      } else if (status === 500) {
        return rejectWithValue(`Failed to update review ID ${reviewId}: Server error`);
      }
      return rejectWithValue(data?.error || `Failed to update review ID ${reviewId}: ${err.message}`);
    }
  }
);

// Async thunk to delete a review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (err) {
      if (!err.response) {
        return rejectWithValue(`Failed to delete review ID ${reviewId}: Network error or server is down`);
      }
      const { status, data } = err.response;
      if (status === 404) {
        return rejectWithValue(`Failed to delete review ID ${reviewId}: Review not found`);
      } else if (status === 401) {
        return rejectWithValue(`Failed to delete review ID ${reviewId}: Unauthorized - please log in`);
      } else if (status === 403) {
        return rejectWithValue(`Failed to delete review ID ${reviewId}: You do not have permission to delete this review`);
      } else if (status === 500) {
        return rejectWithValue(`Failed to delete review ID ${reviewId}: Server error`);
      }
      return rejectWithValue(data?.error || `Failed to delete review ID ${reviewId}: ${err.message}`);
    }
  }
);

// Async thunk to fetch featured reviews
export const fetchFeaturedReviews = createAsyncThunk(
  'reviews/fetchFeaturedReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reviews/featured');
      return response.data.reviews;
    } catch (err) {
      if (!err.response) {
        return rejectWithValue('Failed to fetch featured reviews: Network error or server is down');
      }
      const { status, data } = err.response;
      if (status === 500) {
        return rejectWithValue('Failed to fetch featured reviews: Server error');
      }
      return rejectWithValue(data?.error || `Failed to fetch featured reviews: ${err.message}`);
    }
  }
);

// Async thunk to fetch reviews by current user
export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/reviews');
      return response.data.reviews;
    } catch (err) {
      if (!err.response) {
        return rejectWithValue('Failed to fetch user reviews: Network error or server is down');
      }
      const { status, data } = err.response;
      if (status === 401) {
        return rejectWithValue('Failed to fetch user reviews: Unauthorized - please log in');
      }
      return rejectWithValue(data?.error || `Failed to fetch user reviews: ${err.message}`);
    }
  }
);


const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReviews(state) {
      state.reviews = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.loading = false;
      })
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(postReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
        state.loading = false;
      })
      .addCase(postReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchFeaturedReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeaturedReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
  },
});

export const { clearReviews } = reviewSlice.actions;

export default reviewSlice.reducer;