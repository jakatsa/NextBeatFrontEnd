import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

// Async thunk to post a new beat (including audio and image files)
export const addBeat = createAsyncThunk("beat/add", async (formData) => {
  const response = await fetch("http://127.0.0.1:8000/beats/api/beat/", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to add beat");
  }
  const result = await response.json();
  return result;
});

//fetching beats using create thunk
export const getBeats = createAsyncThunk("beat/get", async () => {
  const data = await fetch("http://127.0.0.1:8000/beats/api/beat/");
  const result = await data.json();
  return result;
});
//fetching beat by id using create thunk
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
    // Fetching all beats
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

      // Fetching beat by ID
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

      // Adding a new beat
      .addCase(addBeat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBeat.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.push(action.payload);  // Add the new beat to the list
      })
      .addCase(addBeat.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      });
  },
});

export default beatSlice.reducer;
