import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./CartSlice";
import BeatSlice from "./BeatSlice";
import CategorySlice from "./CategorySlice";
import SearchSlice from "./SearchSlice";
const store = configureStore({
  reducer: {
    cart: CartSlice,
    beat: BeatSlice,
    category: CategorySlice,
    search: SearchSlice,
  },
});

export default store;
