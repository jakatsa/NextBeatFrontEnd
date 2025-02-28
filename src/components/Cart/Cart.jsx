import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { remove, setCart } from "../../store/CartSlice";
import { PlayCircle, PauseCircle } from "lucide-react";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dqmbquytc/";

export const Cart = () => {
  const dispatch = useDispatch();
  const [hoveredBeat, setHoveredBeat] = useState(null);
  const [activeBeat, setActiveBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);

  const cartItems = useSelector((state) => state.cart);
  const currentAudio = useRef(null);

  // Load cart from local storage when the component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        dispatch(setCart(parsedCart));
      } catch (error) {
        console.error("Error parsing cart from local storage:", error);
      }
    }
  }, [dispatch]);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems");
    }
  }, [cartItems]);

  const handlePlayPause = (beatId) => {
    const audioElement = document.getElementById(`audio-${beatId}`);
    if (!audioElement) return;

    // Pause any other playing audio
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
    if (audio.id === `audio-${activeBeat}`) {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleLoadedMetadata = (e) => {
    const audio = e.target;
    if (audio.id === `audio-${activeBeat}`) {
      setDuration(audio.duration);
    }
  };

  const handleSeek = (e) => {
    if (!currentAudio.current) return;
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - boundingRect.left;
    const newTime =
      (clickX / boundingRect.width) * currentAudio.current.duration;
    currentAudio.current.currentTime = newTime;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const removeFromCart = (id) => {
    dispatch(remove(id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Cart Items</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        cartItems.map((beat) => (
          <div key={beat.id} className="my-4 p-4 bg-gray-100 rounded shadow">
            {/* Display beat image if available */}
            {beat.image && (
              <div
                className="relative mb-4"
                onMouseEnter={() => setHoveredBeat(beat.id)}
                onMouseLeave={() => setHoveredBeat(null)}
              >
                <img
                  src={`${CLOUDINARY_BASE}${beat.image}`}
                  alt={beat.title}
                  className="w-full h-48 object-cover"
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
            )}
            <h2 className="text-lg font-bold">{beat.title}</h2>
            <p>Genre: {beat.genre}</p>
            <p>Price: Ksh. {beat.price}</p>
            <p>Created on: {new Date(beat.created_at).toLocaleDateString()}</p>
            {/* Hidden audio element with Cloudinary URL */}
            <audio
              id={`audio-${beat.id}`}
              preload="auto"
              crossOrigin="anonymous"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="hidden"
            >
              <source
                src={`${CLOUDINARY_BASE}${beat.audio_file}`}
                type="audio/mpeg"
              />
              Your browser does not support the audio tag.
            </audio>
            <div className="mt-2">
              <button
                onClick={() => removeFromCart(beat.id)}
                className="py-1 px-4 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove From Cart
              </button>
              <button className="ml-4 py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                Check Out
              </button>
            </div>
          </div>
        ))
      )}

      {/* Persistent playbar at the bottom */}
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

export default Cart;
