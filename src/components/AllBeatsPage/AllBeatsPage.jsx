import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../store/CartSlice";
import { getBeats } from "../../store/BeatSlice";
import { Link } from "react-router-dom";
import { PlayCircle, PauseCircle } from "lucide-react";

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
    console.log("Audio element found:", { id, paused: audioElement.paused });

    // Pause any other audio that might be playing
    if (currentAudio.current && currentAudio.current !== audioElement) {
      console.log("Pausing currently playing audio:", currentAudio.current);
      currentAudio.current.pause();
    }

    if (audioElement.paused) {
      console.log("Playing audio element with id:", id);
      audioElement
        .play()
        .then(() => {
          console.log("Audio play promise resolved");
          currentAudio.current = audioElement;
          setActiveBeat(id);
          setIsPlaying(true);
          setShowPlayer(true);
        })
        .catch((error) => {
          console.error("Error playing audio: ", error);
        });
    } else {
      console.log("Pausing audio element with id:", id);
      audioElement.pause();
      setIsPlaying(false);
      setActiveBeat(id);
    }
  };

  const handleTimeUpdate = (e) => {
    const audio = e.target;
    console.log("handleTimeUpdate:", {
      currentTime: audio.currentTime,
      duration: audio.duration,
      eventType: e.type,
    });
    setCurrentTime(audio.currentTime);
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleLoadedMetadata = (e) => {
    const audio = e.target;
    console.log("handleLoadedMetadata:", {
      duration: audio.duration,
      eventType: e.type,
    });
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
      console.log("handleSeek:", {
        clickX,
        boundingRect,
        newTime,
        duration: currentAudio.current.duration,
        readyState: currentAudio.current.readyState,
      });

      currentAudio.current.currentTime = newTime;

      const onSeeked = () => {
        console.log(
          "Audio seeked event fired, currentTime:",
          currentAudio.current.currentTime
        );
        setCurrentTime(currentAudio.current.currentTime);
        setProgress(
          (currentAudio.current.currentTime / currentAudio.current.duration) *
            100
        );
        currentAudio.current.removeEventListener("seeked", onSeeked);
      };
      currentAudio.current.addEventListener("seeked", onSeeked);

      setTimeout(() => {
        console.log(
          "After timeout, currentTime:",
          currentAudio.current.currentTime
        );
        setCurrentTime(currentAudio.current.currentTime);
        setProgress(
          (currentAudio.current.currentTime / currentAudio.current.duration) *
            100
        );
      }, 100);
    } else {
      console.log("handleSeek: No currentAudio available.");
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
            className="bg-white shadow-md rounded-lg overflow-hidden p-4 relative"
            onMouseEnter={() => setHoveredBeat(beat.id)}
            onMouseLeave={() => setHoveredBeat(null)}
          >
            <div className="relative">
              <img
                src={`${CLOUDINARY_BASE}${beat.image}`}
                alt={beat.title}
                className="w-full"
              />
              {hoveredBeat === beat.id && (
                <button
                  onClick={() => handlePlayPause(beat.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white"
                >
                  {activeBeat === beat.id && isPlaying ? (
                    <PauseCircle size={50} />
                  ) : (
                    <PlayCircle size={50} />
                  )}
                </button>
              )}
            </div>
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
            {/* Audio element */}
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
