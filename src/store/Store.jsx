import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./CartSlice";
import BeatSlice from "./BeatSlice";
import CategorySlice from "./CategorySlice";
import SearchSlice from "./SearchSlice";
import ProducerSlice from "./ProducerSlice"
const store = configureStore({
  reducer: {
    cart: CartSlice,
    beat: BeatSlice,
    category: CategorySlice,
    search: SearchSlice,
    producer:ProducerSlice 
  },
});

export default store;
