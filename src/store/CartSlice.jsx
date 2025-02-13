import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to the cart (prevent duplicates)
    add(state, action) {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (!existingItem) {
        state.push(action.payload);
      }
    },

    // Remove item from the cart by id
    remove(state, action) {
      return state.filter((item) => item.id !== action.payload);
    },

    // Set the entire cart (useful for restoring from local storage)
    setCart(state, action) {
      return action.payload;
    },
  },
});

// Exporting actions
export const { add, remove, setCart } = cartSlice.actions;

// Exporting reducer
export default cartSlice.reducer;
