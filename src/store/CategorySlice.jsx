import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  
    data: [],
    status: "idle", //describes whether the api is pending ,fulfilled or rejected. create thunk
  
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  //handles async tasks  in updating  state
  extraReducers: (builder) => {
    //handles the pending state with a 'loading' text
    builder
      .addCase(getCategories.pending, (state, action) => {
        state.status = "Loading";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "Idle";
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.status = "error";
      });
  },
});
//export reducers
export default categorySlice.reducer;
//fetching using create thunk
export const getCategories = createAsyncThunk("categories/get", async () => {
  const data = await fetch("http://127.0.0.1:8000/beats/api/categories/");
  const result = await data.json();
  return result;
});
