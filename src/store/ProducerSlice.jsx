import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch producers
export const fetchProducers = createAsyncThunk(
  "producers/fetchProducers",
  async () => {
    const response = await fetch(
      "https://nextbeatbackend.onrender.com/users/api/producer/"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch producers");
    }
    const producers = await response.json();
    return producers;
  }
);

const producersSlice = createSlice({
  name: "producers",
  initialState: {
    producers: [],
    status: "idle", // Can be 'idle', 'loading', 'succeeded', or 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.producers = action.payload;
      })
      .addCase(fetchProducers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default producersSlice.reducer;
