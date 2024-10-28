import React from "react";
import { useSelector } from "react-redux";
import { remove } from "../../store/CartSlice";
import { useDispatch } from "react-redux";
export const Cart = () => {
  const beat = useSelector((state) => state.cart);
  console.log(beat);

  const dispatch = useDispatch();

  const removeFromCart = (id) => {
    //remove action
    dispatch(remove(id));
  };

  const flattenedBeat = beat[0] || [];
  const card = flattenedBeat.map((beats, index) => (
    <div key={beats.id || index}>
      <h1>{beats.title}</h1>
      <h1>{beats.genre}</h1>
      <p>Ksh. {beats.price}</p>
      <p>created on: {beats.created_at}</p>
      {console.log(beats.audio_file)}
      <audio controls>
        <source src={beats.audio_file} type="audio/mpeg" />
        Your browser does not support the audio tag.
      </audio>
      <button onClick={() => removeFromCart(beat.id)}>
        Remove From Cart
      </button>{" "}
      <button>Check Out</button>
      {/* we use callback function since the add to cart function takes in a parameter  */}
    </div>
  ));
  return (
    <div>
      <h1>cart Items</h1>
      {card}
    </div>
  );
};
