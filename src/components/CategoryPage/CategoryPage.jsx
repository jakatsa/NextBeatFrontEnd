import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PlayCircle, PauseCircle } from "lucide-react";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dqmbquytc/";

const CategoryPage = () => {
  const { slug } = useParams();
  const [categoryBeats, setCategoryBeats] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredBeat, setHoveredBeat] = useState(null);
  const [activeBeat, setActiveBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const currentAudio = useRef(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryResponse = await axios.get(
          `https://nextbeatbackend.onrender.com/beats/api/categories/`
        );
        const currentCategory = categoryResponse.data.find(
          (c) => c.slug === slug
        );
        setCategory(currentCategory);

        if (currentCategory) {
          const beatsResponse = await axios.get(
            `https://nextbeatbackend.onrender.com/beats/api/beat/`
          );
          const filteredBeats = beatsResponse.data.filter((beat) =>
            beat.categories.includes(currentCategory.id)
          );
          setCategoryBeats(filteredBeats);
        }
      } catch (error) {
        console.error("Error fetching category or beats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

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

  if (loading) return <p>Loading...</p>;
  if (!category) return <p>Category not found!</p>;

  return (
    <div key={category.id} className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
      {categoryBeats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryBeats.map((beat) => (
            <div
              key={beat.id}
              className="bg-white shadow-md rounded-lg overflow-hidden p-4"
            >
              <div
                className="relative"
                onMouseEnter={() => setHoveredBeat(beat.id)}
                onMouseLeave={() => setHoveredBeat(null)}
              >
                <img
                  src={
                    beat.image
                      ? `${CLOUDINARY_BASE}${beat.image}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={beat.title}
                  className="w-full h-48 object-cover mb-4"
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
              <h3 className="text-lg font-semibold">{beat.title}</h3>
              <p className="text-gray-500">Genre: {beat.genre}</p>
              <p className="text-gray-500">Price: Ksh. {beat.price}</p>
              {/* Hidden audio element with Cloudinary URL and event handlers */}
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
            </div>
          ))}
        </div>
      ) : (
        <p>No beats available in this category.</p>
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

export default CategoryPage;
