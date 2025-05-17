import React, { useState, useRef, useEffect } from "react";
import { tracks } from "./data/tracks";

function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [currentTrackIndex, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  const handleProgressChange = (e) => {
    const value = parseFloat(e.target.value);
    audioRef.current.currentTime = value;
    setProgress(value);
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    audioRef.current.volume = value;
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div>
      <h2>{currentTrack.title}</h2>
      <p>{currentTrack.artist}</p>
      <audio
        ref={audioRef}
        src={currentTrack.audio}
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div>
        <button onClick={handlePrevious}>⏮️</button>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        <button onClick={handleNext}>⏭️</button>
      </div>

      <div>
        <input
          type="range"
          min="0"
          max={duration}
          value={progress}
          onChange={handleProgressChange}
        />
        <span>
          {Math.floor(progress)} / {Math.floor(duration)} sec
        </span>
      </div>

      <div>
        <label>🔊</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>

      <div>
        <h4>Up Next:</h4>
        <p>{tracks[(currentTrackIndex + 1) % tracks.length].title}</p>
      </div>
    </div>
  );
}

export default App;
