import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  status: "idle",
};

//fetching using create thunk
export const getBeats = createAsyncThunk("beat/get", async () => {
  const data = await fetch("http://127.0.0.1:8000/beats/api/beat/");
  const result = await data.json();
  return result;
});
//fetching id using create thunk
export const getBeatById = createAsyncThunk("beat/getById", async (id) => {
  const response = await fetch(`http://127.0.0.1:8000/beats/api/beat/${id}/`);
  const result = await response.json();
  return result;
});

const beatSlice = createSlice({
  name: "beat",
  initialState,

  //handles async tasks in updating state
  extraReducers: (builder) => {
    //lets hanlde the pending status with a 'loading text'
    builder
      .addCase(getBeats.pending, (state, action) => {
        state.status = "Loading";
      })

      .addCase(getBeats.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "Idle";
      })
      .addCase(getBeats.rejected, (state, action) => {
        state.status = "error";
      })

      // Fetching beat by ID
      .addCase(getBeatById.pending, (state) => {
        state.detailsStatus = "Loading";
        state.beatDetails = null; // Clear previous details while loading
      })
      .addCase(getBeatById.fulfilled, (state, action) => {
        state.beatDetails = action.payload;
        state.detailsStatus = "Idle";
      })
      .addCase(getBeatById.rejected, (state, action) => {
        state.detailsStatus = "error";
        state.error = action.error.message;
      });
  },
});

// exporting reducers
export default beatSlice.reducer;
