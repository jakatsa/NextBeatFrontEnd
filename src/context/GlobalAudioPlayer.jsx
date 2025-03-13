import React from "react";
import { PauseCircle, PlayCircle } from "lucide-react";
import { useAudioPlayer } from "./GlobalAudioPlayerContext";

const GlobalAudioPlayer = () => {
  const {
    isPlaying,
    currentTime,
    duration,
    progress,
    playTrack,
    seek,
    activeBeat,
  } = useAudioPlayer();

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeek = (e) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - boundingRect.left;
    const newTime = (clickX / boundingRect.width) * duration;
    seek(newTime);
  };

  // For simplicity, the play button here toggles play/pause for the current track.
  // (To change track, use the playTrack method from your pages.)
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex items-center z-[9999]">
      <button
        onClick={() => activeBeat && playTrack({ src: "", beatId: activeBeat })}
        className="mr-4"
      >
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
  );
};

export default GlobalAudioPlayer;
