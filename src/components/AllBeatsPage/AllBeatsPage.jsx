import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../store/CartSlice";
import { getBeats } from "../../store/BeatSlice";
import { Link } from "react-router-dom";

export const AllBeatsPage = () => {
  const dispatch = useDispatch();
  const { data: beats, status } = useSelector((state) => state.beat);
  const currentAudio = useRef(null); // Keep track of the currently playing audio

  useEffect(() => {
    dispatch(getBeats());
  }, [dispatch]);

  const handlePlay = (event) => {
    if (currentAudio.current && currentAudio.current !== event.target) {
      currentAudio.current.pause(); // Pause the previously playing audio
    }
    currentAudio.current = event.target; // Update the reference to the current audio
  };

  const addToCart = (beat) => {
    dispatch(add(beat));
  };

  if (status === "Loading") {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (status === "error") {
    return <p className="text-center text-red-500">Error fetching beats...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Beats</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {beats.map((beat) => (
          <div
            key={beat.id}
            className="bg-white shadow-md rounded-lg overflow-hidden p-4"
          >
            <img src={beat.image} alt={beat.title} />
            <h2 className="text-xl font-semibold text-gray-800">
              {beat.title}
            </h2>
            <h2 className="text-xl font-semibold text-gray-800">
              by {beat.producer} producer
            </h2>
            <p className="text-gray-600 mt-2">Genre: {beat.genre}</p>
            <p className="text-gray-600">Price: Ksh. {beat.price}</p>
            <p className="text-gray-500 text-sm">
              Created on: {new Date(beat.created_at).toLocaleDateString()}
            </p>

            <audio
              controls
              className="w-full mt-4"
              onPlay={handlePlay} // Handle play event
            >
              <source src={beat.audio_file} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>

            <Link to={`/beat/${beat.id}`}>
              <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all">
                View Details
              </button>
            </Link>

            <button
              onClick={() => addToCart(beat)}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
