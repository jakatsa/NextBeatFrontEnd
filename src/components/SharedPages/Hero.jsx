import React, { useEffect, useState } from "react";
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
import { useAudioPlayer } from "../../context/GlobalAudioPlayerContext"; // use global audio player

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
  const [hoveredBeat, setHoveredBeat] = useState(null);
  const [dropdownBeatId, setDropdownBeatId] = useState(null);

  // Use global audio player context.
  const { playTrack, activeBeat, isPlaying } = useAudioPlayer();

  // Fetch beats on mount.
  useEffect(() => {
    dispatch(getBeats());
  }, [dispatch]);

  // Updated splitting: first three beats for slider; rest for grid.
  const sliderBeats = beats.slice(0, 3);
  const gridBeats = beats.slice(3);

  // When a user clicks play, call the global playTrack.
  const handlePlayPause = (beat) => {
    playTrack({
      src: `${CLOUDINARY_BASE}${beat.audio_file}`,
      beatId: beat.id,
    });
  };

  // Toggle dropdown for three-dots icon.
  const toggleDropdown = (beatId) => {
    setDropdownBeatId((prev) => (prev === beatId ? null : beatId));
  };

  // Render function for a beat card in the hero section.
  // The "variant" parameter defines layout: "slider" for left slider, "grid" for right grid.
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
            onClick={() => handlePlayPause(beat)}
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
                // Add cart functionality if needed.
              }}
            />
          </div>
        </div>
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
      {/* Note: The global audio player is rendered globally and not within this component */}
    </section>
  );
};
