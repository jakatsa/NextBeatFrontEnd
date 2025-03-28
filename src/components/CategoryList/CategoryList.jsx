import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../store/CategorySlice";
import { getBeats } from "../../store/BeatSlice";
import { add } from "../../store/CartSlice";
import { Link } from "react-router-dom";
import { PlayCircle, PauseCircle } from "lucide-react";
import { AiOutlineHeart } from "react-icons/ai";
import { BsPlayCircle, BsThreeDots } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi"; // added cart icon
import { useAudioPlayer } from "../../context/GlobalAudioPlayerContext"; // use global audio player

const CLOUDINARY_BASE = "https://res.cloudinary.com/dqmbquytc/";

export const CategoryList = () => {
  const dispatch = useDispatch();
  const { data: categories, status: catStatus } = useSelector(
    (state) => state.category
  );
  const { data: beats, status: beatStatus } = useSelector(
    (state) => state.beat
  );
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredBeat, setHoveredBeat] = useState(null);
  // New state for tracking which beat's dropdown is open
  const [dropdownBeatId, setDropdownBeatId] = useState(null);

  // Use global audio player context
  const { playTrack, activeBeat, isPlaying } = useAudioPlayer();

  // Fetch categories and beats on mount
  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBeats());
  }, [dispatch]);

  // Auto-select trending category or default to first category
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const trendingCategory =
        categories.find((cat) => cat.name.toLowerCase().includes("trending")) ||
        categories[0];
      setSelectedCategory(trendingCategory);
    }
  }, [categories, selectedCategory]);

  // Manual category selection if needed
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Filter beats by selected category (each beat has a "categories" array)
  const filteredBeats = selectedCategory
    ? beats.filter((beat) => beat.categories.includes(selectedCategory.id))
    : [];

  // When user clicks play, call global playTrack.
  const handlePlayPause = (beat) => {
    playTrack({
      src: `${CLOUDINARY_BASE}${beat.audio_file}`,
      beatId: beat.id,
    });
  };

  const addToCart = (beat) => {
    console.log("Adding beat to cart:", beat);
    dispatch(add(beat));
  };

  // Toggle dropdown for the three-dots icon
  const toggleDropdown = (beatId) => {
    setDropdownBeatId((prev) => (prev === beatId ? null : beatId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Categories</h1>
      <div className="mb-8">
        {catStatus === "loading" ? (
          <p>Loading categories...</p>
        ) : catStatus === "error" ? (
          <p>Error loading categories.</p>
        ) : (
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`mr-4 mb-2 px-4 py-2 rounded ${
                selectedCategory && selectedCategory.id === category.id
                  ? "bg-gray-300"
                  : "bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">
        Beats in "{selectedCategory ? selectedCategory.name : ""}"
      </h2>

      {beatStatus === "loading" ? (
        <p>Loading beats...</p>
      ) : beatStatus === "error" ? (
        <p>Error loading beats.</p>
      ) : filteredBeats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBeats.map((beat) => (
            <div
              key={beat.id}
              className="bg-white shadow-md rounded-lg overflow-hidden relative"
              onMouseEnter={() => setHoveredBeat(beat.id)}
              onMouseLeave={() => setHoveredBeat(null)}
            >
              {/* Image container with increased height */}
              <div className="relative h-96">
                <img
                  src={`${CLOUDINARY_BASE}${beat.image}`}
                  alt={beat.title}
                  className="w-full h-full object-cover rounded-md"
                />
                {/* Overlay for track details */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-lg font-semibold text-white">
                    {beat.title}
                  </h3>
                  <span className="block text-sm text-gray-300">
                    by {beat.producer} producer
                  </span>
                  <span className="block text-sm text-gray-300">
                    Genre: {beat.genre}
                  </span>
                  <span className="block text-sm text-gray-300">
                    Price: Ksh. {beat.price}
                  </span>
                </div>
                {/* Centered overlay with play icon */}
                {hoveredBeat === beat.id && (
                  <div className="overlay absolute top-1/2 left-[40%] transform -translate-x-1/2 -translate-y-1/2 text-white">
                    <button onClick={() => handlePlayPause(beat)}>
                      {activeBeat === beat.id && isPlaying ? (
                        <PauseCircle size={45} />
                      ) : (
                        <BsPlayCircle size={45} />
                      )}
                    </button>
                  </div>
                )}
                {/* Bottom-right icons overlay */}
                <div className="overlay absolute bottom-0 right-0 text-white">
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
      ) : (
        <p>No beats available for this category.</p>
      )}
    </div>
  );
};
