import React, { useState, useRef, useEffect } from 'react';
import { tracks } from './data/tracks';
import { SkipBack, Play, Pause, SkipForward, Volume2 } from 'lucide-react';

import './styles/App.css';

function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    setProgress(0); // Reset progress when track changes
    setIsPlaying(false); // Stop auto play after switching
  }, [currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
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
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const togglePlayPause = () => {
    if (!isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Playback error:', err));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="glass-container">
      <img
        src={currentTrack.cover}
        alt={currentTrack.title}
        className="track-cover"
      />

      <h2>{currentTrack.title}</h2>
      <p>{currentTrack.artist}</p>

      <audio
        ref={audioRef}
        src={currentTrack.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="controls">
        <button onClick={handlePrevious}>
          <SkipBack size={24} />
        </button>
        <button onClick={togglePlayPause}>
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={handleNext}>
          <SkipForward size={24} />
        </button>
      </div>

      <div className="progress">
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

      <div className="volume">
        <Volume2 size={20} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>

      <div className="next-track">
        <h4>Up Next:</h4>
        <p>{tracks[(currentTrackIndex + 1) % tracks.length].title}</p>
      </div>
    </div>
  );
}

export default App;
