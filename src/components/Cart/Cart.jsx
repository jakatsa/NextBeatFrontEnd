import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { remove, setCart } from "../../store/CartSlice"; // Import setCart action

export const Cart = () => {
  const dispatch = useDispatch();
  const currentAudio = useRef(null);
  const cartItems = useSelector((state) => state.cart);

  // Load cart from local storage when the component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        dispatch(setCart(parsedCart)); // Set the cart from local storage
      } catch (error) {
        console.error("Error parsing cart from local storage:", error);
      }
    }
  }, [dispatch]);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems"); // Remove local storage if cart is empty
    }
  }, [cartItems]);

  const handlePlay = (event) => {
    if (currentAudio.current && currentAudio.current !== event.target) {
      currentAudio.current.pause(); // Pause the previously playing audio
    }
    currentAudio.current = event.target;
  };

  const removeFromCart = (id) => {
    dispatch(remove(id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Cart Items</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        cartItems.map((beat) => (
          <div key={beat.id} className="my-4 p-4 bg-gray-100 rounded shadow">
            <h2 className="text-lg font-bold">{beat.title}</h2>
            <p>Genre: {beat.genre}</p>
            <p>Price: Ksh. {beat.price}</p>
            <p>Created on: {new Date(beat.created_at).toLocaleDateString()}</p>
            <audio
              controls
              className="w-full my-2"
              onPlay={handlePlay} // Handle play event with useRef
            >
              <source src={beat.audio_file} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
            <button
              onClick={() => removeFromCart(beat.id)}
              className="mt-2 py-1 px-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove From Cart
            </button>
            <button className="ml-4 mt-2 py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
              Check Out
            </button>
          </div>
        ))
      )}
    </div>
  );
};
