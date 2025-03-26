// src/store/BeatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

export const addBeat = createAsyncThunk(
  "beat/add",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/beats/api/beat/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to add beat");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBeats = createAsyncThunk("beat/get", async () => {
  const data = await fetch(
    " http://127.0.0.1:8000/beats/api/beat/"
    // "https://nextbeatbackend.onrender.com/beats/api/beat/"
  );
  const result = await data.json();
  return result;
});

export const getBeatById = createAsyncThunk("beat/getById", async (id) => {
  const response = await fetch(`http://127.0.0.1:8000/beats/api/beat/${id}/`);
  const result = await response.json();
  return result;
});

const beatSlice = createSlice({
  name: "beat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBeats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBeats.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(getBeats.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(getBeatById.pending, (state) => {
        state.detailsStatus = "loading";
        state.beatDetails = null;
      })
      .addCase(getBeatById.fulfilled, (state, action) => {
        state.detailsStatus = "idle";
        state.beatDetails = action.payload;
      })
      .addCase(getBeatById.rejected, (state, action) => {
        state.detailsStatus = "error";
        state.error = action.error.message;
      })
      .addCase(addBeat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBeat.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.push(action.payload); // Add the new beat to the list
      })
      .addCase(addBeat.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export default beatSlice.reducer;
