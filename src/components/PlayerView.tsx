import React, { useState } from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Download,
  CheckCircle2,
  HardDrive,
  Cloud,
  Sliders,
  FileText,
  Gauge,
  Sparkles
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { AudioVisualizer } from './AudioVisualizer';

export const PlayerView: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    playbackMode,
    playbackSpeed,
    isPlayerModalOpen,
    setIsPlayerModalOpen,
    setIsEqualizerModalOpen,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setPlaybackMode,
    toggleFavorite,
    downloadSong,
    setPlaybackSpeed,
    themeConfig
  } = useMusic();

  const [showLyrics, setShowLyrics] = useState<boolean>(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);

  if (!isPlayerModalOpen || !currentSong) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    seek(newTime);
  };

  const toggleRepeat = () => {
    if (playbackMode === 'repeat-off') setPlaybackMode('repeat-all');
    else if (playbackMode === 'repeat-all') setPlaybackMode('repeat-one');
    else if (playbackMode === 'repeat-one') setPlaybackMode('shuffle');
    else setPlaybackMode('repeat-off');
  };

  return (
    <div
      id="full-player-view"
      className="fixed inset-0 z-50 backdrop-blur-3xl flex flex-col justify-between p-4 overflow-y-auto max-w-md mx-auto animate-in fade-in slide-in-from-bottom-6 duration-300 border-x"
      style={{ 
        backgroundColor: themeConfig.bgDark, 
        borderColor: themeConfig.surfaceBorder 
      }}
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setIsPlayerModalOpen(false)}
          id="btn-collapse-player"
          className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          title="Minimize"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: themeConfig.accent }}>
              {themeConfig.name} Playback
            </span>
          </div>
          <p className="text-xs font-bold text-slate-100 truncate max-w-[180px]">
            {currentSong.movie ? `${currentSong.movie} Melodies` : 'Selected Tracks'}
          </p>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsEqualizerModalOpen(true)}
            id="btn-open-eq-from-player"
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Open Equalizer"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            id="btn-toggle-lyrics"
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              showLyrics ? 'text-white bg-white/20' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Telugu Lyrics"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Center Area: Vinyl Disc / Album Cover OR Lyrics */}
      <div className="my-auto py-2 flex flex-col items-center justify-center">
        {showLyrics ? (
          <div 
            className="w-full max-h-64 overflow-y-auto rounded-2xl p-4 border text-center space-y-3 shadow-inner"
            style={{ 
              backgroundColor: `${themeConfig.surfaceDark}f0`,
              borderColor: themeConfig.surfaceBorder 
            }}
          >
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300">
              <Sparkles className="w-3 h-3" style={{ color: themeConfig.accent }} />
              <span>Track Lyrics</span>
            </div>
            {currentSong.lyrics && currentSong.lyrics.length > 0 ? (
              currentSong.lyrics.map((line, idx) => (
                <p
                  key={idx}
                  className={`text-xs leading-relaxed transition-all ${
                    idx === 1 || idx === 2 ? 'text-white font-bold scale-105 drop-shadow-sm' : 'text-slate-400'
                  }`}
                >
                  {line}
                </p>
              ))
            ) : (
              <p className="text-slate-400 text-xs">Lyrics unavailable for this track</p>
            )}
          </div>
        ) : (
          <div className="relative group my-0.5">
            {/* Ambient Back-Glow */}
            <div
              className={`absolute -inset-4 rounded-full blur-2xl transition-opacity duration-700 ${
                isPlaying ? 'opacity-70 animate-pulse' : 'opacity-10'
              }`}
              style={{ backgroundColor: `${themeConfig.primary}40` }}
            />

            {/* Vinyl Record Visual */}
            <div
              className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-1.5 bg-gradient-to-tr from-black via-zinc-900 to-zinc-950 shadow-2xl border-2 flex items-center justify-center ${
                isPlaying ? 'animate-spin-slow' : 'animate-spin-slow animate-spin-paused'
              }`}
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              {/* Vinyl grooves */}
              <div className="w-full h-full rounded-full border border-white/5 p-2.5 flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-white/10 p-2.5 flex items-center justify-center">
                  <div 
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-inner border relative group"
                    style={{ borderColor: themeConfig.surfaceBorder }}
                  >
                    <img
                      src={currentSong.albumArt}
                      alt={currentSong.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent" />
                  </div>
                </div>
              </div>
              {/* Center Spindle Hole */}
              <div 
                className="absolute w-6 h-6 rounded-full bg-zinc-950 border flex items-center justify-center shadow-lg"
                style={{ borderColor: themeConfig.primary }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeConfig.primary }} />
              </div>
            </div>
          </div>
        )}

        {/* Live Audio Visualizer */}
        <div className="w-full h-6 mt-3 px-4">
          <AudioVisualizer isPlaying={isPlaying} color={themeConfig.primary} barCount={28} />
        </div>
      </div>

      {/* Song Metadata & Storage Source Badge */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-white truncate tracking-tight">{currentSong.title}</h2>
            <p className="text-xs font-semibold truncate" style={{ color: themeConfig.accent }}>{currentSong.artist}</p>
            {currentSong.movie && (
              <p className="text-[10px] text-slate-400 mt-0.5">Movie: <span className="text-slate-200 font-medium">{currentSong.movie}</span></p>
            )}
          </div>

          <button
            onClick={() => toggleFavorite(currentSong.id)}
            id="btn-player-fav"
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Heart 
              className={`w-5 h-5 ${currentSong.isFavorite ? 'text-rose-500 fill-rose-500 animate-heartbeat' : 'text-slate-400 hover:text-white'}`} 
            />
          </button>
        </div>

        {/* Real-time Storage & Audio Source indicator */}
        <div 
          className="flex items-center justify-between text-[10px] py-1 px-2.5 rounded-xl border shadow-inner"
          style={{ 
            backgroundColor: `${themeConfig.surfaceDark}cc`,
            borderColor: themeConfig.surfaceBorder 
          }}
        >
          <div className="flex items-center gap-1.5 truncate">
            {currentSong.isDownloaded ? (
              <>
                <HardDrive className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-medium truncate">
                  Offline Disk ({currentSong.localPath?.split('/').pop() || 'Local'})
                </span>
              </>
            ) : (
              <>
                <Cloud className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="text-slate-300 font-medium truncate">Cloud Stream (Supabase / S3)</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400 text-[10px]">{currentSong.fileSizeMb} MB</span>
            {!currentSong.isDownloaded ? (
              <button
                onClick={() => downloadSong(currentSong)}
                id="btn-player-download"
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-tr ${themeConfig.gradient} text-white text-[10px] font-semibold transition-all shadow cursor-pointer`}
              >
                <Download className="w-2.5 h-2.5" />
                <span>Save Offline</span>
              </button>
            ) : (
              <span className="flex items-center gap-0.5 text-emerald-400 font-medium text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>Saved</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Scrubber & Timestamps */}
      <div className="space-y-1 pt-1.5">
        <input
          type="range"
          min="0"
          max="100"
          value={progressPercent || 0}
          onChange={handleSeek}
          id="player-scrubber"
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: themeConfig.primary }}
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span className="text-[9px] text-slate-500 font-sans">{themeConfig.name} Audio</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Playback Controls */}
      <div className="flex items-center justify-between pt-1 pb-1">
        {/* Shuffle / Repeat */}
        <button
          onClick={toggleRepeat}
          id="btn-player-repeat"
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            playbackMode !== 'repeat-off' ? 'text-white bg-white/15' : 'text-slate-400 hover:text-white'
          }`}
          title={`Mode: ${playbackMode}`}
        >
          {playbackMode === 'shuffle' ? (
            <Shuffle className="w-4 h-4" />
          ) : playbackMode === 'repeat-one' ? (
            <Repeat1 className="w-4 h-4" />
          ) : (
            <Repeat className="w-4 h-4" />
          )}
        </button>

        {/* Previous */}
        <button
          onClick={playPrevious}
          id="btn-player-prev"
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 cursor-pointer"
          title="Previous Track"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        {/* Play / Pause Giant Button */}
        <button
          onClick={togglePlayPause}
          id="btn-player-playpause"
          className={`w-13 h-13 rounded-full bg-gradient-to-tr ${themeConfig.gradient} text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer`}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
        </button>

        {/* Next */}
        <button
          onClick={playNext}
          id="btn-player-next"
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 cursor-pointer"
          title="Next Track"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        {/* Playback Speed dropdown toggle */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            id="btn-player-speed"
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-slate-200 border border-white/10 transition-colors cursor-pointer"
            title="Playback Speed"
          >
            <Gauge className="w-3 h-3 text-slate-400" />
            <span>{playbackSpeed}x</span>
          </button>

          {showSpeedMenu && (
            <div 
              className="absolute bottom-9 right-0 border rounded-xl p-1 shadow-xl flex flex-col gap-0.5 z-50 min-w-[65px]"
              style={{ 
                backgroundColor: themeConfig.surfaceDark,
                borderColor: themeConfig.surfaceBorder 
              }}
            >
              {[0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    setPlaybackSpeed(speed);
                    setShowSpeedMenu(false);
                  }}
                  className={`px-2 py-0.5 text-[10px] rounded-md text-left transition-colors cursor-pointer ${
                    playbackSpeed === speed ? 'text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                  }`}
                  style={playbackSpeed === speed ? { backgroundColor: themeConfig.primary } : {}}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
