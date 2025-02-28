import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBeatById } from "../../store/BeatSlice";
import { add } from "../../store/CartSlice";
import { PlayCircle, PauseCircle } from "lucide-react";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dqmbquytc/";

export const BeatDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { beatDetails, loading, error } = useSelector((state) => state.beat);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    dispatch(getBeatById(id));
  }, [dispatch, id]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
      setShowPlayer(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - boundingRect.left;
    const newTime = (clickX / boundingRect.width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const addToCart = (beat) => {
    dispatch(add(beat));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {beatDetails ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
            <div
              className="relative"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <img
                src={`${CLOUDINARY_BASE}${beatDetails.image}`}
                alt={beatDetails.title}
                className="w-full"
              />
              {hovered && (
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white"
                >
                  {isPlaying ? (
                    <PauseCircle size={50} />
                  ) : (
                    <PlayCircle size={50} />
                  )}
                </button>
              )}
            </div>
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

            {/* Add to Cart Button */}
            <button
              onClick={() => addToCart(beatDetails)}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
            >
              Add to Cart
            </button>

            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              preload="auto"
              className="hidden"
            >
              <source
                src={`${CLOUDINARY_BASE}${beatDetails.audio_file}`}
                type="audio/mpeg"
              />
              Your browser does not support the audio tag.
            </audio>
          </div>
        ) : (
          <p>Beat not found</p>
        )}
      </div>

      {/* Persistent playbar at the bottom */}
      {showPlayer && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex items-center">
          <button onClick={handlePlayPause} className="mr-4">
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
