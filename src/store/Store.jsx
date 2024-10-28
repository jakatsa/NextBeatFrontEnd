import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./CartSlice";
import BeatSlice from "./BeatSlice";
import CategorySlice from "./CategorySlice"
const store = configureStore({
  reducer: {
    cart: CartSlice,
    beat: BeatSlice,
    category:CategorySlice
  },
});

export default store;
