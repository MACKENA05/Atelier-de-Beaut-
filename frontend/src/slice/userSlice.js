import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const addUser = createAsyncThunk('users/addUser', async (user) => {
  // Simulate API call
  return { ...user, id: Date.now() };
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
  },
  extraReducers: (builder) => {
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.users.push(action.payload);
    });
  },
});

export default userSlice.reducer;