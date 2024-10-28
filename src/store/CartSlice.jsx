import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // action creator theres, add ,delete updateb etc
    add(state, action) {
      state.push(action.payload);
    },
    remove(state,action){
      return state.filter(item=>item.id !== action.payload)

    }
  },
});

// exporting actions
export const { add,remove } = cartSlice.actions;

// exporting reducers
export default cartSlice.reducer;
