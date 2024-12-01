import React, { useState, useRef, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
} from "lucide-react";

const CustomVideoPlayer = ({ src }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleProgress = useCallback((state) => {
    setCurrentTime(state.playedSeconds);
  }, []);

  const handleDuration = useCallback((duration) => {
    setDuration(duration);
  }, []);

  const handleSeek = useCallback((value) => {
    const newTime = value[0];
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  }, []);

  const handleVolumeChange = useCallback((value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 1 : 0);
  }, [isMuted]);

  const handleSpeedChange = useCallback((speed) => {
    setPlaybackRate(speed);
    setShowSettings(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  const skipForward = useCallback(() => {
    playerRef.current.seekTo(currentTime + 10);
  }, [currentTime]);

  const skipBackward = useCallback(() => {
    playerRef.current.seekTo(currentTime - 10);
  }, [currentTime]);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#2D1B69] rounded-lg overflow-hidden group aspect-video"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={src}
        width="100%"
        height="100%"
        playing={isPlaying}
        volume={volume}
        muted={isMuted}
        playbackRate={playbackRate}
        onProgress={handleProgress}
        onDuration={handleDuration}
        className="absolute top-0 left-0"
      />

      {/* Center Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Video Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <div className="px-4 pt-8">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/80">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <span className="text-xs text-white/80">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={skipBackward}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button
                onClick={skipForward}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Settings className="h-5 w-5" />
              </Button>
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 p-3 bg-black/90 rounded-lg min-w-[200px]">
                  <div className="text-sm text-white mb-2">Playback Speed</div>
                  <div className="grid grid-cols-4 gap-1">
                    {[0.5, 1, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-2 py-1 rounded ${
                          playbackRate === speed
                            ? "bg-white/20"
                            : "hover:bg-white/10"
                        } text-white text-sm`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;

