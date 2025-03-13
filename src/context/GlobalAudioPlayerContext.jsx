import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [audioSrc, setAudioSrc] = useState(null);
  const [activeBeat, setActiveBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(new Audio());

  // When audioSrc changes, load new source.
  useEffect(() => {
    if (audioSrc) {
      const audio = audioRef.current;
      audio.src = audioSrc;
      audio.load();
      audio.play().then(() => setIsPlaying(true));
    }
  }, [audioSrc]);

  // Time updates and metadata
  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const playTrack = ({ src, beatId }) => {
    // If a different track is requested, pause the current one first.
    if (activeBeat !== beatId) {
      audioRef.current.pause();
      setActiveBeat(beatId);
      setAudioSrc(src);
    } else {
      // If the same track is requested, toggle play/pause.
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const seek = (newTime) => {
    audioRef.current.currentTime = newTime;
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        activeBeat,
        isPlaying,
        currentTime,
        duration,
        progress,
        playTrack,
        seek,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
