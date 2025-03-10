import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../store/CartSlice";
import { getBeats } from "../../store/BeatSlice";
import { Link } from "react-router-dom";
import { PlayCircle, PauseCircle } from "lucide-react";
import { AiFillPlayCircle, AiOutlineHeart } from "react-icons/ai";
import { BsPlayCircle, BsThreeDots } from "react-icons/bs";

console.log("all beats loaded");

const CLOUDINARY_BASE = "https://res.cloudinary.com/dqmbquytc/";

export const AllBeatsPage = () => {
  const dispatch = useDispatch();
  const { data: beats } = useSelector((state) => state.beat);
  const currentAudio = useRef(null);

  const [activeBeat, setActiveBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredBeat, setHoveredBeat] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    dispatch(getBeats());
  }, [dispatch]);

  const handlePlayPause = (beatId) => {
    let id = beatId || activeBeat;
    if (!id && currentAudio.current) {
      id = currentAudio.current.id.split("-")[1];
      console.log("handlePlayPause: Using id from currentAudio:", id);
    }
    if (!id) {
      console.log("No valid id found. Exiting handlePlayPause.");
      return;
    }
    const audioElement = document.getElementById(`audio-${id}`);
    if (!audioElement) {
      console.log("No audio element found for id:", id);
      return;
    }
    console.log("handlePlayPause called", {
      beatId,
      determinedId: id,
      activeBeat,
      isPlaying,
    });

    // Pause any other audio that might be playing
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
        .catch((error) => {
          console.error("Error playing audio: ", error);
        });
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
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const addToCart = (beat) => {
    console.log("Adding beat to cart:", beat);
    dispatch(add(beat));
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
            {/* Image Container with increased height (h-80) */}
            <div className="relative h-80">
              <img
                src={`${CLOUDINARY_BASE}${beat.image}`}
                alt={beat.title}
                className="w-full h-full object-cover rounded-md"
              />
              {/* Centered play/pause overlay */}
              {hoveredBeat === beat.id && (
                <div className="overlay absolute top-1/2 left-[40%] transform -translate-x-1/2 -translate-y-1/2 text-white">
                  <button
                    onClick={() => handlePlayPause(beat.id)}
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
              <div className="overlay absolute bottom-0 right-0 text-white">
                <div className="flex p-3">
                  <AiOutlineHeart size={22} className="mx-3" />
                  <BsThreeDots size={22} />
                </div>
              </div>
            </div>
            {/* Card Text */}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {beat.title}
              </h2>
              <h3 className="text-md text-gray-700">
                by {beat.producer} producer
              </h3>
              <p className="text-gray-600 mt-2">Genre: {beat.genre}</p>
              <p className="text-gray-600">Price: Ksh. {beat.price}</p>
              <p className="text-gray-500 text-sm">
                Created on: {new Date(beat.created_at).toLocaleDateString()}
              </p>
              {/* Hidden Audio Element */}
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
              <button
                onClick={() => addToCart(beat)}
                className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
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
