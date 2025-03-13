import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../store/CategorySlice";
import { getBeats } from "../../store/BeatSlice";
import { add } from "../../store/CartSlice";
import { Link } from "react-router-dom";
import { PlayCircle, PauseCircle } from "lucide-react";
import { AiOutlineHeart } from "react-icons/ai";
import { BsPlayCircle, BsThreeDots } from "react-icons/bs";

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
  const currentAudio = useRef(null);
  const [activeBeat, setActiveBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredBeat, setHoveredBeat] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);

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

  // Audio play/pause functionality (similar to AllBeatsPage)
  const handlePlayPause = (beatId) => {
    let id = beatId || activeBeat;
    if (!id && currentAudio.current) {
      id = currentAudio.current.id.split("-")[1];
    }
    if (!id) return;

    const audioElement = document.getElementById(`audio-${id}`);
    if (!audioElement) return;

    if (currentAudio.current && currentAudio.current !== audioElement) {
      currentAudio.current.pause();
    }

    if (audioElement.paused) {
      audioElement
        .play()
        .then(() => {
          currentAudio.current = audioElement;
          setActiveBeat(id);
          setIsPlaying(true);
          setShowPlayer(true);
        })
        .catch((error) => console.error("Error playing audio: ", error));
    } else {
      audioElement.pause();
      setIsPlaying(false);
      setActiveBeat(id);
    }
  };

  const handleTimeUpdate = (e) => {
    const audio = e.target;
    setCurrentTime(audio.currentTime);
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleLoadedMetadata = (e) => {
    const audio = e.target;
    setDuration(audio.duration);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentAudio.current) {
      const boundingRect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - boundingRect.left;
      const newTime =
        (clickX / boundingRect.width) * currentAudio.current.duration;
      currentAudio.current.currentTime = newTime;
      setCurrentTime(currentAudio.current.currentTime);
      setProgress(
        (currentAudio.current.currentTime / currentAudio.current.duration) * 100
      );
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Added addToCart function
  const addToCart = (beat) => {
    console.log("Adding beat to cart:", beat);
    dispatch(add(beat));
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
              {/* Image container styled like Card_lg */}
              <div className="img relative h-72">
                <img
                  src={`${CLOUDINARY_BASE}${beat.image}`}
                  alt={beat.title}
                  className="w-full h-full object-cover rounded-md"
                />
                {/* Centered overlay with play icon */}
                {hoveredBeat === beat.id && (
                  <div className="overlay icon absolute top-1/2 left-[40%] text-white transform -translate-x-1/2 -translate-y-1/2">
                    <button onClick={() => handlePlayPause(beat.id)}>
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
                  <div className="flex p-3">
                    <AiOutlineHeart size={22} className="mx-3" />
                    <BsThreeDots size={22} />
                  </div>
                </div>
              </div>
              {/* Text content below image */}
              <div className="text p-4">
                <h3 className="text-md text-gray-500 font-semibold">
                  {beat.title}
                </h3>
                <span className="text-gray-400">
                  by {beat.producer} producer
                </span>
              </div>
              {/* Audio element (hidden) */}
              <audio
                id={`audio-${beat.id}`}
                preload="auto"
                crossOrigin="anonymous"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              >
                <source
                  src={`${CLOUDINARY_BASE}${beat.audio_file}`}
                  type="audio/mpeg"
                />
                Your browser does not support the audio tag.
              </audio>
              <Link to={`/beat/${beat.id}`}>
                <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all">
                  View Details
                </button>
              </Link>
              {/* Added Cart Button */}
              <button
                onClick={() => addToCart(beat)}
                className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No beats available for this category.</p>
      )}

      {showPlayer && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex items-center">
          <button onClick={() => handlePlayPause(activeBeat)} className="mr-4">
            {isPlaying ? <PauseCircle size={40} /> : <PlayCircle size={40} />}
          </button>
          <span className="mr-2">{formatTime(currentTime)}</span>
          <div
            className="w-full bg-gray-600 h-2 rounded-full overflow-hidden relative cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="ml-2">{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};
