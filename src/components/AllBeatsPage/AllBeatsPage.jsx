import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../store/CartSlice";
import { getBeats } from "../../store/BeatSlice";
import { Link } from "react-router-dom";
import { PlayCircle, PauseCircle } from "lucide-react";
import { AiOutlineHeart } from "react-icons/ai";
import { BsPlayCircle, BsThreeDots } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi"; // added cart icon
import { useAudioPlayer } from "../../context/GlobalAudioPlayerContext"; // use global audio player

console.log("all beats loaded");

const CLOUDINARY_BASE = "https://res.cloudinary.com/dqmbquytc/";

export const AllBeatsPage = () => {
  const dispatch = useDispatch();
  const { data: beats } = useSelector((state) => state.beat);
  const [hoveredBeat, setHoveredBeat] = useState(null);
  // State for tracking which beat's dropdown is open.
  const [dropdownBeatId, setDropdownBeatId] = useState(null);

  // Use global audio player context.
  const { playTrack, activeBeat, isPlaying } = useAudioPlayer();

  useEffect(() => {
    dispatch(getBeats());
  }, [dispatch]);

  const addToCart = (beat) => {
    console.log("Adding beat to cart:", beat);
    dispatch(add(beat));
  };

  // Instead of local handlePlayPause, call global playTrack.
  const handlePlayPause = (beat) => {
    playTrack({
      src: `${CLOUDINARY_BASE}${beat.audio_file}`,
      beatId: beat.id,
    });
  };

  // Toggle dropdown for the three-dots icon.
  const toggleDropdown = (beatId) => {
    setDropdownBeatId((prev) => (prev === beatId ? null : beatId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Beats</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {beats.map((beat) => (
          <div
            key={beat.id}
            className="bg-white shadow-md rounded-lg overflow-hidden relative"
            onMouseEnter={() => setHoveredBeat(beat.id)}
            onMouseLeave={() => setHoveredBeat(null)}
          >
            {/* Image Container with increased height */}
            <div className="relative h-96">
              <img
                src={`${CLOUDINARY_BASE}${beat.image}`}
                alt={beat.title}
                className="w-full h-full object-cover rounded-md"
              />
              {/* Overlay for track details */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h2 className="text-xl font-semibold text-white">
                  {beat.title}
                </h2>
                <h3 className="text-md text-gray-200">
                  by {beat.producer} producer
                </h3>
                <p className="text-sm text-gray-200">Genre: {beat.genre}</p>
                <p className="text-sm text-gray-200">
                  Price: Ksh. {beat.price}
                </p>
              </div>
              {/* Centered play/pause overlay */}
              {hoveredBeat === beat.id && (
                <div className="absolute top-1/2 left-[40%] transform -translate-x-1/2 -translate-y-1/2 text-white">
                  <button
                    onClick={() => handlePlayPause(beat)}
                    className="flex items-center justify-center bg-black bg-opacity-30 rounded-full p-2"
                  >
                    {activeBeat === beat.id && isPlaying ? (
                      <PauseCircle size={50} />
                    ) : (
                      <PlayCircle size={50} />
                    )}
                  </button>
                </div>
              )}
              {/* Bottom-right icons overlay */}
              <div className="absolute bottom-0 right-0 text-white">
                <div className="flex p-3 space-x-3">
                  <AiOutlineHeart size={22} className="cursor-pointer" />
                  <div className="relative">
                    <BsThreeDots
                      size={22}
                      className="cursor-pointer"
                      onClick={() => toggleDropdown(beat.id)}
                    />
                    {dropdownBeatId === beat.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-10">
                        <Link
                          to={`/beat/${beat.id}`}
                          className="block px-4 py-2 hover:bg-gray-200"
                          onClick={() => setDropdownBeatId(null)}
                        >
                          View Details
                        </Link>
                      </div>
                    )}
                  </div>
                  <FiShoppingCart
                    size={22}
                    className="cursor-pointer"
                    onClick={() => addToCart(beat)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
