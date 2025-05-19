import React, { useState, useRef, useEffect } from 'react';
import { tracks } from './data/tracks';
import { SkipBack, Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Motion imports
import './styles/App.css';

function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [direction, setDirection] = useState(0); // ⬅️ Track direction

  const audioRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex];
  const prevTrack =
    tracks[(currentTrackIndex - 1 + tracks.length) % tracks.length];
  const nextTrack = tracks[(currentTrackIndex + 1) % tracks.length];

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
    setDirection(1); // ➡️ slide right
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const handlePrevious = () => {
    setDirection(-1); // ⬅️ slide left
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
      {/* Card Carousel */}
      <div className="card-carousel">
        <div className="card-container prev">
          <div className="card-glass">
            <img src={prevTrack.cover} alt={prevTrack.title} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrackIndex}
            className="card-container current"
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="card-glass">
              <img src={currentTrack.cover} alt={currentTrack.title} />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="card-container next">
          <div className="card-glass">
            <img src={nextTrack.cover} alt={nextTrack.title} />
          </div>
        </div>
      </div>

      <h2>{currentTrack.title}</h2>
      <p>{currentTrack.artist}</p>

      <audio
        ref={audioRef}
        src={currentTrack.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Controls */}
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

      {/* Progress Bar */}
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

      {/* Volume */}
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

      {/* Up Next */}
      <div className="next-track">
        <h4>Up Next:</h4>
        <p>{nextTrack.title}</p>
      </div>
    </div>
  );
}

export default App;
