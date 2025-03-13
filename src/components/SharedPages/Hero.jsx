import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBeats } from "../../store/BeatSlice";
import { AiOutlineHeart } from "react-icons/ai";
import { PlayCircle, PauseCircle } from "lucide-react";
import { BsPlayCircle, BsThreeDots } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dqmbquytc/";

// Arrow components for slider navigation.
function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute top-[50%] left-0 text-white cursor-pointer z-20"
    >
      <MdKeyboardArrowLeft size={50} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute top-[50%] right-0 z-20 text-white cursor-pointer"
    >
      <MdKeyboardArrowRight size={50} />
    </div>
  );
}

export const Hero = () => {
  const dispatch = useDispatch();
  const { data: beats } = useSelector((state) => state.beat);
  const [activeBeat, setActiveBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const currentAudio = useRef(null);
  // For hover and dropdown in hero cards.
  const [hoveredBeat, setHoveredBeat] = useState(null);
  const [dropdownBeatId, setDropdownBeatId] = useState(null);

  // Fetch beats on mount.
  useEffect(() => {
    dispatch(getBeats());
  }, [dispatch]);

  // Updated splitting:
  // First three beats for the slider; the rest go to the grid.
  const sliderBeats = beats.slice(0, 3);
  const gridBeats = beats.slice(3);

  const handlePlayPause = (beatId) => {
    const audioElement = document.getElementById(`audio-${beatId}`);
    if (!audioElement) return;

    // Pause any other audio.
    if (currentAudio.current && currentAudio.current !== audioElement) {
      currentAudio.current.pause();
    }

    if (audioElement.paused) {
      audioElement
        .play()
        .then(() => {
          currentAudio.current = audioElement;
          setActiveBeat(beatId);
          setIsPlaying(true);
          setShowPlayer(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    } else {
      audioElement.pause();
      setIsPlaying(false);
      setActiveBeat(beatId);
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
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Toggle dropdown for three-dots icon.
  const toggleDropdown = (beatId) => {
    setDropdownBeatId((prev) => (prev === beatId ? null : beatId));
  };

  // Render function for a beat card in the hero section.
  // The "variant" parameter defines layout: "slider" for the left slider, "grid" for the right grid.
  const renderBeat = (beat, variant = "slider") => {
    const containerClasses =
      variant === "slider"
        ? "box relative h-[92vh] sm:mt-16 w-full"
        : "box relative w-full h-full";
    return (
      <div
        key={beat.id}
        className={containerClasses}
        onMouseEnter={() => setHoveredBeat(beat.id)}
        onMouseLeave={() => {
          setHoveredBeat(null);
          setDropdownBeatId(null);
        }}
      >
        <img
          src={`${CLOUDINARY_BASE}${beat.image}`}
          alt={beat.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay for track details */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-xl font-semibold text-white">{beat.title}</h3>
          <span className="block text-md text-gray-200">
            by {beat.producer} producer
          </span>
          <span className="block text-sm text-gray-200">
            Genre: {beat.genre}
          </span>
          <span className="block text-sm text-gray-200">
            Price: Ksh. {beat.price}
          </span>
        </div>
        {/* Centered overlay with play/pause button */}
        {hoveredBeat === beat.id && (
          <div
            className="overlay icon absolute top-1/2 left-[40%] transform -translate-x-1/2 -translate-y-1/2 text-white cursor-pointer"
            onClick={() => handlePlayPause(beat.id)}
          >
            {activeBeat === beat.id && isPlaying ? (
              <PauseCircle size={50} style={{ opacity: 0.7 }} />
            ) : (
              <BsPlayCircle size={45} />
            )}
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
              onClick={() => {
                // Assuming addToCart function is available similarly as before.
                // If needed, you can dispatch addToCart here.
              }}
            />
          </div>
        </div>
        {/* Hidden Audio Element */}
        {beat.audio_file && (
          <audio
            id={`audio-${beat.id}`}
            preload="auto"
            crossOrigin="anonymous"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            style={{ display: "none" }}
          >
            <source
              src={`${CLOUDINARY_BASE}${beat.audio_file}`}
              type="audio/mpeg"
            />
            Your browser does not support the audio tag.
          </audio>
        )}
      </div>
    );
  };

  // Slider settings (one slide per view).
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <section className="hero">
      <div className="w-full h-auto md:h-[92vh] md:flex md:justify-between">
        {/* Left Slider */}
        <div className="w-full h-full md:w-1/2">
          <Slider {...settings}>
            {sliderBeats.map((beat) => renderBeat(beat, "slider"))}
          </Slider>
        </div>
        {/* Right Grid */}
        <div className="w-full md:w-1/2 grid grid-cols-2 grid-rows-2 h-[92vh] sm:grid-cols-1 sm:grid-rows-4">
          {gridBeats.map((beat) => renderBeat(beat, "grid"))}
        </div>
      </div>
      {/* Audio Player */}
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
    </section>
  );
};
