import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBeatById } from "../../store/BeatSlice";

export const BeatDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { beatDetails, loading, error } = useSelector((state) => state.beat);

  useEffect(() => {
    dispatch(getBeatById(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {beatDetails ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
            <img src={beatDetails.image} />
            <h2 className="text-xl font-semibold text-gray-800">
              {beatDetails.title}
            </h2>
            <h2 className="text-xl font-semibold text-gray-800">
              by {beatDetails.producer} producer
            </h2>

            <p className="text-gray-600 mt-2">Genre: {beatDetails.genre}</p>
            <p className="text-gray-600">Price: Ksh. {beatDetails.price}</p>
            <p className="text-gray-500 text-sm">
              Created on:{" "}
              {new Date(beatDetails.created_at).toLocaleDateString()}
            </p>

            <audio controls className="w-full mt-4">
              <source src={beatDetails.audio_file} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>

            {/* <button
            onClick={() => addToCart(beatDetails)}
            className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
          >
            Add to Cart
          </button> */}
          </div>
        ) : (
          <p>Beat not found</p>
        )}
      </div>
    </div>
  );
};
