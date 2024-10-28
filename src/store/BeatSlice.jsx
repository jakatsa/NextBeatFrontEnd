import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  status: "idle",
};

const beatSlice = createSlice({
  name: "beat",
  initialState,
  //handles synchronous tasks
  // reducers: {
  //   // fetchBeat(state, action) {
  //   //   state.data = action.payload;
  //   // },
  // },
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
      });
  },
});

// exporting actions
//export const { fetchBeat } = beatSlice.actions;

// exporting reducers
export default beatSlice.reducer;
//fetching using create thunk
export const getBeats = createAsyncThunk("beat/get", async () => {
  const data = await fetch("http://127.0.0.1:8000/beats/api/beat/");
  const result = await data.json();
  return result;
});

// export function getBeat() {
//   return async function getBeatThunk(dispatch, getState) {
//     const data = await fetch("http://127.0.0.1:8000/beats/api/beat/");
//     const result = await data.json();
//     dispatch(fetchBeat(result));
//   };
// }
