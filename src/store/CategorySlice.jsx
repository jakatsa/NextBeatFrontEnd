import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch categories
export const getCategories = createAsyncThunk("categories/get", async () => {
  const data = await fetch(
    "https://nextbeatbackend.onrender.com/beats/api/categories/"
  );
  const result = await data.json();
  return result;
});

const initialState = {
  data: [],
  status: "idle", //describes whether the API is pending, fulfilled, or rejected
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  extraReducers: (builder) => {
    // Handling the pending state with a 'loading' text
    builder
      .addCase(getCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "idle";
      })
      .addCase(getCategories.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default categorySlice.reducer;
